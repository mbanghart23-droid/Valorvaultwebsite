import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { supabaseAdmin, verifyToken, verifyActiveUser } from "./auth.tsx";
import { initializeStorage, uploadImage, getSignedUrl, deleteImage } from "./storage.tsx";
import { 
  sendEmail, 
  newRegistrationEmail,
  registrationConfirmationEmail,
  accountActivatedEmail,
  contactRequestEmail,
  requestApprovedEmail,
  requestDeclinedEmail,
  getAdminEmails,
  passwordResetEmail,
  passwordResetConfirmationEmail
} from "./email.tsx";
import {
  isValidEmail,
  isValidPassword,
  getPasswordError,
  sanitizeName,
  sanitizeText,
  validatePersonData,
  sanitizePersonData,
  validateContactMessage,
  validateProfileData,
  sanitizeProfileData
} from "./validation.tsx";
import {
  checkRateLimit,
  checkUserRateLimit,
  formatResetTime,
  RATE_LIMITS
} from "./ratelimit.tsx";

const app = new Hono();

// Initialize storage on startup
initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Security headers middleware
app.use('*', async (c, next) => {
  await next();
  
  // Add security headers to response
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
});

// Health check endpoint
app.get("/make-server-8db4ea83/health", (c) => {
  return c.json({ status: "ok" });
});

// ============== AUTH ENDPOINTS ==============

// Register new user (requires admin approval)
app.post("/make-server-8db4ea83/auth/register", async (c) => {
  try {
    const { name, email, password, membershipTier } = await c.req.json();
    
    if (!name || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Validate email and password
    if (!isValidEmail(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }
    if (!isValidPassword(password)) {
      return c.json({ error: getPasswordError(password) }, 400);
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm email since email server not configured
    });
    
    if (authError || !authData.user) {
      console.log('Registration auth error:', authError);
      return c.json({ error: authError?.message || 'Failed to create user' }, 400);
    }
    
    // Store user profile in KV store (inactive by default, needs admin approval)
    const userProfile = {
      id: authData.user.id,
      email,
      name,
      isActive: false, // Requires admin activation
      isAdmin: false,
      registeredAt: new Date().toISOString(),
      membershipTier: membershipTier || 'beta-user',
      profile: {
        collectorSince: '',
        location: '',
        bio: '',
        specialization: '',
        isDiscoverable: false
      }
    };
    
    await kv.set(`user:${authData.user.id}`, userProfile);
    
    // Send confirmation email to the new user
    await sendEmail({
      to: email,
      subject: 'Welcome to Valor Registry - Registration Received',
      html: registrationConfirmationEmail(userProfile)
    });
    console.log(`Sent registration confirmation email to ${email}`);
    
    // Send email to all admin users
    const adminEmails = await getAdminEmails(kv);
    if (adminEmails.length > 0) {
      for (const adminEmail of adminEmails) {
        await sendEmail({
          to: adminEmail,
          subject: `New User Registration - ${name}`,
          html: newRegistrationEmail(userProfile)
        });
      }
      console.log(`Sent registration emails to ${adminEmails.length} admin(s)`);
    } else {
      console.log('No admin users found to send registration notification');
    }
    
    return c.json({ 
      success: true, 
      message: 'Registration successful! Your account is pending admin approval.' 
    });
  } catch (error) {
    console.log('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Login
app.post("/make-server-8db4ea83/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabaseClient = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error || !data.session) {
      console.log('Login error:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Check if user is active
    const userProfile = await kv.get(`user:${data.user.id}`);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    if (!userProfile.isActive) {
      return c.json({ error: 'Account pending admin approval' }, 403);
    }
    
    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: userProfile
    });
  } catch (error) {
    console.log('Login exception:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Get current user session
app.get("/make-server-8db4ea83/auth/session", async (c) => {
  try {
    const result = await verifyActiveUser(c.req.header('Authorization'));
    
    if (!result) {
      return c.json({ error: 'Unauthorized or account inactive' }, 401);
    }
    
    return c.json({ user: result.userProfile });
  } catch (error) {
    console.log('Session error:', error);
    return c.json({ error: 'Failed to get session' }, 500);
  }
});

// Logout
app.post("/make-server-8db4ea83/auth/logout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (accessToken) {
      await supabaseAdmin.auth.admin.signOut(accessToken);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Logout error:', error);
    return c.json({ success: true }); // Return success anyway
  }
});

// Request password reset
app.post("/make-server-8db4ea83/auth/request-password-reset", async (c) => {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(c.req, RATE_LIMITS.PASSWORD_RESET_REQUEST);
    if (!rateLimit.allowed) {
      return c.json({ 
        error: `Too many password reset attempts. Please try again in ${formatResetTime(rateLimit.resetAt)}` 
      }, 429);
    }
    
    const { email } = await c.req.json();
    
    if (!email || !isValidEmail(email)) {
      return c.json({ error: 'Valid email is required' }, 400);
    }
    
    // Find user by email (search all users)
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return c.json({ 
        success: true, 
        message: 'If an account exists with that email, a password reset link has been sent.' 
      });
    }
    
    // Generate reset token (random string)
    const resetToken = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    // Store reset token
    await kv.set(`password-reset:${resetToken}`, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      used: false
    });
    
    // Send password reset email
    await sendEmail({
      to: user.email,
      subject: 'Reset Your Valor Vault Password',
      html: passwordResetEmail(user.name, resetToken, expiresAt.toISOString())
    });
    
    console.log(`Password reset email sent to ${user.email}`);
    
    return c.json({ 
      success: true, 
      message: 'If an account exists with that email, a password reset link has been sent.' 
    });
  } catch (error) {
    console.log('Request password reset error:', error);
    return c.json({ error: 'Failed to process password reset request' }, 500);
  }
});

// Confirm password reset
app.post("/make-server-8db4ea83/auth/reset-password", async (c) => {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(c.req, RATE_LIMITS.PASSWORD_RESET_CONFIRM);
    if (!rateLimit.allowed) {
      return c.json({ 
        error: `Too many password reset attempts. Please try again in ${formatResetTime(rateLimit.resetAt)}` 
      }, 429);
    }
    
    const { token, newPassword } = await c.req.json();
    
    if (!token || !newPassword) {
      return c.json({ error: 'Token and new password are required' }, 400);
    }
    
    // Validate new password
    if (!isValidPassword(newPassword)) {
      return c.json({ error: getPasswordError(newPassword) }, 400);
    }
    
    // Get reset token data
    const resetData = await kv.get(`password-reset:${token}`);
    
    if (!resetData) {
      return c.json({ error: 'Invalid or expired reset token' }, 400);
    }
    
    // Check if token has been used
    if (resetData.used) {
      return c.json({ error: 'This reset link has already been used' }, 400);
    }
    
    // Check if token has expired
    if (new Date() > new Date(resetData.expiresAt)) {
      await kv.del(`password-reset:${token}`);
      return c.json({ error: 'This reset link has expired. Please request a new one.' }, 400);
    }
    
    // Update password in Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      resetData.userId,
      { password: newPassword }
    );
    
    if (error) {
      console.log('Password update error:', error);
      return c.json({ error: 'Failed to update password' }, 500);
    }
    
    // Mark token as used
    resetData.used = true;
    await kv.set(`password-reset:${token}`, resetData);
    
    // Get user profile for confirmation email
    const userProfile = await kv.get(`user:${resetData.userId}`);
    
    if (userProfile) {
      // Send confirmation email
      await sendEmail({
        to: userProfile.email,
        subject: 'Your Valor Vault Password Has Been Changed',
        html: passwordResetConfirmationEmail(userProfile.name)
      });
      
      console.log(`Password reset confirmation email sent to ${userProfile.email}`);
    }
    
    return c.json({ 
      success: true, 
      message: 'Password successfully reset. You can now log in with your new password.' 
    });
  } catch (error) {
    console.log('Reset password error:', error);
    return c.json({ error: 'Failed to reset password' }, 500);
  }
});

