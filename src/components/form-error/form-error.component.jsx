import React from 'react';
import { FormErrorContainer } from './form-error.styles';

const FormError = ({ children }) => {
  if (!children) return null;

  return <FormErrorContainer>{children}</FormErrorContainer>;
};

export default FormError;
