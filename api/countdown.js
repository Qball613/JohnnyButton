// Simple serverless function with file-based persistence
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = '/tmp/countdown-state.json';

async function readState() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { endTime: null, isActive: false };
  }
}

async function writeState(state) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(state), 'utf8');
  } catch (error) {
    console.error('Error writing state:', error);
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const state = await readState();
    const now = Date.now();
    
    if (state.endTime && state.endTime > now) {
      return res.status(200).json({
        endTime: state.endTime,
        isActive: true,
        timeRemaining: state.endTime - now
      });
    } else {
      return res.status(200).json({
        endTime: null,
        isActive: false,
        timeRemaining: 0
      });
    }
  }

  if (req.method === 'POST') {
    const { action, endTime } = req.body;
    
    if (action === 'start' && endTime) {
      const state = {
        endTime: endTime,
        isActive: true,
        lastUpdated: Date.now()
      };
      
      await writeState(state);
      
      return res.status(200).json({
        success: true,
        endTime: state.endTime
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
