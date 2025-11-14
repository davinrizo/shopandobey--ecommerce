import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import FormError from '../form-error/form-error.component';

import { signUpStart } from '../../redux/user/user.actions';
import { validateSignUpForm, sanitizeInput } from '../../utils/validation.utils';
import { checkRateLimit, getRateLimitMessage } from '../../utils/rate-limiter.utils';

import { SignUpContainer, SignUpTitle } from './sign-up.styles';

const SignUp = ({ signUpStart }) => {
  const [userCredentials, setUserCredentials] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const { displayName, email, password, confirmPassword } = userCredentials;

  const handleSubmit = async event => {
    event.preventDefault();

    // Check rate limit
    const rateLimit = checkRateLimit('SIGN_UP', email);
    if (!rateLimit.allowed) {
      setErrors({
        email: getRateLimitMessage('SIGN_UP', rateLimit.retryAfter)
      });
      return;
    }

    // Validate form
    const validation = validateSignUpForm(userCredentials);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and sanitize inputs
    setErrors({});
    const sanitizedDisplayName = sanitizeInput(displayName);
    const sanitizedEmail = sanitizeInput(email);

    signUpStart({
      displayName: sanitizedDisplayName,
      email: sanitizedEmail,
      password
    });
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setUserCredentials({ ...userCredentials, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <SignUpContainer>
      <SignUpTitle>I do not have a account</SignUpTitle>
      <span>Sign up with your email and password</span>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <FormInput
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          label='Display Name'
          required
        />
        <FormError>{errors.displayName}</FormError>

        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          label='Email'
          required
        />
        <FormError>{errors.email}</FormError>

        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          label='Password'
          required
        />
        <FormError>{errors.password}</FormError>

        <FormInput
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          label='Confirm Password'
          required
        />
        <FormError>{errors.confirmPassword}</FormError>

        <CustomButton type='submit'>SIGN UP</CustomButton>
      </form>
    </SignUpContainer>
  );
};

const mapDispatchToProps = dispatch => ({
  signUpStart: userCredentials => dispatch(signUpStart(userCredentials))
});

export default connect(
  null,
  mapDispatchToProps
)(SignUp);
