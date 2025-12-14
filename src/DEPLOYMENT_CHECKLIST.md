# 🚀 Deployment Checklist - Valor Vault

## Pre-Deployment (Do These First!)

### 1. ✅ Add Resend API Key to Supabase
**CRITICAL - Email won't work without this!**

```
1. Go to Supabase Dashboard (https://supabase.com)
2. Select your project
3. Go to Settings (gear icon) → Edge Functions
4. Scroll to "Environment Variables"
5. Click "Add Variable"
6. Name: RESEND_API_KEY
7. Value: re_WGpCXzRU_Nsa934L6eKQfievL78LKQzKG
8. Click Save
9. Redeploy Edge Functions (button should appear)
```

**Test it:**
- Register a new user
- Check Supabase Edge Function logs
- Should see: "✅ Sent registration emails to X admin(s)"
- Check Resend dashboard for sent emails

---

### 2. ✅ Create First Admin User

**Option A: Via Supabase Dashboard**
```
1. Go to Supabase Dashboard
2. Authentication → Users
3. Find your user
4. Go to Table Editor → Open "user:[your-user-id]" in KV store
5. Set: isAdmin = true
6. Set: isActive = true
```

**Option B: Via Direct Database**
```
1. Go to SQL Editor in Supabase
2. Run query to update KV store
3. Set user flags to admin/active
```

**Test it:**
- Login with your account
- You should see "Admin" menu item
- Click Admin → should see user management

---

### 3. ✅ Test All Email Notifications

**Test each email type:**

1. **Registration Email** (to admin)
   - Register new test user
   - Admin should receive email
   - Check spam folder

2. **Account Activation** (to user)
   - Admin activates test user
   - User should receive email

3. **Contact Request**
   - Send contact request
   - Owner should receive email

4. **Request Approved**
   - Approve contact request
   - Requester should receive email

5. **Request Declined**
   - Decline contact request
   - Requester should receive email

6. **Password Reset Request**
   - Click "Forgot Password"
   - Enter email
   - Should receive reset email with link

7. **Password Reset Confirmation**
   - Complete password reset
   - Should receive confirmation email

