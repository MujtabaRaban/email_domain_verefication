import { Hono } from 'hono';
import { verifyCode } from '../services/verificationService';
import { sanitizeEmail } from '../utils/validation';

export const verificationRoutes = new Hono();


verificationRoutes.post('/', async (c) => {
  const { email, code } = await c.req.json();
  const cleanEmail = sanitizeEmail(email);
  
  if (!cleanEmail) {
    return c.json({ error: 'missing email' }, 400);
  }

  const isValid = await verifyCode(cleanEmail, String(code));
  
  if (!isValid) {
    return c.json({ error: 'invalid email or expired code' }, 400);
  }

  return c.json({ ok: true });
});