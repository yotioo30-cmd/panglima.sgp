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

    const data = await fetchTikTokInfo(url);
    await logRequest(apikey || 'unknown', url, 'info');

    res.json({
      status: true,
      creator: 'Tio',
      result: data
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Failed to fetch video info'
    });
  }
};

async function fetchTikTokInfo(url) {
  try {
    const response = await axios.get('https://www.tikwm.com/api/', {
      params: {
        url: url,
        web: 1
      },
      timeout: 10000
    });

    if (response.data.code !== 0) {
      throw new Error('Failed to fetch video info');
    }

    const data = response.data.data;
    
    return {
      title: data.title || 'No title',
      description: data.title || '',
      author: data.author?.unique_id || 'Unknown',
      author_id: data.author?.id || '0',
      duration: data.duration || 0,
      cover: data.cover || '',
      thumbnail: data.cover || '',
      statistics: {
        likes: data.digg_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
        views: data.play_count || 0
      },
      create_time: data.create_time || new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to fetch video info: ' + error.message);
  }
}
