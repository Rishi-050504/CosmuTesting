import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import fsExtra from 'fs-extra';

// Create a unique temporary directory for each analysis
export const createTempDir = (): string => {
  const dirPath = path.join('uploads', `temp_${Date.now()}`);
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
};

// Unzip the project file and return the directory path and file list
export const unzipProject = (zipFile: Express.Multer.File, destination: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const filePaths: string[] = [];
    fs.createReadStream(zipFile.path)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        // Ensure we don't extract files outside the destination (Zip Slip vulnerability)
        const safePath = path.join(destination, entry.path);
        if (!safePath.startsWith(destination)) {
          entry.autodrain();
          return;
        }

        if (entry.type === 'File') {
          filePaths.push(entry.path); // Store relative path
          const dir = path.dirname(safePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          entry.pipe(fs.createWriteStream(safePath));
        } else {
          entry.autodrain();
        }
      })
      .on('finish', () => resolve(filePaths))
      .on('error', reject);
  });
};

// Get the entire file tree structure and content
export const getProjectTreeAndContent = async (dir: string) => {
    const fileContents: Record<string, string> = {};
    const files = await fsExtra.readdir(dir, { recursive: true });
    for (const file of files) {
        const filePath = path.join(dir, file as string);
        const stats = await fsExtra.stat(filePath);
        if (stats.isFile()) {
            fileContents[file as string] = await fsExtra.readFile(filePath, 'utf-8');
        }
    }
    return fileContents;
};