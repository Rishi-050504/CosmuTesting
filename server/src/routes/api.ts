import { Router } from 'express';
import { uploadSrs, uploadProject } from '../middleware/uploadMiddleware';
import { 
  generateChecklist, 
  analyzeCode, 
  updateFile, 
  downloadProject 
} from '../controllers/analysisController';
import { handleChat } from '../controllers/chatbotController';

const router = Router();

// Route for Step 1: Upload SRS and generate the checklist
router.post('/generate-checklist', uploadSrs, generateChecklist);

// Route for Step 2: Upload project and analyze it against the checklist
router.post('/analyze-code', uploadProject, analyzeCode);

// Routes for subsequent actions in the workflow
router.post('/update', updateFile);
router.get('/download', downloadProject);

// Route for the AI chatbot
router.post('/chat', handleChat);

export default router;