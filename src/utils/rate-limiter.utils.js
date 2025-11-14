/**
 * Client-side rate limiter to prevent abuse of authentication and other actions
 * This is a simple implementation for frontend protection.
 * Backend rate limiting should be implemented for production security.
 */

class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }

  /**
   * Check if action is allowed based on rate limit
   * @param {string} key - Unique key for the action (e.g., 'signin', 'signup')
   * @param {number} maxAttempts - Maximum attempts allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {object} - {allowed: boolean, remainingAttempts: number, retryAfter: number}
   */
  checkLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const attemptData = this.attempts.get(key);

    // No previous attempts or window expired
    if (!attemptData || now - attemptData.firstAttempt > windowMs) {
      this.attempts.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });

      return {
        allowed: true,
        remainingAttempts: maxAttempts - 1,
        retryAfter: 0
      };
    }

    // Within rate limit window
    if (attemptData.count < maxAttempts) {
      attemptData.count++;
      attemptData.lastAttempt = now;
      this.attempts.set(key, attemptData);

      return {
        allowed: true,
        remainingAttempts: maxAttempts - attemptData.count,
        retryAfter: 0
      };
    }

    // Rate limit exceeded
    const retryAfter = Math.ceil((attemptData.firstAttempt + windowMs - now) / 1000);

    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter
    };
  }

  /**
   * Reset rate limit for a specific key
   * @param {string} key - Key to reset
   */
  reset(key) {
    this.attempts.delete(key);
  }

  /**
   * Clear all rate limit data
   */
  clearAll() {
    this.attempts.clear();
  }

  /**
   * Clean up expired entries
   * @param {number} windowMs - Time window in milliseconds
   */
  cleanup(windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, data] of this.attempts.entries()) {
      if (now - data.firstAttempt > windowMs) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.attempts.delete(key));
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Run cleanup every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

/**
 * Rate limit configuration for different actions
 */
export const RATE_LIMITS = {
  SIGN_IN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many sign-in attempts. Please try again in {retryAfter} seconds.'
  },
  SIGN_UP: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many sign-up attempts. Please try again in {retryAfter} minutes.'
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many password reset attempts. Please try again in {retryAfter} minutes.'
  },
  ADD_TO_CART: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.'
  }
};

/**
 * Check if action is rate limited
 * @param {string} action - Action type (e.g., 'SIGN_IN', 'SIGN_UP')
 * @param {string} identifier - Unique identifier (e.g., email, user ID, IP)
 * @returns {object} - Rate limit result
 */
export const checkRateLimit = (action, identifier = 'default') => {
  const config = RATE_LIMITS[action];

  if (!config) {
    console.warn(`Rate limit config not found for action: ${action}`);
    return { allowed: true, remainingAttempts: Infinity, retryAfter: 0 };
  }

  const key = `${action}:${identifier}`;
  return rateLimiter.checkLimit(key, config.maxAttempts, config.windowMs);
};

/**
 * Reset rate limit for specific action and identifier
 * @param {string} action - Action type
 * @param {string} identifier - Unique identifier
 */
export const resetRateLimit = (action, identifier = 'default') => {
  const key = `${action}:${identifier}`;
  rateLimiter.reset(key);
};

/**
 * Get formatted error message for rate limit
 * @param {string} action - Action type
 * @param {number} retryAfter - Seconds until retry
 * @returns {string} - Error message
 */
export const getRateLimitMessage = (action, retryAfter) => {
  const config = RATE_LIMITS[action];

  if (!config) {
    return 'Too many requests. Please try again later.';
  }

  let message = config.message;

  // Convert to minutes if over 60 seconds
  if (retryAfter > 60) {
    const minutes = Math.ceil(retryAfter / 60);
    message = message.replace('{retryAfter} seconds', `${minutes} minutes`);
    message = message.replace('{retryAfter}', minutes);
  } else {
    message = message.replace('{retryAfter}', retryAfter);
  }

  return message;
};

export default rateLimiter;
