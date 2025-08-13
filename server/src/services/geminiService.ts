// import { GoogleGenerativeAI } from '@google/generative-ai';
// import pdf from 'pdf-parse';
// import fs from 'fs';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// export const generateChecklistFromSrs = async (files: Express.Multer.File[]): Promise<any> => {
//   try {
//     let combinedSrsText = '';

//     for (const file of files) {
//         console.log(`[geminiService] Reading file: ${file.originalname}`);
//         const dataBuffer = fs.readFileSync(file.path);
        
//         if (file.mimetype === 'application/pdf') {
//             const pdfData = await pdf(dataBuffer);
//             combinedSrsText += pdfData.text + '\n\n';
//         } else if (file.mimetype === 'text/plain') {
//             combinedSrsText += dataBuffer.toString('utf8') + '\n\n';
//         } else {
//             console.warn(`[geminiService] Unsupported file type: ${file.mimetype}. Skipping file: ${file.originalname}`);
//         }
//     }

//     if (!combinedSrsText || combinedSrsText.trim().length < 100) {
//         throw new Error("The provided documents do not contain enough readable text to be valid.");
//     }
//     console.log('[geminiService] All documents parsed successfully.');

//     const prompt = `
//       You are a senior software quality assurance analyst. Your task is to analyze the following Software Requirements Specification (SRS) text and generate a compliance checklist. Do not give any introduction , just 10 main points 
//       The output MUST be a valid JSON object that contains a single key "checklist", which holds an array of objects. Each object in the array should represent a single, verifiable requirement from the SRS and have the following structure:
//       {
//         "id": <a unique integer number for the requirement>,
//         "text": "<a string containing the exact requirement from the SRS>",
//         "compliant": <a boolean value, which you should set to true or false based on code review>
//       }
//       Do NOT include any explanations, introductory text, or markdown formatting like \`\`\`json in your response. The response should only be the raw JSON object itself.
//       SRS text:
//       ---
//       ${combinedSrsText.substring(0, 30000)} 
//       ---
//     `;
    
//     console.log('[geminiService] Sending request to Gemini...');
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const rawText = response.text();

//     if (!rawText) {
//       throw new Error("Gemini API returned an empty or null response content.");
//     }
//     console.log('[geminiService] Received raw content from Gemini:', rawText);
    
//     // FIX: More robustly find and extract the JSON object from the response string.
//     const jsonStartIndex = rawText.indexOf('{');
//     const jsonEndIndex = rawText.lastIndexOf('}') + 1;

//     if (jsonStartIndex === -1 || jsonEndIndex === 0) {
//         throw new Error("Could not find a valid JSON object in the AI response.");
//     }

//     const jsonString = rawText.substring(jsonStartIndex, jsonEndIndex);
//     const parsedResult = JSON.parse(jsonString);
    
//     if (!parsedResult.checklist || !Array.isArray(parsedResult.checklist)) {
//         console.error('[geminiService] Failed to find a checklist array in the parsed JSON.', parsedResult);
//         throw new Error("The AI response did not contain a valid 'checklist' array.");
//     }
    
//     console.log('[geminiService] Checklist generated successfully.');
//     return parsedResult.checklist;

//   } catch (error: any) {
//     console.error("!!! CRITICAL ERROR in generateChecklistFromSrs !!!");
//     console.error('Full Error Message:', error.message);
//     throw error;
//   }
// };
// interface AnalysisInput {
//   requirementText: string;
//   fileContents: Record<string, string>;
// }

// export const analyzeCodeForRequirement = async ({ requirementText, fileContents }: AnalysisInput) => {
//   const relevantFiles = JSON.stringify(fileContents, null, 2);

//   const prompt = `
//     You are an expert code reviewer. Your task is to analyze a codebase to see if it complies with a specific requirement.
//     The output MUST be a valid JSON object. Do NOT include any explanations, introductory text, or markdown formatting.
//     When giving the final code, give the entire code, not just the changed part
//     Requirement: "${requirementText}"

//     Codebase Files:
//     ---
//     ${relevantFiles.substring(0, 100000)}
//     ---

//     Based on the requirement and the code, provide a JSON object with the following structure:
//     {
//       "isCompliant": <boolean, true if the code meets the requirement, otherwise false>,
//       "filePath": "<string, the full path of the file that is most relevant to this requirement (e.g., 'src/controllers/auth.js')>",
//       "issue": "<string, a concise, one-sentence description of the issue if not compliant, otherwise an empty string>",
//       "originalCode": "<string, the exact block of non-compliant code. Provide 5-10 lines for context. If compliant, this should be an empty string>",
//       "suggestedCode": "<string, the suggested replacement for the original code block. If compliant, this should be an empty string>"
//     }
//   `;

//   try {
//     console.log(`[geminiService] Analyzing requirement: "${requirementText}"`);
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const rawText = response.text();

//     const jsonStartIndex = rawText.indexOf('{');
//     const jsonEndIndex = rawText.lastIndexOf('}') + 1;
//     if (jsonStartIndex === -1 || jsonEndIndex === 0) {
//       throw new Error("Could not find a valid JSON object in the AI analysis response.");
//     }

