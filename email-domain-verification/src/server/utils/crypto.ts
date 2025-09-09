import crypto from 'crypto';
import { CODE_HASH_SECRET } from '../config';

export function hashCode(code: string): string {
  return crypto.createHmac('sha256', CODE_HASH_SECRET).update(code).digest('hex');
}

export function compareHashes(storedHash: string, providedHash: string): boolean {
  const storedBuffer = Buffer.from(storedHash, 'utf8');
  const providedBuffer = Buffer.from(providedHash, 'utf8');
  
  return storedBuffer.length === providedBuffer.length && 
         crypto.timingSafeEqual(storedBuffer, providedBuffer);
}