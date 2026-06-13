# Howie Reith site rebuild

## Main structure
- `/` actor-first homepage
- `/reel/` dedicated share page for the singing reel
- `/media/` selector-based media page
- `/resume/` theatrical resume
- `/contact/` direct contact details plus Netlify form
- `/software/` engineering page
- `/music/` redirect to `/`
- `/guyde/` left intact and excluded in `robots.txt`

## What changed in this draft
- Added an explicit `Home` link to the top navigation
- Replaced the repeated reel headshot with a dedicated reel poster image: `assets/images/video/reel-poster.png`
- Added a `Share` button under the homepage reel that links to `/reel/`
- Cleaned up the reel page button area so the controls sit below the video instead of in a padded white block
- Expanded the media headshots tab to include one variation of each headshot setup
- Kept the selector-based media structure: `Headshots / Performance Photos / Plays / Singing`
- Renamed the singing clip label to `Musical Theatre Singing Reel`
- Removed the redundant small page-kicker text from subpages
- Added a live `Upcoming Performances` entry for `Selections from Jekyll & Hyde`
- Added a custom event graphic at `assets/images/upcoming/jekyll-hyde-2026.jpg`
- Replaced the hidden contact-form scaffold with a real Netlify-ready contact form
- Added a thank-you page for form submissions at `/contact/thanks/`

## Quick update guide

### 1) Change the reel or clip URLs
Edit `assets/js/site-config.js`

```js
window.HOWIE_SITE_CONFIG = {
  videoSources: {
    reel: 'https://d6nbb7ifyxnlf.cloudfront.net/Howie%20Reith%20Musical%20Theatre%20Singing%20Reel%20Jun%202026.mp4',
    closer: 'https://d6nbb7ifyxnlf.cloudfront.net/Closer%20-%20Stella%20Adler%20Conservatory%20Aug%202025%20Audio%20Fixed.mp4',
    // longDay: ''
  },
  contactForm: {
    endpoint: ''
  }
};
```

Each value can be either:
- a direct mp4 URL from S3 / CloudFront
- a YouTube share URL

Examples:

```js
reel: 'https://d6nbb7ifyxnlf.cloudfront.net/videos/reel-2026.mp4'
reel: 'https://youtu.be/VIDEO_ID'
```

The site auto-embeds YouTube if you paste a YouTube URL.

### 2) Share the reel
Use this link:

```text
https://howiereith.com/reel/
```

That page is the clean share target for casting, collaborators, and colleagues.

### 3) Update the reel poster image
Current reel poster:

```text
assets/images/video/reel-poster.png
```

If you want to replace it later, keep the aspect ratio wide (16:9 works best).

### 4) Update headshots
Headshots used on the site live here:

```text
assets/images/headshots/
```

Current media-page set:
- `headshot-1.jpg`
- `headshot-2.jpg`
- `headshot-3.jpg`
- `headshot-4.jpg`
- `headshot-5.jpg`
- `headshot-6.jpg`

Homepage hero:
- `hero.jpg`

### 5) Update upcoming performances
Edit `index.html` and search for `Upcoming Performances`.

There is:
- one live event card already in place
- one commented-out template you can duplicate for future shows

For each event, update:
- image path
- date
- title
- role / venue / city
- info or ticket link

If you ever need to go back to an empty state, replace the event list with:

```html
<p class="empty-state">More performances coming soon.</p>
```

## Contact form

### Current setup
The contact page is already wired for **Netlify Forms**.

That means:
- no separate backend is needed
- once the updated site is deployed on Netlify, submissions should appear in the site’s **Forms** area
- the form redirects to `/contact/thanks/` after submit

### If your site stays on Netlify
You do **not** need to paste any endpoint into `site-config.js`.
Leave this blank:

```js
contactForm: {
  endpoint: ''
}
```

### If you ever move off Netlify
You can override the form action by pasting a real endpoint into:

```js
contactForm.endpoint
```

That is there for a future Formspree / custom backend / serverless function path.

### Netlify form checklist
After you deploy this version:
1. Open your Netlify site dashboard.
2. Go to **Forms**.
3. Confirm that a form named `contact` appears.
4. Add form email notifications in Netlify if you want submissions forwarded to email.

If the form does **not** appear, check that Netlify form detection is still enabled for the site.

Netlify will pick up the contact form on a new production deploy **if**:
- the branch you push is the site’s production branch
- builds are active for the site
- form detection is enabled
- the form remains in the deployed static HTML

## Deploy flow for your setup
Your screenshots show this site is deployed through **Netlify** and connected to **GitHub**.

So the update flow is:
1. Replace the files in your local repo with the updated site files.
2. Commit the changes.
3. Push to the branch Netlify publishes from.
4. Wait for the Netlify production deploy to finish.
5. Test:
   - homepage reel
   - `/reel/`
   - `/media/`
   - `/contact/`
   - a real test form submission

## Video hosting workflow
See `S3_VIDEO_SETUP.md`.

Short version:
1. Upload the mp4 into `howiereithmusic`
2. Use the `d6nbb7ifyxnlf.cloudfront.net` CloudFront domain
3. Paste the URL into `assets/js/site-config.js`
4. Commit + push so Netlify republishes the site

## Media image performance
The gallery images already use native `loading="lazy"`, so visitors do **not** pull every image on the first page view. For this site size, keeping photos in the Netlify deploy is the simpler choice. Move them to S3 / CloudFront later only if you want a single external media library or much larger galleries.

## Favicons
Favicons live in:
- `assets/icons/favicon.svg`
- `assets/icons/favicon-32.png`
- `assets/icons/favicon.ico`
- `assets/icons/apple-touch-icon.png`

Current approach: simple serif `H` mark matching the site palette.
