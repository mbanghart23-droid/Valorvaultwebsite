// Input validation and sanitization utilities

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Validate password strength
 * Requirements: Min 8 chars, uppercase, lowercase, number
 */
export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  
  // Min 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password) && password.length <= 128;
}

/**
 * Get password validation error message
 */
export function getPasswordError(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password is too long';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  return null;
}

/**
 * Sanitize text input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Trim whitespace
    .trim()
    // Limit length
    .substring(0, 10000);
}

/**
 * Sanitize name input (allows basic characters only)
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  
  return name
    // Only allow letters, numbers, spaces, hyphens, apostrophes, periods
    .replace(/[^a-zA-Z0-9\s\-'.]/g, '')
    .trim()
    .substring(0, 100);
}

/**
 * Validate name field
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  
  const sanitized = sanitizeName(name);
  return sanitized.length >= 1 && sanitized.length <= 100;
}

/**
 * Validate image file type
 */
export function isValidImageType(mimeType: string): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  return allowedTypes.includes(mimeType.toLowerCase());
}

/**
 * Validate image data URL
 */
export function isValidImageDataUrl(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  
  // Check if it starts with data:image/
  if (!dataUrl.startsWith('data:image/')) return false;
  
  // Extract mime type
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,/);
  if (!match) return false;
  
  const mimeType = match[1];
  return isValidImageType(mimeType);
}

/**
 * Estimate base64 image size in bytes
 */
export function getBase64ImageSize(dataUrl: string): number {
  if (!dataUrl || !dataUrl.includes(',')) return 0;
  
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data) return 0;
  
  // Base64 adds ~33% overhead
  const sizeInBytes = (base64Data.length * 3) / 4;
  
  // Account for padding
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  
  return sizeInBytes - padding;
}

/**
 * Validate image size (max 5MB)
 */
export function isValidImageSize(dataUrl: string, maxSizeInMB: number = 5): boolean {
  const sizeInBytes = getBase64ImageSize(dataUrl);
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  return sizeInBytes > 0 && sizeInBytes <= maxSizeInBytes;
}

/**
 * Validate rank field
 */
export function isValidRank(rank: string): boolean {
  if (!rank || typeof rank !== 'string') return false;
  
  const sanitized = sanitizeText(rank);
  return sanitized.length >= 1 && sanitized.length <= 100;
}

/**
 * Validate branch field
 */
