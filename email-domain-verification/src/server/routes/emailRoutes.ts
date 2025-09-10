import { Hono } from 'hono';
import { sendVerificationEmail } from '../services/emailService';
import { createVerificationCode } from '../services/verificationService';
import { checkClientRateLimit, emailRateLimit, ipRateLimit } from '../utils/rateLimit';
import { isValidEmail, sanitizeEmail } from '../utils/validation';

export const emailRoutes = new Hono();

emailRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const email = sanitizeEmail(body?.email);
    const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || 'unknown';

    if (!isValidEmail(email)) {
      return c.json({ error: 'invalid .edu email' }, 400);
    }

    if (checkClientRateLimit(email, emailRateLimit)) {
      return c.json({ error: 'Too many requests for this email, try later.' }, 429);
    }

    if (checkClientRateLimit(ip, ipRateLimit)) {
      return c.json({ error: 'Too many requests from this IP, try later.' }, 429);
    }

    const code = await createVerificationCode(email);
    const emailSent = await sendVerificationEmail(email, code);
    
    if (!emailSent) {
      return c.json({ 
        error: `System busy. Please try again in ${10} seconds.` 
      }, 429);
    }

    return c.json({ ok: true, message: 'Verification code sent.' });
    
  } catch (error) {
    console.error('Error in email verification endpoint:', error);
    
    // Different error handling based on error type
    if (error instanceof SyntaxError) {
      return c.json({ error: 'Invalid JSON format' }, 400);
    }
    
    return c.json({ 
      error: 'Internal server error. Please try again later.' 
    }, 500);
  }
});