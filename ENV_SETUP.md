# Environment Setup Guide

## Overview
This application uses environment variables to store sensitive configuration data like API keys and credentials. This approach keeps secrets out of source code and allows for different configurations in development, testing, and production environments.

## Quick Start

### 1. Create Environment File
Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

### 2. Configure Firebase
Replace the placeholder values in `.env` with your Firebase project credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCD123456
```

**Where to find these values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (Settings) → Project settings
4. Scroll down to "Your apps" section
5. Select your web app or create one
6. Copy the configuration values

### 3. Configure Stripe
Add your Stripe publishable key (test mode recommended for development):

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
```

**Where to find this value:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click "Developers" in the left sidebar
3. Click "API keys"
4. Copy the "Publishable key" (use test mode for development)

### 4. Optional: Backend API URL
If you're running a local backend server:

```env
REACT_APP_API_URL=http://localhost:5000
```

For production, update this to your deployed backend URL.

## Important Notes

### Security
- **NEVER commit the `.env` file to version control**
  - The `.env` file is already in `.gitignore`
  - Only commit `.env.example` with placeholder values

- **Use test keys in development**
  - Firebase: Create a separate Firebase project for development
  - Stripe: Use test mode keys (starting with `pk_test_`)

### Environment-Specific Files
Create React App supports multiple environment files:
- `.env` - Default environment variables
- `.env.local` - Local overrides (not committed)
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables

Priority order: `.env.development.local` > `.env.development` > `.env.local` > `.env`

### Variable Naming
All environment variables must start with `REACT_APP_` to be accessible in the React app.

Example:
```env
REACT_APP_MY_VAR=value  ✓ Accessible
MY_VAR=value            ✗ Not accessible
```

## Testing Your Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Verify Configuration
The app should:
- Load without errors
- Allow you to sign in with Google (Firebase auth)
- Display products from Firestore
- Show Stripe checkout button

### 4. Check for Missing Variables
If you see errors like "Cannot read property of undefined," check that:
1. The `.env` file exists in the project root
2. All required variables are defined
3. You restarted the development server after creating/modifying `.env`

## Production Deployment

### Vercel / Netlify
Add environment variables in the deployment dashboard:
1. Go to project settings
2. Find "Environment Variables" section
3. Add each `REACT_APP_*` variable with production values

### Heroku
```bash
heroku config:set REACT_APP_FIREBASE_API_KEY=your_key
heroku config:set REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
# ... add all other variables
```

### Docker
Create a `.env.production` file and mount it in your container, or pass variables via docker-compose:

```yaml
environment:
  - REACT_APP_FIREBASE_API_KEY=${FIREBASE_API_KEY}
  - REACT_APP_STRIPE_PUBLISHABLE_KEY=${STRIPE_KEY}
```

## Troubleshooting

### Variables showing as undefined
**Solution:** Restart the development server. Environment variables are only loaded on startup.

### Firebase initialization error
**Solution:** Verify all Firebase config values are correct. Check for typos in variable names.

### Stripe not loading
**Solution:** Ensure the Stripe key starts with `pk_test_` or `pk_live_` and is correctly set.

### Build fails
**Solution:** Make sure all environment variables are set in your build environment (CI/CD, hosting platform).

## Required Variables Checklist

Before running the app, ensure you have:

- [ ] `REACT_APP_FIREBASE_API_KEY`
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN`
- [ ] `REACT_APP_FIREBASE_DATABASE_URL`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `REACT_APP_FIREBASE_APP_ID`
- [ ] `REACT_APP_FIREBASE_MEASUREMENT_ID`
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY`

## Support

If you encounter issues with environment setup:
1. Check this guide
2. Review the `.env.example` file
3. Verify all variables in Firebase/Stripe dashboards
4. Ensure you've restarted the dev server

---

**Last Updated:** 2025-11-14
