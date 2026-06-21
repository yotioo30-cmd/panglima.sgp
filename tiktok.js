const axios = require('axios');
const { validateTikTokUrl, formatResponse } = require('../lib/utils');
const { logRequest } = require('../lib/logger');

module.exports = async (req, res) => {
  try {
    const { url, apikey } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'URL parameter is required'
      });
    }

    if (!validateTikTokUrl(url)) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'Invalid TikTok URL'
      });
    }

    // Fetch data from TikTok API
    const data = await fetchTikTokData(url);

    // Log request
    await logRequest(apikey || 'unknown', url, 'tiktok');

    res.json({
      status: true,
      creator: 'Tio',
      result: formatResponse(data)
    });
  } catch (error) {
    console.error('TikTok API Error:', error.message);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Failed to fetch video data'
    });
  }
};

async function fetchTikTokData(url) {
  try {
    // Using TikWM API (free and reliable)
    const response = await axios.get('https://www.tikwm.com/api/', {
      params: {
        url: url,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.code !== 0) {
      throw new Error('Failed to fetch video data');
    }

    const data = response.data.data;
    return data;

  } catch (error) {
    console.error('Primary API failed:', error.message);
    
    // Fallback to TikMate API
    try {
      const response2 = await axios.get('https://api.tikmate.cc/api/v1/tiktok', {
        params: {
          url: url
        },
        timeout: 10000
      });

      if (!response2.data) {
        throw new Error('No data received from fallback API');
      }

      return response2.data;
    } catch (error2) {
      // Second fallback - Try using social-downloader
      try {
        const response3 = await axios.get('https://social-downloader.vercel.app/api/tiktok', {
          params: {
            url: url
          },
          timeout: 10000
        });

        if (!response3.data || !response3.data.success) {
          throw new Error('Failed to fetch from social-downloader');
        }

        return response3.data.data;
      } catch (error3) {
        throw new Error('All API services failed. Please try again later.');
      }
    }
  }
}