//     const jsonString = rawText.substring(jsonStartIndex, jsonEndIndex);
//     return JSON.parse(jsonString);
//   } catch (error) {
//     console.error(`[geminiService] Error analyzing code for requirement: ${requirementText}`, error);
//     // Return a structured error so the process can continue
//     return {
//       isCompliant: true, // Assume compliant to avoid false positives on error
//       error: "Failed to analyze this requirement due to an API error."
//     };
//   }
// };

// export const getChatResponse = async (userMessage: string, history: any[]) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
//   const chat = model.startChat({
//     history: history,
//     generationConfig: {
//       maxOutputTokens: 200,
//     },
//   });

//   try {
//     const result = await chat.sendMessage(userMessage);
//     const response = result.response;
//     return response.text();
//   } catch (error) {
//     console.error('[geminiService] Chatbot error:', error);
//     return "I'm sorry, I encountered an error and can't respond right now.";
//   }
// };
// // --- NEW: A simple function to test the Gemini API connection ---
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';
import fs from 'fs';

// --- Initialize the AI Client ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing. Please check your .env file.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


// --- Checklist Generation from SRS Documents ---
export const generateChecklistFromSrs = async (files: Express.Multer.File[]): Promise<any[]> => {
  let combinedSrsText = '';
  for (const file of files) {
      const dataBuffer = fs.readFileSync(file.path);
      if (file.mimetype === 'application/pdf') {
          const pdfData = await pdf(dataBuffer);
          combinedSrsText += pdfData.text + '\n\n';
      } else if (file.mimetype === 'text/plain') {
          combinedSrsText += dataBuffer.toString('utf8') + '\n\n';
      }
  }

  if (!combinedSrsText || combinedSrsText.trim().length < 100) {
      throw new Error("The provided documents do not contain enough readable text.");
  }

  const prompt = `
    You are a senior software quality assurance analyst. Your task is to analyze the following Software Requirements Specification (SRS) text and generate a compliance checklist.
    The output MUST be a valid JSON object with a single key "checklist", holding an array of objects. Each object must have the following structure:
    {
      "id": <unique integer>,
      "text": "<the requirement text>",
      "compliant": false 
    }
    Set "compliant" to false by default for all items. Do NOT include explanations or markdown formatting.
    SRS text:
    ---
    ${combinedSrsText.substring(0, 30000)} 
    ---
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const jsonStartIndex = rawText.indexOf('{');
    const jsonEndIndex = rawText.lastIndexOf('}') + 1;
    const jsonString = rawText.substring(jsonStartIndex, jsonEndIndex);
    const parsedResult = JSON.parse(jsonString);
    
    if (!parsedResult.checklist || !Array.isArray(parsedResult.checklist)) {
        throw new Error("The AI response did not contain a valid 'checklist' array.");
    }
    
    return parsedResult.checklist;
  } catch (error: any) {
    console.error("!!! CRITICAL ERROR in generateChecklistFromSrs !!!", error);
    throw error;
  }
};


// --- Code Analysis against a Requirement ---
interface AnalysisInput {
  requirementText: string;
  fileContents: Record<string, string>;
}

export const analyzeCodeForRequirement = async ({ requirementText, fileContents }: AnalysisInput) => {
  const relevantFiles = JSON.stringify(fileContents, null, 2);

  const prompt = `
    You are an expert code reviewer. Your task is to analyze a codebase to see if it complies with a specific requirement.
    The output MUST be a valid JSON object. Do NOT include any explanations, introductory text, or markdown formatting.

    Requirement: "${requirementText}"

    Codebase Files:
    ---
    ${relevantFiles.substring(0, 100000)}
    ---

    Based on the requirement and the code, provide a JSON object with the following structure:
    {
      "isCompliant": <boolean, true if the code meets the requirement, otherwise false>,
      "filePath": "<string, the full path of the file that is most relevant to this requirement (e.g., 'src/controllers/auth.js')>",
      "issue": "<string, a concise, one-sentence description of the issue if not compliant, otherwise an empty string>",
      "originalCode": "<string, the exact block of non-compliant code. Provide 5-10 lines for context. If compliant, this should be an empty string>",
      "suggestedCode": "<string, the suggested replacement for the original code block. If compliant, this should be an empty string>"
    }
  `;

  try {
    console.log(`[geminiService] Analyzing requirement: "${requirementText}"`);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    const jsonStartIndex = rawText.indexOf('{');
    const jsonEndIndex = rawText.lastIndexOf('}') + 1;
    if (jsonStartIndex === -1 || jsonEndIndex === 0) {
      throw new Error("Could not find a valid JSON object in the AI analysis response.");
    }

    const jsonString = rawText.substring(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`[geminiService] Error analyzing code for requirement: ${requirementText}`, error);
    // Return a structured error so the process can continue
    return {
      isCompliant: true, // Assume compliant to avoid false positives on error
      error: "Failed to analyze this requirement due to an API error."
    };
  }
};


// --- Chatbot Conversation Handler ---
export const getChatResponse = async (userMessage: string, history: any[]) => {
  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 200,
    },
  });

  try {
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('[geminiService] Chatbot error:', error);
    return "I'm sorry, I encountered an error and can't respond right now.";
  }
};