const fs = require('fs');
const path = require('path');

const logRequest = async (apikey, url, endpoint) => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      apikey: apikey,
      url: url,
      endpoint: endpoint
    };

    // Log to console
    console.log(`[${logEntry.timestamp}] ${endpoint} - ${apikey} - ${url}`);

    // Log to file (optional - Vercel doesn't support file writes in serverless)
    // In Vercel, we use console.log instead
  } catch (error) {
    console.error('Logging error:', error.message);
  }
};

module.exports = {
  logRequest
};
