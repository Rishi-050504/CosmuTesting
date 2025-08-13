import { Request, Response } from 'express';
import fsExtra from 'fs-extra';
import { generateChecklistFromSrs, analyzeCodeForRequirement } from '../services/geminiService';
import { createTempDir, unzipProject, getProjectTreeAndContent } from '../services/zipService';
import path from 'path';
import archiver from 'archiver';

// In-memory state to hold the temporary directory path for a session
let currentAnalysis: { tempDir: string } = { tempDir: '' };

/**
 * @description Handles SRS file upload and generates a compliance checklist.
 */
export const generateChecklist = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  if (!files.srs) {
    return res.status(400).json({ message: "SRS file(s) are required." });
  }

  try {
    const checklist = await generateChecklistFromSrs(files.srs);
    // Return the checklist to the user for review
    res.status(200).json({ checklist });
  } catch (error: any) {
    console.error("Error in generateChecklist controller:", error);
    res.status(500).json({ message: "Failed to generate checklist.", error: error.message });
  } finally {
    // Clean up the temporarily stored SRS files
    files.srs.forEach(file => fsExtra.remove(file.path));
  }
};

/**
 * @description Handles project zip upload and analyzes code against a provided checklist.
 */
export const analyzeCode = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const projectZip = files.project?.[0];
  const checklist = JSON.parse(req.body.checklist);

  if (!projectZip || !checklist) {
    return res.status(400).json({ message: "A project ZIP file and a checklist are required." });
  }
  
  const tempDir = createTempDir();
  currentAnalysis.tempDir = tempDir; // Store tempDir for update and download

  try {
    await unzipProject(projectZip, tempDir);
    const fileContents = await getProjectTreeAndContent(tempDir);
    
    const fileIssues: Record<string, any> = {};

    for (const item of checklist) {
        const analysisResult = await analyzeCodeForRequirement({
            requirementText: item.text,
            fileContents: fileContents
        });

        if (analysisResult && !analysisResult.isCompliant) {
            const filePath = analysisResult.filePath;
            if (filePath && !fileIssues[filePath]) {
                 fileIssues[filePath] = {
                    issue: analysisResult.issue,
                    language: path.extname(filePath).substring(1),
                    original: analysisResult.originalCode,
                    suggestion: analysisResult.suggestedCode
                };
            }
        }
    }
    
    res.status(200).json({ checklist, fileIssues, fileContents });

  } catch (error: any) {
    console.error("Error in analyzeCode controller:", error);
    res.status(500).json({ message: "An internal server error occurred during code analysis.", error: error.message });
  } finally {
    if (projectZip) {
      fsExtra.remove(projectZip.path);
    }
  }
};

/**
 * @description Updates a single file in the temporary directory with new content.
 */
export const updateFile = async (req: Request, res: Response) => {
    const { filePath, newContent } = req.body;
    if (!filePath || typeof newContent !== 'string') {
        return res.status(400).send({ message: "File path and new content are required." });
    }
    
    const fullPath = path.join(currentAnalysis.tempDir, filePath);

    if (!fullPath.startsWith(currentAnalysis.tempDir)) {
        return res.status(400).send({ message: "Invalid file path." });
    }

    try {
        await fsExtra.writeFile(fullPath, newContent);
        res.status(200).send({ message: "File updated successfully." });
    } catch (error) {
        console.error("Error updating file:", error);
        res.status(500).send({ message: "Failed to update file." });
    }
};

/**
 * @description Zips and sends the refactored project for download.
 */
export const downloadProject = async (req: Request, res: Response) => {
    const tempDir = currentAnalysis.tempDir;
    if (!tempDir || !fsExtra.existsSync(tempDir)) {
        return res.status(404).send({ message: "No project found to download or session expired." });
    }

    res.attachment('refactored-project.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(res);
    archive.directory(tempDir, false);
    await archive.finalize();

    fsExtra.remove(tempDir);
    currentAnalysis = { tempDir: '' }; // Reset state
};