// Serverless function to handle countdown state
// Using Vercel KV or simple in-memory storage would be better for production
// This uses a simple file-based approach via Vercel's temporary storage

let countdownState = {
  endTime: null,
  isActive: false,
  lastUpdated: null
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return current countdown state
    const now = Date.now();
    
    if (countdownState.endTime && countdownState.endTime > now) {
      return res.status(200).json({
        endTime: countdownState.endTime,
        isActive: true,
        timeRemaining: countdownState.endTime - now
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
    // Start a new countdown
    const { action } = req.body;
    
    if (action === 'start') {
      const endTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      countdownState = {
        endTime,
        isActive: true,
        lastUpdated: Date.now()
      };
      
      return res.status(200).json({
        success: true,
        endTime: countdownState.endTime
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
