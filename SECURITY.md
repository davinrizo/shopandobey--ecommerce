# Security Guide

## Overview
This document outlines security measures implemented in the application and recommendations for production deployment.

---

## Frontend Security (Implemented)

### 1. Environment Variables ✅
**Status:** Implemented

All sensitive credentials are stored in environment variables:
- Firebase API keys
- Stripe publishable key
- API URLs

**Files:**
- `.env` - Contains actual credentials (gitignored)
- `.env.example` - Template for setup

**Security Benefit:** Prevents credential exposure in source code and version control.

---

### 2. Input Validation & Sanitization ✅
**Status:** Implemented

**Validation Rules:**
- Email: RFC-compliant regex validation
- Password: Minimum 6 characters, requires letter + number
- Display Name: 2-50 characters
- Password Match: Confirms passwords match

**Sanitization:**
- XSS Prevention: Escapes HTML special characters (`<`, `>`, `"`, `'`, `/`)
- Applied to all user inputs before Firebase operations

**Files:**
- `src/utils/validation.utils.js` - Validation functions
- `src/components/sign-in/` - Sign-in validation
- `src/components/sign-up/` - Sign-up validation

**Security Benefit:** Prevents XSS attacks and ensures data integrity.

---

### 3. Client-Side Rate Limiting ✅
**Status:** Implemented

**Rate Limits:**
- **Sign In:** 5 attempts per 15 minutes
- **Sign Up:** 3 attempts per 1 hour
- **Password Reset:** 3 attempts per 1 hour
- **Add to Cart:** 100 requests per minute

**Implementation:**
- In-memory Map-based tracking
- Automatic cleanup of expired entries
- User-friendly error messages with retry time

**Files:**
- `src/utils/rate-limiter.utils.js` - Rate limiter class
- Applied in sign-in and sign-up components

**Security Benefit:** Prevents brute force attacks and API abuse.

**Note:** This is client-side protection only. Backend rate limiting is required for production.

---

## Backend Security (TODO - Critical for Production)

### 1. Rate Limiting (Server-Side)
**Priority:** HIGH
**Status:** Not Implemented

**Recommended Implementation:**
```javascript
// Express example with express-rate-limit
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

app.post('/api/auth/signin', authLimiter, signInHandler);
```

**Recommended Libraries:**
- `express-rate-limit` - IP-based rate limiting
- `rate-limit-redis` - Distributed rate limiting with Redis

**Rate Limit Recommendations:**
- Auth endpoints: 5 requests per 15 minutes per IP
- API endpoints: 100 requests per minute per user
- Payment endpoint: 10 requests per hour per user

---

### 2. Security Headers
**Priority:** HIGH
**Status:** Not Implemented

**Required Headers:**

```javascript
// Helmet.js - Security headers middleware
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "js.stripe.com"],
      frameSrc: ["js.stripe.com"],
      connectSrc: ["'self'", "*.firebase.com", "*.firebaseio.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**Headers to Implement:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy` - Restrict resource loading
- `Referrer-Policy: no-referrer-when-downgrade`

---

### 3. HTTPS/TLS
**Priority:** CRITICAL
**Status:** Not Implemented

**Requirements:**
- All production traffic must use HTTPS
- Minimum TLS 1.2
- Valid SSL certificate (Let's Encrypt recommended)
- Redirect HTTP to HTTPS

**Implementation:**
```javascript
// Force HTTPS in Express
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

### 4. Authentication & Session Management
**Priority:** HIGH
**Status:** Partial (Firebase handles this)

**Current:** Firebase Authentication
**Recommendations:**
- Verify Firebase ID tokens on every request
- Set appropriate token expiration
- Implement refresh token rotation
- Use httpOnly cookies for session storage

**Backend Verification:**
```javascript
const admin = require('firebase-admin');

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

### 5. CORS Configuration
**Priority:** HIGH
**Status:** Not Implemented

**Recommended Configuration:**
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

**Environment Variables:**
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

### 6. SQL Injection Prevention
**Priority:** N/A (Using Firestore)
**Status:** Not Applicable

Firebase Firestore handles this automatically.

---

### 7. CSRF Protection
**Priority:** MEDIUM
**Status:** Not Implemented

**Recommended Implementation:**
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Send token to client
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

---

### 8. Payment Security (Stripe)
**Priority:** CRITICAL
**Status:** Partial

**Current Implementation:**
- Using Stripe Checkout (client-side)
- Publishable key in environment variables

**Required for Production:**
- Server-side payment processing
- Never expose secret key
- Validate payment amounts on server
- Implement webhook signature verification

**Server Implementation:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/payment', async (req, res) => {
  try {
    const { amount, token } = req.body;

    // Validate amount on server (CRITICAL)
    if (!amount || amount < 50) { // $0.50 minimum
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source: token.id,
      description: 'Shop and Obey Purchase'
    });

    res.json({ success: true, charge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### 9. Data Validation (Server-Side)
**Priority:** HIGH
**Status:** Not Implemented

**Never trust client-side validation.** Always validate on server:

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/orders',
  [
    body('items').isArray({ min: 1 }),
    body('total').isFloat({ min: 0 }),
    body('email').isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Process order
  }
);
```

---

### 10. Logging & Monitoring
**Priority:** MEDIUM
**Status:** Not Implemented

**Recommended Tools:**
- Winston - Logging library
- Sentry - Error tracking
- Morgan - HTTP request logging

**What to Log:**
- Authentication attempts (success/failure)
- Payment transactions
- API errors
- Rate limit violations
- Security events

**What NOT to Log:**
- Passwords
- Credit card numbers
- API secret keys
- Personal identifiable information (unless required)

---

### 11. Dependency Security
**Priority:** HIGH
**Status:** Ongoing

**Current Vulnerabilities:** 5 (4 moderate, 1 low) - per GitHub

**Actions:**
- Run `npm audit` regularly
- Update dependencies monthly
- Use `npm audit fix` for automatic fixes
- Review breaking changes before major updates

**Automation:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically (safe updates)
npm audit fix

# Fix with breaking changes (review first)
npm audit fix --force
```

---

### 12. Environment-Specific Security

#### Development
- Use test API keys only
- Separate Firebase project
- Never commit `.env` file
- Use `.env.example` for templates

#### Production
- Use production API keys
- Enable Firebase App Check
- Implement DDoS protection (Cloudflare)
- Set up monitoring and alerts
- Regular security audits
- Backup strategies

---

## Security Checklist

### Pre-Production
- [ ] All environment variables configured
- [ ] HTTPS enforced
- [ ] Security headers implemented
- [ ] Server-side rate limiting active
- [ ] CORS properly configured
- [ ] Firebase security rules configured
- [ ] Stripe webhook signature verification
- [ ] Server-side input validation
- [ ] Error logging configured
- [ ] DDoS protection (CDN/Cloudflare)

### Post-Production
- [ ] Regular dependency updates
- [ ] Security monitoring active
- [ ] Backup systems in place
- [ ] Incident response plan
- [ ] Regular security audits
- [ ] Penetration testing

---

## Reporting Security Issues

If you discover a security vulnerability, please email:
**security@shopandobey.com** (configure this)

Do NOT create public GitHub issues for security vulnerabilities.

---

## Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Stripe Security](https://stripe.com/docs/security/stripe)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Snyk](https://snyk.io/) - Dependency scanning
- [SSL Labs](https://www.ssllabs.com/ssltest/) - SSL configuration testing

---

**Last Updated:** 2025-11-14
**Next Review:** 2025-12-14
