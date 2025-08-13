import { Request, Response } from 'express';
import { getChatResponse } from '../services/geminiService';

export const handleChat = async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const botResponse = await getChatResponse(message, history || []);
    res.status(200).json({ reply: botResponse });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get a response from the AI assistant.' });
  }
};