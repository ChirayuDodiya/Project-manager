export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validateName = (name: string): string => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.length < 3) {
    return 'Name must be at least 3 characters';
  }
  if (name.length > 255) {
    return 'Name must not exceed 255 characters';
  }
  return '';
};

export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (email.length > 255) {
    return 'Email must not exceed 255 characters';
  }
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (password.length > 30) {
    return 'Password must not exceed 30 characters';
  }
  if (!passwordRegex.test(password)) {
    return 'Password must contain uppercase, lowercase and a number';
  }
  return '';
};

export const validateConfirmPassword = (confirm: string, passwordVal: string): string => {
  if (!confirm) {
    return 'Confirm password is required';
  }
  if (confirm !== passwordVal) {
    return 'Passwords do not match';
  }
  return '';
};