// ============== USER PROFILE ENDPOINTS ==============

// Get user profile
app.get("/make-server-8db4ea83/profile", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ profile: userProfile.profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-8db4ea83/profile", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const updates = await c.req.json();
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Validate and sanitize profile data
    const validation = validateProfileData(updates);
    if (!validation.valid) {
      return c.json({ error: validation.errors.join(', ') }, 400);
    }
    const sanitizedUpdates = sanitizeProfileData(updates);
    
    // Update profile fields
    userProfile.profile = { ...userProfile.profile, ...sanitizedUpdates };
    
    // Update name and email in the main user record if provided
    if (sanitizedUpdates.name) {
      userProfile.name = sanitizedUpdates.name;
      userProfile.profile.name = sanitizedUpdates.name;
    }
    if (sanitizedUpdates.email) {
      userProfile.email = sanitizedUpdates.email;
      userProfile.profile.email = sanitizedUpdates.email;
    }
    
    await kv.set(`user:${userId}`, userProfile);
    
    // Return the full profile with updated name and email
    return c.json({ 
      success: true, 
      profile: {
        ...userProfile.profile,
        name: userProfile.name,
        email: userProfile.email
      }
    });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Change password
app.put("/make-server-8db4ea83/profile/change-password", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log('Change password authorization error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { currentPassword, newPassword } = await c.req.json();

    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current password and new password are required' }, 400);
    }

    // Validate new password strength
    if (!isValidPassword(newPassword)) {
      return c.json({ error: getPasswordError(newPassword) }, 400);
    }

    // Verify current password by attempting to sign in
    const supabaseClient = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );
    
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      console.log('Current password verification failed:', signInError);
      return c.json({ error: 'Current password is incorrect' }, 401);
    }

    // Update password using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.log('Password update error:', updateError);
      return c.json({ error: 'Failed to update password' }, 500);
    }

    return c.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.log('Change password error:', error);
    return c.json({ error: 'Failed to change password' }, 500);
  }
});

