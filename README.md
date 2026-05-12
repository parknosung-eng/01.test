# BLAZE — Interactive Landing

Interactive single-page landing inspired by the BLAZE travel reference.
Fullscreen hero with mouse parallax, animated headline, tilt-on-hover tour
cards, masonry gallery, marquee, and a custom blend-mode cursor.

## Files
- `index.html` — markup
- `styles.css` — layout, animations, responsive rules
- `script.js` — cursor, parallax, tilt, scroll reveals

## Run
Open `index.html` in a browser, or serve with any static server:

```
python3 -m http.server 8000
```

## Google Sign-In

The header includes a "Sign in with Google" button powered by
[Google Identity Services](https://developers.google.com/identity/gsi/web).

To enable real sign-in:

1. Create an OAuth 2.0 Client ID (type: **Web application**) in the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add your origin (e.g. `http://localhost:8000`) under
   **Authorized JavaScript origins**.
3. Replace the placeholder in `index.html`:

   ```html
   <meta name="google-signin-client_id"
         content="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com" />
   ```

   with the Client ID you generated.

The signed-in user (name + avatar) is shown in the nav and cached in
`sessionStorage` under `blaze.user`. Click **Sign out** to clear it.
