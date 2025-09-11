import { db } from '../../db/index';
import { verification_codes, emails } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { hashCode } from '../utils/crypto';
import { auditService } from './auditService';
import { CODE_EXPIRY_MINUTES } from '../config';
import crypto from 'crypto';

// Export individual functions
export async function createVerificationCode(email: string): Promise<string> {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);
  
  await db.insert(verification_codes).values({ 
    email, 
    code_hash: codeHash, 
    expires_at: expiresAt 
  });
  
  await auditService.logEvent(email, 'REQUESTED', { by: 'submit-email' });

  return code;
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  const codeHash = hashCode(code);
  
  const rows = await db.select()
    .from(verification_codes)
    .where(eq(verification_codes.email, email))
    .orderBy(desc(verification_codes.created_at))
    .limit(1);

  const latest = rows[0];
  
  if (!latest || latest.used || new Date(latest.expires_at) < new Date()) {
    return false;
  }

  const storedBuffer = Buffer.from(latest.code_hash, 'utf8');
  const providedBuffer = Buffer.from(codeHash, 'utf8');
  
  if (storedBuffer.length !== providedBuffer.length || 
      !crypto.timingSafeEqual(storedBuffer, providedBuffer)) {
    return false;
  }

  await db.update(verification_codes)
    .set({ used: true })
    .where(eq(verification_codes.id, latest.id));

  const domain = email.split('@')[1]!;
  
  await db.insert(emails).values({ 
    email, 
    domain, 
    verified_at: new Date() 
  });
  
  await auditService.logEvent(email, 'CONFIRMED');

  return true;
}

// export as a named object
export const verificationService = {
  createVerificationCode,
  verifyCode
};