// Delete account
app.delete("/make-server-8db4ea83/profile/delete-account", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log('Delete account authorization error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { password } = await c.req.json();

    if (!password) {
      return c.json({ error: 'Password is required to delete account' }, 400);
    }

    // Verify password by attempting to sign in
    const supabaseClient = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );
    
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: password
    });

    if (signInError) {
      console.log('Password verification failed for account deletion:', signInError);
      return c.json({ error: 'Password is incorrect' }, 401);
    }

    const userId = user.id;

    // Delete all user's persons and associated data
    const personsData = await kv.getByPrefix(`person:${userId}:`);
    for (const person of personsData) {
      // Delete person's images from storage
      if (person.profileImageFile) {
        await deleteImage(person.profileImageFile);
      }
      
      if (person.imageFiles && person.imageFiles.length > 0) {
        for (const filePath of person.imageFiles) {
          await deleteImage(filePath);
        }
      }
      
      // Delete person record
      await kv.del(`person:${userId}:${person.id}`);
    }

    // Delete all contact requests involving this user
    const allContactRequests = await kv.getByPrefix('contact-request:');
    for (const request of allContactRequests) {
      if (request.fromUserId === userId || request.toUserId === userId) {
        await kv.del(`contact-request:${request.id}`);
      }
    }

    // Delete user profile
    await kv.del(`user:${userId}`);

    // Delete from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.log('Error deleting user from auth:', deleteError);
      return c.json({ error: 'Failed to delete account from authentication system' }, 500);
    }

    return c.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.log('Delete account error:', error);
    return c.json({ error: 'Failed to delete account' }, 500);
  }
});

// ============== PERSON ENDPOINTS ==============

// Get all persons for current user
app.get("/make-server-8db4ea83/persons", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const persons = await kv.getByPrefix(`person:${userId}:`);
    
    // Get signed URLs for images
    for (const person of persons) {
      // Get signed URL for profile image
      if (person.profileImageFile) {
        const signedUrl = await getSignedUrl(person.profileImageFile);
        if (signedUrl) {
          person.profileImage = signedUrl;
        }
      }
      
      if (person.imageFiles && person.imageFiles.length > 0) {
        person.images = [];
        for (const filePath of person.imageFiles) {
          const signedUrl = await getSignedUrl(filePath);
          if (signedUrl) {
            person.images.push(signedUrl);
          }
        }
      }
    }
    
    return c.json({ persons });
  } catch (error) {
    console.log('Get persons error:', error);
    return c.json({ error: 'Failed to get persons' }, 500);
  }
});

// Get single person
app.get("/make-server-8db4ea83/persons/:id", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const personId = c.req.param('id');
    const person = await kv.get(`person:${userId}:${personId}`);
    
    if (!person) {
      return c.json({ error: 'Person not found' }, 404);
    }
    
    // Get signed URL for profile image
    if (person.profileImageFile) {
      const signedUrl = await getSignedUrl(person.profileImageFile);
      if (signedUrl) {
        person.profileImage = signedUrl;
      }
    }
    
    // Get signed URLs for images
    if (person.imageFiles && person.imageFiles.length > 0) {
      person.images = [];
      for (const filePath of person.imageFiles) {
        const signedUrl = await getSignedUrl(filePath);
        if (signedUrl) {
          person.images.push(signedUrl);
        }
      }
    }
    
    return c.json({ person });
  } catch (error) {
    console.log('Get person error:', error);
    return c.json({ error: 'Failed to get person' }, 500);
  }
});