**If emails not working:**
- Check RESEND_API_KEY is set
- Check Resend dashboard (https://resend.com/emails)
- Check Edge Function logs for errors
- Verify email addresses are valid

---

### 4. ✅ Test Security Features

**Rate Limiting:**
```
1. Try logging in with wrong password 6 times
2. 6th attempt should be blocked
3. Should see: "Too many login attempts. Please try again in X minutes"
```

**Input Validation:**
```
1. Try weak password: "password"
   → Should show: "Password must contain at least one uppercase letter"
2. Try invalid email: "notemail"
   → Should show: "Please enter a valid email address"
3. Try XSS: "<script>alert('xss')</script>" in bio
   → Should be sanitized
```

**Password Strength:**
```
1. Go to password reset
2. Try: "weak" → Should show all requirements in red
3. Try: "StrongPassword123" → Should show all requirements in green
```

---

## Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

```bash
1. Install Vercel CLI:
   npm i -g vercel

2. Login to Vercel:
   vercel login

3. Deploy:
   vercel

4. Follow prompts
5. Your app will be live at: https://your-app.vercel.app
```

**Add environment variables in Vercel:**
```
Dashboard → Settings → Environment Variables

VITE_SUPABASE_PROJECT_ID = your-project-id
(Copy from Supabase dashboard URL)
```

---

### Option 2: Deploy to Netlify

```bash
1. Install Netlify CLI:
   npm i -g netlify-cli

2. Login:
   netlify login

3. Deploy:
   netlify deploy

4. Follow prompts
5. For production:
   netlify deploy --prod
```

**Add environment variables in Netlify:**
```
Dashboard → Site settings → Environment variables

VITE_SUPABASE_PROJECT_ID = your-project-id
```

---

### Option 3: Deploy Backend to Supabase

**If you need to redeploy Edge Functions:**

```bash
# Install Supabase CLI
npm i -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy make-server-8db4ea83
```

---

## Post-Deployment Testing

### 1. ✅ Test Registration Flow
```
1. Go to your live site
2. Click "Get Started"
3. Fill registration form with strong password
4. Submit
5. Should see: "Registration successful! Pending admin approval."
6. Admin should receive email
7. Admin approves in admin panel
8. User should receive activation email
9. User logs in successfully
```

### 2. ✅ Test Password Reset
```
1. Go to login page
2. Click "Forgot Password?"
3. Enter email
4. Should see: "Check your email"
5. Check email inbox (and spam)
6. Click reset link
7. Should load password reset page
8. Enter new strong password
9. See all requirements turn green
10. Submit
11. Should see success message
12. Receive confirmation email
13. Login with new password
```

### 3. ✅ Test Person Management
```
1. Login as regular user
2. Click "Add Person"
3. Fill form with service member details
4. Upload image
5. Add medals
6. Save
7. Should see person in "My Collection"
8. Edit person → changes save
9. Delete person → person removed
```

### 4. ✅ Test Global Search
```
1. Login as user A
2. Add person with privacy enabled
3. Login as user B
4. Go to "Browse" tab
5. Should see user A's person
6. Click "Contact Owner"
7. Send message
8. User A receives email notification
9. User A goes to notifications
10. Approves request
11. User B receives approval email
```

### 5. ✅ Test Admin Features
```
1. Login as admin
2. Click "Admin" in menu
3. Should see all users
4. See pending users (isActive = false)
5. Activate a user
6. User receives activation email
7. User can now login
8. Deactivate a user
9. User cannot login
```

---

## Monitoring Setup (Optional but Recommended)

### 1. Uptime Monitoring (Free)
```
Service: UptimeRobot (https://uptimerobot.com)
Setup:
1. Create account
2. Add monitor
3. URL: https://your-app.vercel.app
4. Check interval: 5 minutes
5. Get alerts via email if site goes down
```

### 2. Error Tracking (Free tier available)
```
Service: Sentry (https://sentry.io)
Setup:
1. Create account
2. Create React project
3. Install: npm install @sentry/react
4. Add to App.tsx:
   import * as Sentry from "@sentry/react";
   Sentry.init({ dsn: "your-dsn" });
5. Errors automatically tracked
```

### 3. Analytics (Privacy-friendly, optional)
```
Service: Plausible or Simple Analytics
Cost: ~$9/month
Benefits:
- See visitor count
- Popular pages
- Traffic sources
- No cookies needed
```

---

## Common Issues & Solutions

### Issue: Emails Not Sending
**Solution:**
1. Check RESEND_API_KEY is set in Supabase
2. Redeploy Edge Functions
3. Check Resend dashboard (https://resend.com/emails)
4. Check Edge Function logs for errors
5. Verify sender email is verified in Resend

### Issue: "User profile not found"
**Solution:**
1. Check user exists in KV store with key `user:[user-id]`
2. Recreate user if needed
3. Ensure isActive = true

### Issue: Images Not Loading
**Solution:**
1. Check Supabase Storage bucket exists (`make-8db4ea83-images`)
2. Check bucket is set to private
3. Check signed URLs are being generated
4. Check image file size (max 5MB)

### Issue: Rate Limiting Too Aggressive
**Solution:**
1. Edit `/supabase/functions/server/ratelimit.tsx`
2. Increase maxRequests or windowMs
3. Redeploy Edge Functions

### Issue: Password Reset Link Doesn't Work
**Solution:**
1. Check token in URL is complete (long string)
2. Check token hasn't expired (30 minutes)
3. Check token hasn't been used already
4. Request new reset email

### Issue: Can't Access Admin Panel
**Solution:**
1. Check user has isAdmin = true in database
2. Check user is logged in
3. Check browser console for errors
4. Refresh page

---

## Security Checklist

### ✅ Before Going Live
- [ ] RESEND_API_KEY in environment variables (not hardcoded)
- [ ] Strong password for admin account
- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] CORS configured properly
- [ ] Rate limiting tested and working
- [ ] All email notifications working
- [ ] Input validation working (try XSS attacks)
- [ ] File upload validation working (try malicious files)
- [ ] Session expiration tested

### ✅ Ongoing Security
- [ ] Monitor Edge Function logs for suspicious activity
- [ ] Review failed login attempts
- [ ] Check rate limit hits
- [ ] Update dependencies regularly
- [ ] Rotate API keys every 90 days
- [ ] Review admin user list
- [ ] Check for abandoned accounts

---

## Performance Checklist

### ✅ Before Going Live
- [ ] Images optimized (under 5MB)
- [ ] Test on mobile devices
- [ ] Test on slow internet connection
- [ ] Check loading times
- [ ] No console errors
- [ ] No memory leaks

---

## Legal Checklist (If Applicable)

### ✅ If Handling EU/CA Users
- [ ] Privacy Policy page exists
- [ ] Terms of Service page exists
- [ ] Cookie consent (if using analytics)
- [ ] Data export feature (GDPR)
- [ ] Data deletion feature (GDPR)
- [ ] Contact email for privacy requests

---

## Launch Day Checklist

### Final Checks
- [ ] All environment variables set
- [ ] First admin user created
- [ ] All emails tested
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] SSL working (HTTPS)
- [ ] Domain configured (if applicable)
- [ ] Monitoring set up
- [ ] Backup plan ready
- [ ] Support email ready

### Go Live!
- [ ] Deploy to production
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test password reset
- [ ] Test admin panel
- [ ] Monitor for first hour
- [ ] Announce launch!

---

## 🎉 You're Ready!

**Valor Vault is production-ready!**

Key metrics to track:
- User registrations
- Active users
- Email deliverability
- Error rates
- Uptime percentage
- Page load times

**Need help?**
- Check Edge Function logs in Supabase
- Check browser console
- Check Resend email logs
- Review error tracking (if set up)

**Congratulations on building a production web application! 🚀🎖️**
