export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateVentureName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Venture name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, error: 'Venture name must be at least 2 characters' };
  }
  if (name.length > 100) {
    return { isValid: false, error: 'Venture name must be at most 100 characters' };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  return { isValid: true };
};

export const validateEventTitle = (title: string): ValidationResult => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Event title is required' };
  }
  if (title.length < 2) {
    return { isValid: false, error: 'Event title must be at least 2 characters' };
  }
  if (title.length > 200) {
    return { isValid: false, error: 'Event title must be at most 200 characters' };
  }
  return { isValid: true };
};

export const validateTaskTitle = (title: string): ValidationResult => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Task title is required' };
  }
  if (title.length < 2) {
    return { isValid: false, error: 'Task title must be at least 2 characters' };
  }
  if (title.length > 200) {
    return { isValid: false, error: 'Task title must be at most 200 characters' };
  }
  return { isValid: true };
};

export const validateDate = (dateStr: string): ValidationResult => {
  if (!dateStr || dateStr.trim().length === 0) {
    return { isValid: false, error: 'Date is required' };
  }
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid date format' };
  }
};