// Create person
app.post("/make-server-8db4ea83/persons", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const personData = await c.req.json();
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const personId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Handle profile image upload
    let profileImageFile = '';
    if (personData.profileImage && personData.profileImage.startsWith('data:')) {
      const fileName = `person-${personId}-profile.jpg`;
      const filePath = await uploadImage(userId, personData.profileImage, fileName);
      if (filePath) {
        profileImageFile = filePath;
      }
    }
    
    // Handle image uploads
    const imageFiles = [];
    if (personData.images && personData.images.length > 0) {
      for (let i = 0; i < personData.images.length; i++) {
        const imageData = personData.images[i];
        const fileName = `person-${personId}-${i}.jpg`;
        const filePath = await uploadImage(userId, imageData, fileName);
        if (filePath) {
          imageFiles.push(filePath);
        }
      }
    }
    
    // Validate and sanitize person data
    const validation = validatePersonData(personData);
    if (!validation.valid) {
      console.log('Person validation errors:', validation.errors);
      return c.json({ error: validation.errors.join(', ') }, 400);
    }
    const sanitizedData = sanitizePersonData(personData);
    
    const person = {
      id: personId,
      ...sanitizedData,
      profileImageFile, // Store profile image file path
      profileImage: undefined, // Remove base64 profile image
      imageFiles, // Store file paths
      images: undefined, // Remove base64 images
      ownerId: userId,
      ownerName: userProfile.name,
      medals: personData.medals || []
    };
    
    await kv.set(`person:${userId}:${personId}`, person);
    
    return c.json({ success: true, person });
  } catch (error) {
    console.log('Create person error:', error);
    return c.json({ error: 'Failed to create person' }, 500);
  }
});

// Update person
app.put("/make-server-8db4ea83/persons/:id", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const personId = c.req.param('id');
    const updates = await c.req.json();
    const existingPerson = await kv.get(`person:${userId}:${personId}`);
    
    if (!existingPerson) {
      return c.json({ error: 'Person not found' }, 404);
    }
    
    // Handle profile image update
    let profileImageFile = existingPerson.profileImageFile || '';
    if (updates.profileImage && updates.profileImage.startsWith('data:')) {
      // Delete old profile image
      if (profileImageFile) {
        await deleteImage(profileImageFile);
      }
      // Upload new profile image
      const fileName = `person-${personId}-profile.jpg`;
      const filePath = await uploadImage(userId, updates.profileImage, fileName);
      if (filePath) {
        profileImageFile = filePath;
      }
    }
    
    // Handle new image uploads
    let imageFiles = existingPerson.imageFiles || [];
    if (updates.images && updates.images.length > 0) {
      // Delete old images
      for (const filePath of imageFiles) {
        await deleteImage(filePath);
      }
      
      // Upload new images
      imageFiles = [];
      for (let i = 0; i < updates.images.length; i++) {
        const imageData = updates.images[i];
        if (imageData.startsWith('data:')) {
          const fileName = `person-${personId}-${i}.jpg`;
          const filePath = await uploadImage(userId, imageData, fileName);
          if (filePath) {
            imageFiles.push(filePath);
          }
        }
      }
    }
    
    // Validate and sanitize person data
    const validation = validatePersonData(updates);
    if (!validation.valid) {
      console.log('Person update validation errors:', validation.errors);
      return c.json({ error: validation.errors.join(', ') }, 400);
    }
    const sanitizedUpdates = sanitizePersonData(updates);
    
    const person = {
      ...existingPerson,
      ...sanitizedUpdates,
      profileImageFile,
      profileImage: undefined,
      imageFiles,
      images: undefined,
      id: personId,
      ownerId: userId
    };
    
    await kv.set(`person:${userId}:${personId}`, person);
    
    return c.json({ success: true, person });
  } catch (error) {
    console.log('Update person error:', error);
    return c.json({ error: 'Failed to update person' }, 500);
  }
});

