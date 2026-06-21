const axios = require('axios');
const { validateTikTokUrl } = require('../lib/utils');
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

    const videoUrl = await fetchWatermark(url);
    await logRequest(apikey || 'unknown', url, 'wm');

    res.json({
      status: true,
      creator: 'Tio',
      result: {
        video: videoUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Failed to fetch video with watermark'
    });
  }
};

async function fetchWatermark(url) {
  try {
    const response = await axios.get('https://www.tikwm.com/api/', {
      params: {
        url: url,
        web: 1,
        hd: 1
      },
      timeout: 10000
    });

    if (response.data.code !== 0) {
      throw new Error('Failed to fetch video');
    }

    const video = response.data.data.wmplay || response.data.data.play;
    if (!video) {
      throw new Error('No video found');
    }

    return video;
  } catch (error) {
    // Fallback
    try {
      const response2 = await axios.get('https://api.tikmate.cc/api/v1/tiktok', {
        params: {
          url: url
        },
        timeout: 10000
      });

      if (response2.data && response2.data.video_watermark) {
        return response2.data.video_watermark;
      }
      throw new Error('No video found');
    } catch (error2) {
      throw new Error('Failed to fetch video: ' + error2.message);
    }
  }
}
