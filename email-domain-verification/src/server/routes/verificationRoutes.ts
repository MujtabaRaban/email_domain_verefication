import { Hono } from 'hono';
import { verifyCode } from '../services/verificationService';
import { sanitizeEmail } from '../utils/validation';

export const verificationRoutes = new Hono();

verificationRoutes.post('/', async (c) => {
  try {
    const { email, code } = await c.req.json();
    const cleanEmail = sanitizeEmail(email);
    
    if (!cleanEmail) {
      return c.json({ error: 'missing email' }, 400);
    }

    if (!code || String(code).trim().length === 0) {
      return c.json({ error: 'missing verification code' }, 400);
    }

    const isValid = await verifyCode(cleanEmail, String(code).trim());
    
    if (!isValid) {
      return c.json({ error: 'invalid email or expired code' }, 400);
    }

    return c.json({ ok: true });
    
  } catch (error) {
    console.error('Error in verification endpoint:', error);
    
    // Handle different error types
    if (error instanceof SyntaxError) {
      return c.json({ error: 'Invalid JSON format' }, 400);
    }
    
    if (error instanceof TypeError && error.message.includes('undefined')) {
      return c.json({ error: 'Missing required fields: email and code' }, 400);
    }
    
    return c.json({ 
      error: 'Internal server error. Please try again later.' 
    }, 500);
  }
});