// Delete person (protected route)
app.delete('/make-server-8db4ea83/persons/:id', async (c) => {
  try {
    const result = await verifyActiveUser(c.req.header('Authorization'));
    if (!result) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = result.userId;
    const personId = c.req.param('id');
    const person = await kv.get(`person:${userId}:${personId}`);
    
    if (!person) {
      return c.json({ error: 'Person not found' }, 404);
    }
    
    // Delete profile image from storage if it exists
    if (person.profileImageFile) {
      await deleteImage(person.profileImageFile);
    }
    
    // Delete all images from storage
    if (person.imageFiles && person.imageFiles.length > 0) {
      for (const filePath of person.imageFiles) {
        await deleteImage(filePath);
      }
    }
    
    await kv.del(`person:${userId}:${personId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete person error:', error);
    return c.json({ error: 'Failed to delete person' }, 500);
  }
});

// ============== GLOBAL SEARCH ENDPOINTS ==============

// Get all discoverable persons (for global search)
app.get("/make-server-8db4ea83/search/persons", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const allPersons = await kv.getByPrefix('person:');
    
    // Filter to only discoverable persons
    const discoverablePersons = [];
    for (const person of allPersons) {
      const ownerProfile = await kv.get(`user:${person.ownerId}`);
      if (ownerProfile && ownerProfile.profile.isDiscoverable) {
        // Get signed URL for profile image
        if (person.profileImageFile) {
          const signedUrl = await getSignedUrl(person.profileImageFile);
          if (signedUrl) {
            person.profileImage = signedUrl;
          }
        }
        
        // Get signed URLs for images
        if (person.imageFiles && person.imageFiles.length > 0) {
          person.images = [];
          for (const filePath of person.imageFiles) {
            const signedUrl = await getSignedUrl(filePath);
            if (signedUrl) {
              person.images.push(signedUrl);
            }
          }
        }
        discoverablePersons.push(person);
      }
    }
    
    return c.json({ persons: discoverablePersons });
  } catch (error) {
    console.log('Search persons error:', error);
    return c.json({ error: 'Failed to search persons' }, 500);
  }
});

// ============== CONTACT REQUEST ENDPOINTS ==============

// Get contact requests for current user
app.get("/make-server-8db4ea83/contact-requests", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const requests = await kv.getByPrefix(`contact-request:to:${userId}:`);
    
    return c.json({ requests });
  } catch (error) {
    console.log('Get contact requests error:', error);
    return c.json({ error: 'Failed to get contact requests' }, 500);
  }
});

// Send contact request
app.post("/make-server-8db4ea83/contact-requests", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { personId, toUserId, message } = await c.req.json();
    const userProfile = await kv.get(`user:${userId}`);
    const person = await kv.get(`person:${toUserId}:${personId}`);
    
    if (!userProfile || !person) {
      return c.json({ error: 'Invalid request' }, 400);
    }
    
    // Validate contact message
    const validation = validateContactMessage(message);
    if (!validation.valid) {
      return c.json({ error: validation.error || 'Invalid contact message' }, 400);
    }
    
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const contactRequest = {
      id: requestId,
      fromUserId: userId,
      fromUserName: userProfile.name,
      fromUserEmail: userProfile.email,
      toUserId,
      personId,
      personName: person.name,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`contact-request:to:${toUserId}:${requestId}`, contactRequest);
    
    // Send email to recipient
    const toUserProfile = await kv.get(`user:${toUserId}`);
    if (toUserProfile) {
      await sendEmail({
        to: toUserProfile.email,
        subject: `New Contact Request - ${person.name}`,
        html: contactRequestEmail(contactRequest)
      });
      console.log(`Sent contact request email to ${toUserProfile.email}`);
    }
    
    return c.json({ success: true, request: contactRequest });
  } catch (error) {
    console.log('Send contact request error:', error);
    return c.json({ error: 'Failed to send contact request' }, 500);
  }
});

// Approve contact request
app.put("/make-server-8db4ea83/contact-requests/:id/approve", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const requestId = c.req.param('id');
    const request = await kv.get(`contact-request:to:${userId}:${requestId}`);
    
    if (!request) {
      return c.json({ error: 'Request not found' }, 404);
    }
    
    request.status = 'approved';
    await kv.set(`contact-request:to:${userId}:${requestId}`, request);
    
    // Send email to sender
    const fromUserProfile = await kv.get(`user:${request.fromUserId}`);
    if (fromUserProfile) {
      await sendEmail({
        to: fromUserProfile.email,
        subject: 'Contact Request Approved',
        html: requestApprovedEmail(request)
      });
      console.log(`Sent approval email to ${fromUserProfile.email}`);
    }
    
    return c.json({ success: true, request });
  } catch (error) {
    console.log('Approve request error:', error);
    return c.json({ error: 'Failed to approve request' }, 500);
  }
});

// Decline contact request
app.put("/make-server-8db4ea83/contact-requests/:id/decline", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const requestId = c.req.param('id');
    const request = await kv.get(`contact-request:to:${userId}:${requestId}`);
    
    if (!request) {
      return c.json({ error: 'Request not found' }, 404);
    }
    
    request.status = 'declined';
    await kv.set(`contact-request:to:${userId}:${requestId}`, request);
    
    // Send email to sender
    const fromUserProfile = await kv.get(`user:${request.fromUserId}`);
    if (fromUserProfile) {
      await sendEmail({
        to: fromUserProfile.email,
        subject: 'Contact Request Update',
        html: requestDeclinedEmail(request)
      });
      console.log(`Sent decline email to ${fromUserProfile.email}`);
    }
    
    return c.json({ success: true, request });
  } catch (error) {
    console.log('Decline request error:', error);
    return c.json({ error: 'Failed to decline request' }, 500);
  }
});

// ============== ADMIN ENDPOINTS ==============

// Get all users (admin only)
app.get("/make-server-8db4ea83/admin/users", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    const users = await kv.getByPrefix('user:');
    
    return c.json({ users });
  } catch (error) {
    console.log('Get users error:', error);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});

// Activate user (admin only)
app.put("/make-server-8db4ea83/admin/users/:id/activate", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    const targetUserId = c.req.param('id');
    const targetUser = await kv.get(`user:${targetUserId}`);
    
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    targetUser.isActive = true;
    await kv.set(`user:${targetUserId}`, targetUser);
    
    // Send email to user
    await sendEmail({
      to: targetUser.email,
      subject: 'Welcome to Valor Registry - Account Activated!',
      html: accountActivatedEmail(targetUser)
    });
    console.log(`Sent activation email to ${targetUser.email}`);
    
    return c.json({ success: true, user: targetUser });
  } catch (error) {
    console.log('Activate user error:', error);
    return c.json({ error: 'Failed to activate user' }, 500);
  }
});

// Deactivate user (admin only)
app.put("/make-server-8db4ea83/admin/users/:id/deactivate", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    const targetUserId = c.req.param('id');
    const targetUser = await kv.get(`user:${targetUserId}`);
    
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    targetUser.isActive = false;
    await kv.set(`user:${targetUserId}`, targetUser);
    
    return c.json({ success: true, user: targetUser });
  } catch (error) {
    console.log('Deactivate user error:', error);
    return c.json({ error: 'Failed to deactivate user' }, 500);
  }
});

// Delete user (admin only)
app.delete("/make-server-8db4ea83/admin/users/:id", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    const targetUserId = c.req.param('id');
    const targetUser = await kv.get(`user:${targetUserId}`);
    
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Delete all persons owned by this user
    const persons = await kv.getByPrefix(`person:${targetUserId}:`);
    for (const person of persons) {
      // Delete images
      if (person.imageFiles && person.imageFiles.length > 0) {
        for (const filePath of person.imageFiles) {
          await deleteImage(filePath);
        }
      }
      await kv.del(`person:${targetUserId}:${person.id}`);
    }
    
    // Delete user profile
    await kv.del(`user:${targetUserId}`);
    
    // Delete from Supabase Auth
    await supabaseAdmin.auth.admin.deleteUser(targetUserId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete user error:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get dropdown field statistics (admin only)
app.get("/make-server-8db4ea83/admin/dropdown-stats", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    // Get all persons from all users
    const allPersons = await kv.getByPrefix('person:');
    console.log(`[STATS] Analyzing ${allPersons.length} person records`);
    
    // Initialize counters for each field
    const stats: Record<string, Record<string, number>> = {
      era: {},
      branch: {},
      country: {},
      category: {},
      clasp: {}
    };
    
    // Count occurrences of each value
    for (const person of allPersons) {
      // Count person-level fields (now arrays)
      if (person.rank && Array.isArray(person.rank)) {
        for (const r of person.rank) {
          stats.rank = stats.rank || {};
          stats.rank[r] = (stats.rank[r] || 0) + 1;
        }
      }
      
      // Handle era - can be array or string (legacy data)
      if (person.era) {
        if (Array.isArray(person.era)) {
          for (const e of person.era) {
            console.log(`[STATS] Person ${person.id} has era (array): ${JSON.stringify(person.era)}`);
            stats.era[e] = (stats.era[e] || 0) + 1;
          }
        } else if (typeof person.era === 'string') {
          console.log(`[STATS] Person ${person.id} has era (string): "${person.era}"`);
          stats.era[person.era] = (stats.era[person.era] || 0) + 1;
        }
      }
      
      if (person.unit && Array.isArray(person.unit)) {
        for (const u of person.unit) {
          stats.unit = stats.unit || {};
          stats.unit[u] = (stats.unit[u] || 0) + 1;
        }
      }
      
      if (person.branch) {
        stats.branch[person.branch] = (stats.branch[person.branch] || 0) + 1;
      }
      
      // Handle country - can be array or string (legacy data)
      if (person.country) {
        if (Array.isArray(person.country)) {
          for (const c of person.country) {
            stats.country[c] = (stats.country[c] || 0) + 1;
          }
        } else if (typeof person.country === 'string') {
          stats.country[person.country] = (stats.country[person.country] || 0) + 1;
        }
      }
      
      // Count medal-level categories and clasps
      if (person.medals && Array.isArray(person.medals)) {
        for (const medal of person.medals) {
          if (medal.category) {
            stats.category[medal.category] = (stats.category[medal.category] || 0) + 1;
          }
          // Count clasps
          if (medal.clasps && Array.isArray(medal.clasps)) {
            for (const clasp of medal.clasps) {
              stats.clasp[clasp] = (stats.clasp[clasp] || 0) + 1;
            }
          }
        }
      }
    }
    
    // Convert to array format for frontend
    const dropdownData: Record<string, { value: string; usageCount: number }[]> = {};
    for (const [field, values] of Object.entries(stats)) {
      dropdownData[field] = Object.entries(values)
        .map(([value, usageCount]) => ({ value, usageCount }))
        .sort((a, b) => b.usageCount - a.usageCount); // Sort by usage count descending
    }
    
    return c.json({ dropdownData });
  } catch (error) {
    console.log('Get dropdown stats error:', error);
    return c.json({ error: 'Failed to get dropdown stats' }, 500);
  }
});

// Rename a dropdown value across all records (admin only)
app.post("/make-server-8db4ea83/admin/dropdown-rename", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    const { field, oldValue, newValue } = await c.req.json();
    
    if (!field || !oldValue || !newValue) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get all persons from all users
    const allPersons = await kv.getByPrefix('person:');
    let updatedCount = 0;
    
    // Update each person's records
    for (const person of allPersons) {
      let updated = false;
      
      // Handle person-level array fields AND legacy string values
      if (field === 'era' && person.era) {
        if (Array.isArray(person.era)) {
          const index = person.era.indexOf(oldValue);
          if (index !== -1) {
            person.era[index] = newValue;
            updated = true;
          }
        } else if (typeof person.era === 'string' && person.era === oldValue) {
          person.era = newValue;
          updated = true;
        }
      }
      
      if (field === 'country' && person.country) {
        if (Array.isArray(person.country)) {
          const index = person.country.indexOf(oldValue);
          if (index !== -1) {
            person.country[index] = newValue;
            updated = true;
          }
        } else if (typeof person.country === 'string' && person.country === oldValue) {
          person.country = newValue;
          updated = true;
        }
      }
      
      if (field === 'rank' && person.rank && Array.isArray(person.rank)) {
        const index = person.rank.indexOf(oldValue);
        if (index !== -1) {
          person.rank[index] = newValue;
          updated = true;
        }
      }
      
      if (field === 'unit' && person.unit && Array.isArray(person.unit)) {
        const index = person.unit.indexOf(oldValue);
        if (index !== -1) {
          person.unit[index] = newValue;
          updated = true;
        }
      }
      
      // Handle person-level string field
      if (field === 'branch' && person.branch === oldValue) {
        person.branch = newValue;
        updated = true;
      }
      
      // Handle medal-level fields
      if (person.medals && Array.isArray(person.medals)) {
        for (const medal of person.medals) {
          if (field === 'category' && medal.category === oldValue) {
            medal.category = newValue;
            updated = true;
          }
          
          if (field === 'clasp' && medal.clasps && Array.isArray(medal.clasps)) {
            const index = medal.clasps.indexOf(oldValue);
            if (index !== -1) {
              medal.clasps[index] = newValue;
              updated = true;
            }
          }
        }
      }
      
      // Save if updated
      if (updated) {
        await kv.set(`person:${person.ownerId}:${person.id}`, person);
        updatedCount++;
      }
    }
    
    console.log(`Renamed "${oldValue}" to "${newValue}" in field "${field}" across ${updatedCount} records`);
    return c.json({ success: true, updatedCount });
  } catch (error) {
    console.log('Rename dropdown value error:', error);
    return c.json({ error: 'Failed to rename dropdown value' }, 500);
  }
});

// Merge dropdown values (admin only)
app.post("/make-server-8db4ea83/admin/dropdown-merge", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    const { field, sourceValue, targetValue } = await c.req.json();
    
    if (!field || !sourceValue || !targetValue) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    console.log(`[MERGE] Starting merge: "${sourceValue}" → "${targetValue}" in field "${field}"`);
    
    // Get all persons from all users
    const allPersons = await kv.getByPrefix('person:');
    console.log(`[MERGE] Found ${allPersons.length} total person records to check`);
    
    let updatedCount = 0;
    let recordsWithSource = 0;
    
    // Update each person's records
    for (const person of allPersons) {
      let updated = false;
      
      // Handle person-level array fields
      if (field === 'era' && person.era) {
        if (Array.isArray(person.era)) {
          const index = person.era.indexOf(sourceValue);
          if (index !== -1) {
            recordsWithSource++;
            console.log(`[MERGE] Found "${sourceValue}" in person ${person.id} era (array at index ${index})`);
            // Replace with target value if not already present
            if (!person.era.includes(targetValue)) {
              person.era[index] = targetValue;
              console.log(`[MERGE] Replaced with "${targetValue}"`);
            } else {
              // Remove duplicate if target already exists
              person.era.splice(index, 1);
              console.log(`[MERGE] Removed duplicate (target already exists)`);
            }
            updated = true;
          }
        } else if (typeof person.era === 'string' && person.era === sourceValue) {
          recordsWithSource++;
          console.log(`[MERGE] Found "${sourceValue}" in person ${person.id} era (string)`);
          person.era = targetValue;
          updated = true;
        }
      }
      
      if (field === 'country' && person.country) {
        if (Array.isArray(person.country)) {
          const index = person.country.indexOf(sourceValue);
          if (index !== -1) {
            if (!person.country.includes(targetValue)) {
              person.country[index] = targetValue;
            } else {
              person.country.splice(index, 1);
            }
            updated = true;
          }
        } else if (typeof person.country === 'string' && person.country === sourceValue) {
          person.country = targetValue;
          updated = true;
        }
      }
      
      if (field === 'rank' && person.rank && Array.isArray(person.rank)) {
        const index = person.rank.indexOf(sourceValue);
        if (index !== -1) {
          if (!person.rank.includes(targetValue)) {
            person.rank[index] = targetValue;
          } else {
            person.rank.splice(index, 1);
          }
          updated = true;
        }
      }
      
      if (field === 'unit' && person.unit && Array.isArray(person.unit)) {
        const index = person.unit.indexOf(sourceValue);
        if (index !== -1) {
          if (!person.unit.includes(targetValue)) {
            person.unit[index] = targetValue;
          } else {
            person.unit.splice(index, 1);
          }
          updated = true;
        }
      }
      
      // Handle person-level string field
      if (field === 'branch' && person.branch === sourceValue) {
        person.branch = targetValue;
        updated = true;
      }
      
      // Handle medal-level fields
      if (person.medals && Array.isArray(person.medals)) {
        for (const medal of person.medals) {
          if (field === 'category' && medal.category === sourceValue) {
            medal.category = targetValue;
            updated = true;
          }
          
          if (field === 'clasp' && medal.clasps && Array.isArray(medal.clasps)) {
            const index = medal.clasps.indexOf(sourceValue);
            if (index !== -1) {
              if (!medal.clasps.includes(targetValue)) {
                medal.clasps[index] = targetValue;
              } else {
                medal.clasps.splice(index, 1);
              }
              updated = true;
            }
          }
        }
      }
      
      // Save if updated
      if (updated) {
        await kv.set(`person:${person.ownerId}:${person.id}`, person);
        updatedCount++;
      }
    }
    
    console.log(`Merged "${sourceValue}" into "${targetValue}" in field "${field}" across ${updatedCount} records`);
    return c.json({ success: true, updatedCount });
  } catch (error) {
    console.log('Merge dropdown value error:', error);
    return c.json({ error: 'Failed to merge dropdown value' }, 500);
  }
});

// Delete a dropdown value from all records (admin only)
app.post("/make-server-8db4ea83/admin/dropdown-delete", async (c) => {
  try {
    const userId = await verifyToken(c.req.header('Authorization'));
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const adminUser = await kv.get(`user:${userId}`);
    if (!adminUser || !adminUser.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }
    
    const { field, value } = await c.req.json();
    
    if (!field || !value) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get all persons from all users
    const allPersons = await kv.getByPrefix('person:');
    let updatedCount = 0;
    
    // Update each person's records
    for (const person of allPersons) {
      let updated = false;
      
      // Handle person-level array fields
      if (field === 'era' && person.era && Array.isArray(person.era)) {
        const index = person.era.indexOf(value);
        if (index !== -1) {
          person.era.splice(index, 1);
          updated = true;
        }
      }
      
      if (field === 'country' && person.country && Array.isArray(person.country)) {
        const index = person.country.indexOf(value);
        if (index !== -1) {
          person.country.splice(index, 1);
          updated = true;
        }
      }
      
      if (field === 'rank' && person.rank && Array.isArray(person.rank)) {
        const index = person.rank.indexOf(value);
        if (index !== -1) {
          person.rank.splice(index, 1);
          updated = true;
        }
      }
      
      if (field === 'unit' && person.unit && Array.isArray(person.unit)) {
        const index = person.unit.indexOf(value);
        if (index !== -1) {
          person.unit.splice(index, 1);
          updated = true;
        }
      }
      
      // Handle person-level string field
      if (field === 'branch' && person.branch === value) {
        person.branch = '';
        updated = true;
      }
      
      // Handle medal-level fields
      if (person.medals && Array.isArray(person.medals)) {
        for (const medal of person.medals) {
          if (field === 'category' && medal.category === value) {
            medal.category = '';
            updated = true;
          }
          
          if (field === 'clasp' && medal.clasps && Array.isArray(medal.clasps)) {
            const index = medal.clasps.indexOf(value);
            if (index !== -1) {
              medal.clasps.splice(index, 1);
              updated = true;
            }
          }
        }
      }
      
      // Save if updated
      if (updated) {
        await kv.set(`person:${person.ownerId}:${person.id}`, person);
        updatedCount++;
      }
    }
    
    console.log(`Deleted "${value}" from field "${field}" across ${updatedCount} records`);
    return c.json({ success: true, updatedCount });
  } catch (error) {
    console.log('Delete dropdown value error:', error);
    return c.json({ error: 'Failed to delete dropdown value' }, 500);
  }
});

// Helper to import createClient in Deno environment
async function createClient(url: string, key: string) {
  const { createClient: create } = await import('npm:@supabase/supabase-js@2');
  return create(url, key);
}

Deno.serve(app.fetch);