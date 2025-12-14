// Rate limiting middleware to prevent abuse and attacks

import * as kv from "./kv_store.tsx";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix: string;
}

/**
 * Get client IP from request
 */
function getClientIp(request: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a default (in serverless environments, this might not be available)
  return 'unknown';
}

/**
 * Check rate limit for a given key
 */
export async function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const ip = getClientIp(request);
  const key = `ratelimit:${config.keyPrefix}:${ip}`;
  
  try {
    // Get current rate limit data
    const data = await kv.get(key);
    const now = Date.now();
    
    if (!data) {
      // First request, create new rate limit entry
      const resetAt = now + config.windowMs;
      await kv.set(key, {
        count: 1,
        resetAt
      });
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt
      };
    }
    
    // Check if window has expired
    if (now > data.resetAt) {
      // Window expired, reset counter
      const resetAt = now + config.windowMs;
      await kv.set(key, {
        count: 1,
        resetAt
      });
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt
      };
    }
    
    // Window still active, check if limit exceeded
    if (data.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt
      };
    }
    
    // Increment counter
    await kv.set(key, {
      count: data.count + 1,
      resetAt: data.resetAt
    });
    
    return {
      allowed: true,
      remaining: config.maxRequests - data.count - 1,
      resetAt: data.resetAt
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow request (fail open)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: Date.now() + config.windowMs
    };
  }
}

/**
 * Check rate limit for user-specific actions (requires userId)
 */
export async function checkUserRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `ratelimit:${config.keyPrefix}:${userId}`;
  
  try {
    const data = await kv.get(key);
    const now = Date.now();
    
    if (!data) {
      const resetAt = now + config.windowMs;
      await kv.set(key, {
        count: 1,
        resetAt
      });
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt
      };
    }
    
    if (now > data.resetAt) {
      const resetAt = now + config.windowMs;
      await kv.set(key, {
        count: 1,
        resetAt
      });
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt
      };
    }
    
    if (data.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt
      };
    }
    
    await kv.set(key, {
      count: data.count + 1,
      resetAt: data.resetAt
    });
    
    return {
      allowed: true,
      remaining: config.maxRequests - data.count - 1,
      resetAt: data.resetAt
    };
  } catch (error) {
    console.error('User rate limit check error:', error);
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: Date.now() + config.windowMs
    };
  }
}

/**
 * Format time remaining until reset
 */
export function formatResetTime(resetAt: number): string {
  const now = Date.now();
  const msRemaining = resetAt - now;
  
  if (msRemaining <= 0) return '0 seconds';
  
  const seconds = Math.ceil(msRemaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

// Rate limit configurations
export const RATE_LIMITS = {
  // Login attempts: 5 per 15 minutes
  LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: 'login'
  },
  
  // Registration: 3 per hour
  REGISTER: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'register'
  },
  
  // Password reset requests: 3 per hour
  PASSWORD_RESET_REQUEST: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'password-reset-request'
  },
  
  // Password reset confirmation: 5 per hour
  PASSWORD_RESET_CONFIRM: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'password-reset-confirm'
  },
  
  // Contact requests per user: 10 per day
  CONTACT_REQUEST: {
    maxRequests: 10,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: 'contact-request'
  },
  
  // Image uploads: 50 per hour
  IMAGE_UPLOAD: {
    maxRequests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'image-upload'
  },
  
  // General API requests: 100 per minute
  API_GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'api-general'
  }
};
