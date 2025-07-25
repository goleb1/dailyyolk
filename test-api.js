export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Root test API working!',
    timestamp: new Date().toISOString()
  });
} 