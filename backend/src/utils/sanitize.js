/**
 * Sanitize input to prevent XSS attacks
 * 
 * SECURITY NOTE: This is a defense-in-depth measure. Primary XSS protection comes from:
 * 1. This is a JSON-only API (no HTML rendering)
 * 2. All database queries use Prisma ORM (parameterized queries prevent SQL injection)
 * 3. express-validator validates all inputs at route level
 * 4. Responses are JSON (browsers won't execute as HTML)
 * 
 * This function provides an additional safety layer by removing any HTML tags
 * from string inputs, though they shouldn't be present in a properly validated JSON API.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove all HTML-like tags in a single pass to avoid incomplete sanitization
  // This covers <script>, <iframe>, and other tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove any event handler attributes that might have been separated
  sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');
  
  return sanitized.trim();
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }

  return sanitized;
};
