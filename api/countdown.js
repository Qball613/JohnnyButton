// Serverless function with Vercel KV for persistent storage
// Install: npm install @vercel/kv

let state = { endTime: null, isActive: false };

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
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
    
    if (action === 'start') {
      if (!endTime || endTime <= Date.now()) {
        // Clear the countdown
        state = {
          endTime: null,
          isActive: false
        };
        return res.status(200).json({
          success: true,
          endTime: null
        });
      }
      
      state = {
        endTime: endTime,
        isActive: true
      };
      
      return res.status(200).json({
        success: true,
        endTime: state.endTime
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
