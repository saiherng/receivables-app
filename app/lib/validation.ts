/**
 * Input validation and sanitization utilities
 */

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate and sanitize text input
export function validateText(input: string, maxLength: number = 255): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid text input');
  }
  
  const sanitized = sanitizeHtml(input.trim());
  
  if (sanitized.length > maxLength) {
    throw new Error(`Text input exceeds maximum length of ${maxLength} characters`);
  }
  
  if (sanitized.length === 0) {
    throw new Error('Text input cannot be empty');
  }
  
  return sanitized;
}

// Validate amount (positive number)
export function validateAmount(amount: any): number {
  if (amount === null || amount === undefined || amount === '') {
    throw new Error('Amount is required');
  }
  
  const num = parseFloat(amount);
  
  if (isNaN(num)) {
    throw new Error('Amount must be a valid number');
  }
  
  if (num <= 0) {
    throw new Error('Amount must be greater than zero');
  }
  
  if (num > 999999999.99) {
    throw new Error('Amount exceeds maximum allowed value');
  }
  
  return Math.round(num * 100) / 100; // Round to 2 decimal places
}

// Validate date
export function validateDate(date: any): string {
  if (!date || typeof date !== 'string') {
    throw new Error('Date is required');
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date format');
  }
  
  // Check if date is in the future (optional validation)
  if (dateObj > new Date()) {
    throw new Error('Date cannot be in the future');
  }
  
  // Check if date is too far in the past (optional validation)
  const minDate = new Date('1900-01-01');
  if (dateObj < minDate) {
    throw new Error('Date is too far in the past');
  }
  
  return dateObj.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Validate UUID
export function validateUUID(uuid: any): string {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error('UUID is required');
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    throw new Error('Invalid UUID format');
  }
  
  return uuid;
}

// Validate email
export function validateEmail(email: any): string {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase().trim();
}

// Validate payment type
export function validatePaymentType(paymentType: any): string {
  const allowedTypes = [
    'Cash',
    'KPay',
    'Banking',
    'Wave Money',
    'CB Pay',
    'Other'
  ];
  
  if (!paymentType || typeof paymentType !== 'string') {
    throw new Error('Payment type is required');
  }
  
  const sanitized = validateText(paymentType, 50);
  
  if (!allowedTypes.includes(sanitized)) {
    throw new Error('Invalid payment type');
  }
  
  return sanitized;
}

// Validate receivable data
export function validateReceivableData(data: any) {
  return {
    customer_name: validateText(data.customer_name, 100),
    amount: validateAmount(data.amount),
    date: validateDate(data.date),
    city: validateText(data.city, 50),
    description: data.description ? validateText(data.description, 500) : null,
  };
}

// Validate payment data
export function validatePaymentData(data: any) {
  return {
    receivable_id: validateUUID(data.receivable_id),
    payment_amount: validateAmount(data.payment_amount),
    payment_date: validateDate(data.payment_date),
    payment_type: validatePaymentType(data.payment_type),
    notes: data.notes ? validateText(data.notes, 500) : null,
  };
}

// Rate limiting utility (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}
