# Netlify contact form setup

This site’s contact form is already written in the HTML for Netlify Forms.

## What is already done in code
The form in `contact/index.html` already includes:
- `name="contact"`
- `method="POST"`
- `data-netlify="true"`
- `netlify-honeypot="bot-field"`
- hidden `form-name` input
- success redirect to `/contact/thanks/`

So there is no extra backend code to write.

## What you need to do
1. Put this updated site into the GitHub repo Netlify deploys from.
2. Commit and push.
3. Wait for the Netlify production deploy to finish.
4. Open your Netlify site dashboard.
5. Go to **Forms**.
6. Confirm a form named `contact` is listed.

## Set up email notifications
In Netlify:
1. Open the site.
2. Go to **Forms**.
3. Open the `contact` form.
4. Add an email notification to the inbox you want.

## Test it
After deployment:
1. Open `https://howiereith.com/contact/`
2. Submit a test message.
3. Confirm you land on `/contact/thanks/`
4. Confirm the submission appears in Netlify Forms
5. Confirm you receive the notification email if you enabled one

## If the form does not appear in Netlify
Check these first:
- the latest deploy really includes `contact/index.html`
- form detection is enabled in Netlify
- the form name is still `contact`
- the hidden input still says `form-name = contact`

## If you move off Netlify later
You can replace the submit target by editing:

```js
window.HOWIE_SITE_CONFIG.contactForm.endpoint
```

If you leave that blank, the site uses the built-in Netlify form path.

## Will pushing to main pick this up automatically?
Yes — **if `main` is the production branch for the Netlify site** and builds are active, pushing this code to `main` will trigger a new production deploy. Netlify then scans the deployed static HTML for forms. If form detection is enabled, the `contact` form should appear in the Netlify **Forms** area on that deploy.

If it still does not show up, the usual culprits are:
- form detection is disabled
- the latest deploy did not include the updated `contact/index.html`
- the form was changed to render only client-side with JavaScript
