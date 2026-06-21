const validateTikTokUrl = (url) => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
    /(?:https?:\/\/)?(?:www\.)?vt\.tiktok\.com\/[\w]+/,
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/photo\/\d+/,
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/music\/\w+/,
    /(?:https?:\/\/)?(?:www\.)?vm\.tiktok\.com\/[\w]+/
  ];
  return patterns.some(pattern => pattern.test(url));
};

const formatResponse = (data) => {
  // Format for TikWM API response
  if (data.author && data.author.unique_id) {
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
      video: {
        nowm: data.play || '',
        wm: data.wmplay || '',
        hd: data.hdplay || data.play || ''
      },
      music: {
        url: data.music || ''
      },
      images: data.images || []
    };
  }
  
  // Format for TikMate API response
  if (data.video_no_watermark) {
    return {
      title: data.title || 'No title',
      description: data.desc || '',
      author: data.author || 'Unknown',
      author_id: data.author_id || '0',
      duration: data.duration || 0,
      cover: data.cover || '',
      thumbnail: data.cover || '',
      statistics: {
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0,
        views: data.views || 0
      },
      video: {
        nowm: data.video_no_watermark || '',
        wm: data.video_watermark || '',
        hd: data.hd_download || data.video_no_watermark || ''
      },
      music: {
        url: data.music || ''
      },
      images: data.slideshow || []
    };
  }

  // Fallback format
  return {
    title: data.title || 'No title',
    description: data.description || '',
    author: data.author || 'Unknown',
    author_id: data.author_id || '0',
    duration: data.duration || 0,
    cover: data.cover || '',
    thumbnail: data.thumbnail || data.cover || '',
    statistics: {
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      views: data.views || 0
    },
    video: {
      nowm: data.video_no_watermark || data.video || '',
      wm: data.video_watermark || data.video || '',
      hd: data.hd_download || data.video || ''
    },
    music: {
      url: data.music || ''
    },
    images: data.images || data.slideshow || []
  };
};

module.exports = {
  validateTikTokUrl,
  formatResponse
};
