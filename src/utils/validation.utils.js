/**
 * Validation utility functions for form inputs
 */

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validate password strength
 * Requirements: min 6 characters, at least one number, one letter
 * @param {string} password - Password to validate
 * @returns {object} - {isValid: boolean, error: string, strength: string}
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Password is required',
      strength: 'none'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long',
      strength: 'weak'
    };
  }

  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  if (!hasNumber || !hasLetter) {
    return {
      isValid: false,
      error: 'Password must contain at least one letter and one number',
      strength: 'weak'
    };
  }

  // Check password strength
  let strength = 'medium';
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length >= 10 && hasUpperCase && hasSpecialChar) {
    strength = 'strong';
  } else if (password.length >= 8 && (hasUpperCase || hasSpecialChar)) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  return {
    isValid: true,
    error: null,
    strength
  };
};

/**
 * Validate password confirmation matches original
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return {
      isValid: false,
      error: 'Please confirm your password'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validate display name
 * @param {string} displayName - Name to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateDisplayName = (displayName) => {
  if (!displayName || displayName.trim() === '') {
    return {
      isValid: false,
      error: 'Display name is required'
    };
  }

  if (displayName.trim().length < 2) {
    return {
      isValid: false,
      error: 'Display name must be at least 2 characters'
    };
  }

  if (displayName.length > 50) {
    return {
      isValid: false,
      error: 'Display name must be less than 50 characters'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Get password strength color
 * @param {string} strength - Password strength level
 * @returns {string} - Color code
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'weak':
      return '#ff4444';
    case 'medium':
      return '#ffa500';
    case 'strong':
      return '#00C851';
    default:
      return '#999';
  }
};

/**
 * Validate entire sign-up form
 * @param {object} formData - Form data object
 * @returns {object} - {isValid: boolean, errors: object}
 */
export const validateSignUpForm = (formData) => {
  const { displayName, email, password, confirmPassword } = formData;
  const errors = {};
  let isValid = true;

  // Validate display name
  const nameValidation = validateDisplayName(displayName);
  if (!nameValidation.isValid) {
    errors.displayName = nameValidation.error;
    isValid = false;
  }

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  // Validate password match
  const matchValidation = validatePasswordMatch(password, confirmPassword);
  if (!matchValidation.isValid) {
    errors.confirmPassword = matchValidation.error;
    isValid = false;
  }

  return {
    isValid,
    errors
  };
};

/**
 * Validate sign-in form
 * @param {object} formData - Form data object
 * @returns {object} - {isValid: boolean, errors: object}
 */
export const validateSignInForm = (formData) => {
  const { email, password } = formData;
  const errors = {};
  let isValid = true;

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  // Validate password exists
  if (!password || password.trim() === '') {
    errors.password = 'Password is required';
    isValid = false;
  }

  return {
    isValid,
    errors
  };
};
