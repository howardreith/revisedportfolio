# Uploading video to S3 / CloudFront for this site

This site can use either:
- direct mp4 URLs from S3 / CloudFront
- YouTube share URLs

For the cleanest on-site player, use CloudFront mp4 URLs.
For the easiest off-site backup sharing, YouTube Unlisted also works.

## Your current AWS setup
From your screenshots:

### Video bucket
- S3 bucket: `howiereithmusic`

### Video CloudFront distribution
- Distribution ID: `E11HWNMZG6EMLC`
- Domain: `https://d6nbb7ifyxnlf.cloudfront.net`

That is the distribution to use for reel and clip video files.

### Other media bucket
- S3 bucket: `howiereithpublic`
- CloudFront distribution ID: `E1FLU9UNDFURA6`

That bucket/distribution pair is **not** the one currently used for reel video.

## Recommended file names
Best practice: use lowercase, hyphenated names.

Examples:
- `videos/reel-2026.mp4`
- `videos/closer-2025.mp4`
- `videos/long-days-journey-2026.mp4`

You can use filenames with spaces if you want, but then you need to paste the exact encoded URL into `site-config.js`.
Hyphenated names are cleaner.

## Step-by-step: upload a new reel
1. Open **Amazon S3**.
2. Open the bucket **`howiereithmusic`**.
3. Optional but recommended: create a folder named `videos`.
4. Click **Upload**.
5. Add the mp4 file.
6. Finish the upload.

## Build the CloudFront URL
If you upload `reel-2026.mp4` into the bucket root:

```text
https://d6nbb7ifyxnlf.cloudfront.net/reel-2026.mp4
```

If you upload it into a `videos` folder:

```text
https://d6nbb7ifyxnlf.cloudfront.net/videos/reel-2026.mp4
```

If you keep a filename with spaces, copy the exact CloudFront URL after encoding spaces as `%20`.
Example:

```text
https://d6nbb7ifyxnlf.cloudfront.net/Howie%20Reith%20Musical%20Theatre%20Singing%20Reel%20Jun%202026.mp4
```

## Test the hosted file
Paste the CloudFront URL into a browser tab.

If it plays there, the hosting side is good.
If it returns a `403` or `404`, fix the path / permissions before touching site code.

## Put the video into the site
Open `assets/js/site-config.js` and update the relevant value.

Example:

```js
window.HOWIE_SITE_CONFIG = {
  videoSources: {
    reel: 'https://d6nbb7ifyxnlf.cloudfront.net/videos/reel-2026.mp4',
    closer: 'https://d6nbb7ifyxnlf.cloudfront.net/videos/closer-2025.mp4',
    // longDay: 'https://d6nbb7ifyxnlf.cloudfront.net/videos/long-days-journey-2026.mp4'
  },
  contactForm: {
    endpoint: ''
  }
};
```

## Publish the change
Your site is deployed through GitHub -> Netlify.

So after updating `site-config.js`:
1. Save the file.
2. Commit the change.
3. Push to the branch Netlify publishes from.
4. Wait for Netlify to finish the production deploy.
5. Test the homepage reel and `/reel/`.

## If you replace an existing file
Best practice: do **not** overwrite the old filename.

Instead:
- upload a new filename like `reel-2026-v2.mp4`
- update `site-config.js`
- push the site update

That avoids CloudFront cache confusion.

If you do overwrite the same object key, invalidate the exact path on the `E11HWNMZG6EMLC` distribution.

Examples:
- `/videos/reel-2026.mp4`
- `/videos/closer-2025.mp4`

## Reel sharing
Use this page as the public share link:

```text
https://howiereith.com/reel/
```

That is cleaner than sending the raw mp4 URL.

## If you want to use YouTube instead
The site also supports YouTube share URLs.

Examples:

```js
reel: 'https://youtu.be/VIDEO_ID'
reel: 'https://www.youtube.com/watch?v=VIDEO_ID'
```

The site will auto-embed the video.

## Recommended setup
Best overall setup:
- keep the site player on CloudFront for a cleaner presentation
- use `https://howiereith.com/reel/` as the share link
- optionally keep an unlisted YouTube version as a backup share option

## Troubleshooting
### The video URL works locally in `site-config.js` but not on the production site
You probably updated your local files but did not push the change to GitHub / Netlify.

### CloudFront URL returns `403`
The distribution may not have access to the object you uploaded, or the path is wrong.

### CloudFront URL returns `404`
The object key in the URL does not match the uploaded filename.

### The old video still appears after replacement
You are seeing cached CloudFront content.
Use a new filename or invalidate the exact old path.
