const API_KEY_SECRET = process.env.API_KEY_SECRET || 'TI0_API_2026';

const validateApiKey = (req, res, next) => {
  const apikey = req.query.apikey || req.headers['x-api-key'];

  if (!apikey) {
    return res.status(401).json({
      status: false,
      code: 401,
      message: 'API Key is required'
    });
  }

  // Check if API key matches
  if (apikey !== API_KEY_SECRET) {
    return res.status(401).json({
      status: false,
      code: 401,
      message: 'Invalid API Key'
    });
  }

  // Store API key in request for logging
  req.apikey = apikey;
  next();
};

module.exports = {
  validateApiKey
};
