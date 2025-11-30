import DOMPurify from 'dompurify';

/**
 * Validates if an email has a valid format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates medical password strength
 */
export const validateMedicalPassword = (password: string): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove leading/trailing whitespace
  let sanitized = input.trim();
  
  // Use DOMPurify to sanitize HTML
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
  });
  
  // Additional sanitization for special characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
};

/**
 * Validates input length
 */
export const validateLength = (
  input: string,
  min: number,
  max: number
): { isValid: boolean; error?: string } => {
  if (input.length < min) {
    return { isValid: false, error: `Mínimo de ${min} caracteres` };
  }
  
  if (input.length > max) {
    return { isValid: false, error: `Máximo de ${max} caracteres` };
  }
  
  return { isValid: true };
};
