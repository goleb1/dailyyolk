// Test API - Updated at 17:12
module.exports = function handler(req, res) {
  res.status(200).json({ 
    message: 'Hello from API!',
    timestamp: new Date().toISOString(),
    version: '1.0.1'
  });
}; 