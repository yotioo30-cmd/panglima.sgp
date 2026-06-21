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

    const audioUrl = await fetchAudio(url);
    await logRequest(apikey || 'unknown', url, 'mp3');

    res.json({
      status: true,
      creator: 'Tio',
      result: {
        audio: audioUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Failed to fetch audio'
    });
  }
};

async function fetchAudio(url) {
  try {
    const response = await axios.get('https://www.tikwm.com/api/', {
      params: {
        url: url,
        web: 1
      },
      timeout: 10000
    });

    if (response.data.code !== 0) {
      throw new Error('Failed to fetch audio');
    }

    const music = response.data.data.music;
    if (!music) {
      throw new Error('No audio found for this video');
    }

    return music;
  } catch (error) {
    // Fallback
    try {
      const response2 = await axios.get('https://api.tikmate.cc/api/v1/tiktok', {
        params: {
          url: url
        },
        timeout: 10000
      });

      if (response2.data && response2.data.music) {
        return response2.data.music;
      }
      throw new Error('No audio found');
    } catch (error2) {
      throw new Error('Failed to fetch audio: ' + error2.message);
    }
  }
}
