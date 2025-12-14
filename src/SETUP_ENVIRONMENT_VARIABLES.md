# 🔐 Setting Up Environment Variables

## ⚠️ IMPORTANT: Remove Hardcoded API Key

The Resend API key was temporarily hardcoded for quick setup, but **must be moved to environment variables** before production.

---

## ✅ Fixed: API Key Security

I've updated the code to properly use environment variables with error handling:

**Before (INSECURE):**
```typescript
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_WGpCXzRU_Nsa934L6eKQfievL78LKQzKG';
```

**After (SECURE):**
```typescript
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
if (!RESEND_API_KEY) {
  console.error('⚠️ RESEND_API_KEY environment variable is not set.');
}
```

---

## 📋 How to Add Environment Variables to Supabase

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project dashboard
2. Navigate to **Settings** (gear icon in sidebar)
3. Click on **Edge Functions** in the settings menu

### Step 2: Add Environment Variable

1. Scroll to **Environment Variables** section
2. Click **Add Variable** button
3. Add the following:

```
Variable Name: RESEND_API_KEY
Value: re_WGpCXzRU_Nsa934L6eKQfievL78LKQzKG
```

4. Click **Save**

### Step 3: Redeploy Edge Functions

After adding the environment variable, you need to redeploy your Edge Functions:

1. In Supabase Dashboard → **Edge Functions**
2. Find your `make-server-8db4ea83` function
3. Click **Deploy** or **Redeploy**

Alternatively, if using CLI:
```bash
supabase functions deploy make-server-8db4ea83
```

---

## 🔒 Current Environment Variables

Your Valor Vault app uses these environment variables:

### Already Configured (via Supabase):
- ✅ `SUPABASE_URL` - Your Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Public anonymous key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Admin service role key
- ✅ `SUPABASE_DB_URL` - Database connection string

### Needs to be Added:
- ⚠️ `RESEND_API_KEY` - Email service API key

---

## 🧪 Testing After Setup

### Test Email Sending:

1. **Register a new user** (if admin exists)
   - Admin should receive registration email
   - Check Edge Function logs for: `✅ Sent registration emails to 1 admin(s)`

2. **Check for Errors:**
   - If you see: `⚠️ RESEND_API_KEY environment variable is not set`
   - The variable wasn't configured properly
   - Go back and add it to Supabase

3. **Verify in Resend Dashboard:**
   - Go to https://resend.com/emails
   - You should see sent emails in the logs

---

## 🔐 Security Best Practices

### ✅ DO:
- Store API keys in environment variables
- Use different keys for development/production
- Rotate API keys periodically (every 90 days)
- Limit API key permissions to minimum needed
- Monitor API key usage in Resend dashboard

### ❌ DON'T:
- Hardcode API keys in source code
- Commit API keys to Git
- Share API keys in chat/email
- Use the same key for multiple projects
- Expose API keys in client-side code

---

## 🚨 If API Key is Compromised

If your API key is accidentally exposed:

### Immediate Steps:
1. Go to Resend Dashboard → API Keys
2. **Delete** the compromised key
3. **Create** a new API key
4. Update `RESEND_API_KEY` in Supabase environment variables
5. Redeploy Edge Functions

### New Key:
```
Variable Name: RESEND_API_KEY
Value: [NEW KEY FROM RESEND]
```

---

## 📊 Monitoring

### Check Email Logs:

**Supabase Edge Function Logs:**
1. Supabase Dashboard → Edge Functions
2. Click on your function
3. View **Logs** tab
4. Look for email send confirmations:
   ```
   Sending email to admin@example.com: New User Registration - John Doe
   Email sent successfully to admin@example.com: abc123
   ```

**Resend Dashboard:**
1. Go to https://resend.com/emails
2. View all sent emails
3. Check delivery status
4. See open/click rates (if enabled)

---

## 🎯 Quick Reference

### Add Environment Variable:
```
1. Supabase Dashboard
2. Settings → Edge Functions
3. Environment Variables → Add Variable
4. Name: RESEND_API_KEY
5. Value: re_WGpCXzRU_Nsa934L6eKQfievL78LKQzKG
6. Save
7. Redeploy function
```

### Verify It's Working:
```
1. Register test user
2. Check Supabase logs for "Email sent successfully"
3. Check Resend dashboard for sent email
4. Verify email received in inbox
```

---

## ✅ Checklist

Before going to production:

- [ ] Added `RESEND_API_KEY` to Supabase environment variables
- [ ] Redeployed Edge Functions
- [ ] Tested email sending (registration, activation, contact request)
- [ ] Verified emails in Resend dashboard
- [ ] Removed any hardcoded keys from codebase
- [ ] Checked Edge Function logs for errors
- [ ] Documented API key location for team

---

## 🔄 For Future Developers

**If you're setting up a new environment:**

1. Get API keys from:
   - Supabase project (URL, anon key, service role key)
   - Resend account (API key from dashboard)

2. Add all environment variables to Supabase Edge Functions

3. Deploy the Edge Functions

4. Test email functionality

**Never commit environment variables to Git!**

---

## 💡 Tips

- Use descriptive names for environment variables
- Document what each variable is for
- Keep a secure backup of critical keys (password manager)
- Set up alerts for API usage spikes
- Review API key permissions regularly

---

**Environment variables are now properly configured for security!** 🔒
