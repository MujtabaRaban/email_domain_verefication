import { Resend } from 'resend';
import { auditService } from './auditService';
import { CODE_EXPIRY_MINUTES } from '../config';

const resend = new Resend(process.env.RESEND_API_KEY!);

interface ResendRateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
  lastUpdated: number;
}

let resendRateLimitInfo: ResendRateLimitInfo = {
  limit: 10,
  remaining: 9,
  reset: 60,
  retryAfter: 0,
  lastUpdated: Date.now()
};

function extractRateLimitInfoFromError(error: any): boolean {
  if (error?.message?.includes('rate limit') || error?.message?.includes('too many requests')) {
    console.log('Rate limit error detected:', error.message);
    resendRateLimitInfo.remaining = 0;
    resendRateLimitInfo.retryAfter = 10;
    resendRateLimitInfo.lastUpdated = Date.now();
    return true;
  }
  return false;
}

function checkResendRateLimit(): { limited: boolean; retryAfter?: number; resetIn?: number } {
  const now = Date.now();
  
  if (now - resendRateLimitInfo.lastUpdated > 300000) {
    console.log('Rate limit info stale, resetting to defaults');
    resendRateLimitInfo.remaining = 10;
    resendRateLimitInfo.retryAfter = 0;
  }

  if (resendRateLimitInfo.remaining <= 0 && resendRateLimitInfo.retryAfter > 0) {
    return {
      limited: true,
      retryAfter: resendRateLimitInfo.retryAfter,
      resetIn: resendRateLimitInfo.reset
    };
  }
  
  return { limited: false };
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const rateLimitCheck = checkResendRateLimit();
    if (rateLimitCheck.limited) {
      await auditService.logEvent(email, 'FAILED', { 
        error: 'Resend rate limit exceeded',
        retryAfter: rateLimitCheck.retryAfter,
        resetIn: rateLimitCheck.resetIn
      });
      return false;
    }

    resendRateLimitInfo.remaining--;

    const { data, error } = await resend.emails.send({
      from: 'EduVerify <onboarding@resend.dev>',
      to: [email],
      subject: 'Your verification code',
      text: `Your code is ${code}. Expires in ${CODE_EXPIRY_MINUTES} minutes.`,
    });

    if (error) {
      if (extractRateLimitInfoFromError(error)) {
        await auditService.logEvent(email, 'FAILED', { 
          error: 'Resend rate limit exceeded',
          retryAfter: resendRateLimitInfo.retryAfter
        });
        return false;
      }

      console.error('Resend API error:', error);
      await auditService.logEvent(email, 'FAILED', { error: error.message });
      return true;
    }
    
    await auditService.logEvent(email, 'SENT', { provider: 'resend', id: data?.id });
    return true;
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    await auditService.logEvent(email, 'FAILED', { error: 'Network or unexpected error' });
    return true;
  }
}

// Export as named object
export const emailService = {
  sendVerificationEmail
};