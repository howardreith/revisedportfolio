window.HOWIE_SITE_CONFIG = {
  // Each value can be either:
  // 1) a direct mp4 URL from S3 / CloudFront, or
  // 2) a YouTube watch/share URL (the site will auto-embed it)
  // Examples:
  // reel: 'https://d6nbb7ifyxnlf.cloudfront.net/videos/reel-2026.mp4'
  // reel: 'https://youtu.be/VIDEO_ID'
  videoSources: {
    reel: 'https://d6nbb7ifyxnlf.cloudfront.net/Howie%20Reith%20Musical%20Theatre%20Singing%20Reel%20Jun%202026.mp4',
    closer: 'https://d6nbb7ifyxnlf.cloudfront.net/Closer%20-%20Stella%20Adler%20Conservatory%20Aug%202025%20Audio%20Fixed.mp4',
    // longDay: ''
  },
  contactForm: {
    // Optional override. Leave blank to use the built-in Netlify form.
    endpoint: ''
  }
};
