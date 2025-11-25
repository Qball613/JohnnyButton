# 24 Hour Countdown

A simple, elegant 24-hour countdown timer triggered by a button press. Built for deployment on Vercel.

## Features

- ⏱️ 24-hour countdown timer
- 🎯 One-button start
- 💾 Persists across page refreshes (uses localStorage)
- 🎨 Responsive design
- 🔄 Reset functionality
- ✨ Modern gradient UI

## Deployment on Vercel

1. Push this repository to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Vercel will automatically detect this as a static site and deploy it.

## Local Development

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then visit `http://localhost:8000`

## How It Works

- Click "Start Countdown" to begin a 24-hour countdown
- The timer persists even if you close the browser (saved in localStorage)
- Click "Reset" to stop and clear the countdown
- When time expires, you'll see a completion message

## Technologies

- Pure HTML, CSS, and JavaScript
- No frameworks or dependencies
- LocalStorage for persistence
- Responsive CSS with modern gradients
