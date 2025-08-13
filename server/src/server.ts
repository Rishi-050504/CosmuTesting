import dotenv from 'dotenv';
dotenv.config();

// --- Immediately validate and DEBUG the environment variables ---
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error("\nCRITICAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
  process.exit(1);
}

// --- NEW: Debugging line to check the loaded key ---
console.log(`DEBUG: Loaded API Key starts with: [${geminiApiKey.substring(0, 6)}...]`);
// --- End of new line ---

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('CosmuQuantaa Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});