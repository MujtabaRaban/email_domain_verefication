export const PORT = Number(process.env.PORT || 3000);
export const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
export const CODE_HASH_SECRET = process.env.CODE_HASH_SECRET || 'default_secret';
export const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 10;
export const CODE_EXPIRY_MINUTES = 10;

export const MAX_SEND_EMAIL_REQUESTS = 3;  // 3 emails per hour
export const MAX_VERIFY_REQUESTS = 3;      // 3 verification attempts per hour
export const MAX_IP_REQUESTS = 10;         // optional IP-wide limit