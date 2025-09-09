export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.toLowerCase().includes('.edu');
}

export function sanitizeEmail(email: string): string {
  return String(email || '').trim().toLowerCase();
}