import { VALIDATION_MESSAGES } from './constants';

export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

export const isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isMinLength = (value, minLength) => {
  if (typeof value !== 'string') return false;
  return value.length >= minLength;
};

export const isMaxLength = (value, maxLength) => {
  if (typeof value !== 'string') return false;
  return value.length <= maxLength;
};

export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const validateEmail = (email) => {
  const errors = [];
  
  if (!isRequired(email)) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  } else if (!isEmail(email)) {
    errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!isRequired(password)) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  } else if (!isMinLength(password, 6)) {
    errors.push(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH);
  }
  
  return errors;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = [];
  
  if (!isRequired(confirmPassword)) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  } else if (password !== confirmPassword) {
    errors.push(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
  }
  
  return errors;
};

export const validateName = (name, fieldName = 'Name') => {
  const errors = [];
  
  if (!isRequired(name)) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  } else if (!isMinLength(name, 2)) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  } else if (!isMaxLength(name, 50)) {
    errors.push(`${fieldName} must not exceed 50 characters`);
  }
  
  return errors;
};

export const validateTodoTitle = (title) => {
  const errors = [];
  
  if (!isRequired(title)) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
  } else if (!isMinLength(title, 3)) {
    errors.push(VALIDATION_MESSAGES.TITLE_MIN_LENGTH);
  } else if (!isMaxLength(title, 100)) {
    errors.push(VALIDATION_MESSAGES.TITLE_MAX_LENGTH);
  }
  
  return errors;
};

export const validateTodoDescription = (description) => {
  const errors = [];
  
  if (description && !isMaxLength(description, 500)) {
    errors.push('Description must not exceed 500 characters');
  }
  
  return errors;
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailErrors = validateEmail(formData.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors[0];
  }
  
  const passwordErrors = validatePassword(formData.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const firstNameErrors = validateName(formData.firstName, 'First name');
  if (firstNameErrors.length > 0) {
    errors.firstName = firstNameErrors[0];
  }
  
  const lastNameErrors = validateName(formData.lastName, 'Last name');
  if (lastNameErrors.length > 0) {
    errors.lastName = lastNameErrors[0];
  }
  
  const emailErrors = validateEmail(formData.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors[0];
  }
  
  const passwordErrors = validatePassword(formData.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  
  const confirmPasswordErrors = validateConfirmPassword(
    formData.password, 
    formData.confirmPassword
  );
  if (confirmPasswordErrors.length > 0) {
    errors.confirmPassword = confirmPasswordErrors[0];
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateTodoForm = (formData) => {
  const errors = {};
  
  const titleErrors = validateTodoTitle(formData.title);
  if (titleErrors.length > 0) {
    errors.title = titleErrors[0];
  }
  
  const descriptionErrors = validateTodoDescription(formData.description);
  if (descriptionErrors.length > 0) {
    errors.description = descriptionErrors[0];
  }
  
  if (formData.dueDate) {
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateProfileForm = (formData) => {
  const errors = {};
  
  const firstNameErrors = validateName(formData.firstName, 'First name');
  if (firstNameErrors.length > 0) {
    errors.firstName = firstNameErrors[0];
  }
  
  const lastNameErrors = validateName(formData.lastName, 'Last name');
  if (lastNameErrors.length > 0) {
    errors.lastName = lastNameErrors[0];
  }
  
  const emailErrors = validateEmail(formData.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors[0];
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};