export function isValidBranch(branch: string): boolean {
  const validBranches = [
    'Army',
    'Navy',
    'Air Force',
    'Marines',
    'Coast Guard',
    'Space Force',
    'National Guard',
    'Other'
  ];
  
  return validBranches.includes(branch);
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  
  // Allow empty string for optional dates
  if (dateStr.trim() === '') return true;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate person data
 */
export function validatePersonData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Only name is required
  if (!data.name || !isValidName(data.name)) {
    errors.push('Valid name is required (1-100 characters, letters and basic punctuation only)');
  }
  
  // All other fields are optional
  if (data.branch && !isValidBranch(data.branch)) {
    errors.push('Invalid branch of service');
  }
  
  // Validate country array if provided
  if (data.country) {
    if (!Array.isArray(data.country)) {
      errors.push('Country must be an array');
    } else {
      for (const c of data.country) {
        if (typeof c !== 'string' || sanitizeText(c).length > 100) {
          errors.push('Each country must be a string and max 100 characters');
          break;
        }
      }
    }
  }
  
  // Validate rank array if provided
  if (data.rank) {
    if (!Array.isArray(data.rank)) {
      errors.push('Rank must be an array');
    } else {
      for (const r of data.rank) {
        if (typeof r !== 'string' || sanitizeText(r).length > 100) {
          errors.push('Each rank must be a string and max 100 characters');
          break;
        }
      }
    }
  }
  
  // Validate era array if provided
  if (data.era) {
    if (!Array.isArray(data.era)) {
      errors.push('Era must be an array');
    } else {
      for (const e of data.era) {
        if (typeof e !== 'string' || sanitizeText(e).length > 100) {
          errors.push('Each era must be a string and max 100 characters');
          break;
        }
      }
    }
  }
  
  // Validate unit array if provided
  if (data.unit) {
    if (!Array.isArray(data.unit)) {
      errors.push('Unit must be an array');
    } else {
      for (const u of data.unit) {
        if (typeof u !== 'string' || sanitizeText(u).length > 200) {
          errors.push('Each unit must be a string and max 200 characters');
          break;
        }
      }
    }
  }
  
  if (data.serviceNumber && sanitizeText(data.serviceNumber).length > 100) {
    errors.push('Service number is too long (max 100 characters)');
  }
  
  if (data.dateOfBirth && !isValidDate(data.dateOfBirth)) {
    errors.push('Invalid date of birth format (use YYYY-MM-DD)');
  }
  
  if (data.dateOfDeath && !isValidDate(data.dateOfDeath)) {
    errors.push('Invalid date of death format (use YYYY-MM-DD)');
  }
  
  if (data.placeOfBirth && sanitizeText(data.placeOfBirth).length > 200) {
    errors.push('Place of birth is too long (max 200 characters)');
  }
  
  if (data.biography && sanitizeText(data.biography).length > 5000) {
    errors.push('Biography is too long (max 5000 characters)');
  }
  
  if (data.notes && sanitizeText(data.notes).length > 2000) {
    errors.push('Notes are too long (max 2000 characters)');
  }
  
  // Validate images if present
  if (data.images && Array.isArray(data.images)) {
    if (data.images.length > 10) {
      errors.push('Maximum 10 images allowed per person');
    }
    
    for (let i = 0; i < data.images.length; i++) {
      const img = data.images[i];
      
      if (!isValidImageDataUrl(img)) {
        errors.push(`Image ${i + 1} has invalid format (must be JPG, PNG, WebP, or GIF)`);
      }
      
      if (!isValidImageSize(img, 5)) {
        errors.push(`Image ${i + 1} is too large (max 5MB per image)`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize person data before saving
 */
export function sanitizePersonData(data: any): any {
  const sanitized: any = {
    ...data,
    name: sanitizeName(data.name || ''),
    serviceNumber: sanitizeText(data.serviceNumber || ''),
    biography: sanitizeText(data.biography || ''),
    notes: sanitizeText(data.notes || ''),
    placeOfBirth: sanitizeText(data.placeOfBirth || ''),
    branch: data.branch || '',
    dateOfBirth: data.dateOfBirth || '',
    dateOfDeath: data.dateOfDeath || '',
  };
  
  // Sanitize country array
  if (data.country && Array.isArray(data.country)) {
    sanitized.country = data.country.map((c: string) => sanitizeText(c)).filter((c: string) => c.length > 0);
  } else {
    sanitized.country = [];
  }
  
  // Sanitize rank array
  if (data.rank && Array.isArray(data.rank)) {
    sanitized.rank = data.rank.map((r: string) => sanitizeText(r)).filter((r: string) => r.length > 0);
  } else {
    sanitized.rank = [];
  }
  
  // Sanitize era array
  if (data.era && Array.isArray(data.era)) {
    sanitized.era = data.era.map((e: string) => sanitizeText(e)).filter((e: string) => e.length > 0);
  } else {
    sanitized.era = [];
  }
  
  // Sanitize unit array
  if (data.unit && Array.isArray(data.unit)) {
    sanitized.unit = data.unit.map((u: string) => sanitizeText(u)).filter((u: string) => u.length > 0);
  } else {
    sanitized.unit = [];
  }
  
  return sanitized;
}

/**
 * Validate contact request message
 */
export function validateContactMessage(message: string): { valid: boolean; error?: string } {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' };
  }
  
  const sanitized = sanitizeText(message);
  
  if (sanitized.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' };
  }
  
  if (sanitized.length > 1000) {
    return { valid: false, error: 'Message is too long (max 1000 characters)' };
  }
  
  return { valid: true };
}

/**
 * Validate user profile data
 */
export function validateProfileData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate name if provided
  if (data.name && !isValidName(data.name)) {
    errors.push('Valid name is required (1-100 characters, letters and basic punctuation only)');
  }
  
  // Validate email if provided
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.collectorSince && sanitizeText(data.collectorSince).length > 100) {
    errors.push('Collector since field is too long');
  }
  
  if (data.location && sanitizeText(data.location).length > 200) {
    errors.push('Location is too long');
  }
  
  if (data.bio && sanitizeText(data.bio).length > 2000) {
    errors.push('Bio is too long (max 2000 characters)');
  }
  
  if (data.specialization && sanitizeText(data.specialization).length > 500) {
    errors.push('Specialization is too long');
  }
  
  if (data.isDiscoverable !== undefined && typeof data.isDiscoverable !== 'boolean') {
    errors.push('Invalid discoverable setting');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize profile data
 */
export function sanitizeProfileData(data: any): any {
  const sanitized: any = {
    collectorSince: sanitizeText(data.collectorSince || ''),
    location: sanitizeText(data.location || ''),
    bio: sanitizeText(data.bio || ''),
    specialization: sanitizeText(data.specialization || ''),
    isDiscoverable: Boolean(data.isDiscoverable)
  };
  
  // Include name and email if provided
  if (data.name) {
    sanitized.name = sanitizeName(data.name);
  }
  if (data.email) {
    sanitized.email = data.email.trim().toLowerCase();
  }
  
  return sanitized;
}