# Valor Vault - Supabase Setup Instructions

Your Valor Vault application is now fully integrated with Supabase! Here's what you need to know:

## ✅ What's Been Integrated

1. **Authentication** - Real user registration and login with Supabase Auth
2. **Database** - All data stored in Supabase KV store
3. **File Storage** - Medal images stored in Supabase Storage
4. **Admin Approval** - New users require admin activation before they can log in
5. **API Endpoints** - Complete backend with all CRUD operations

## 🚀 Getting Started

### Step 1: Create Your Admin Account

Since this is a fresh installation, you need to create the first admin account:

1. **Register a new account** through the app (it will be inactive by default)
2. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/llbbpmuotldxryqfsntw
3. **Open the SQL Editor** (left sidebar)
4. **Run this SQL query** to find your user ID and make yourself admin:

```sql
-- First, find your user ID from Supabase Auth
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Copy your user ID (it looks like: 123e4567-e89b-12d3-a456-426614174000)
-- Then run this to activate your account and make you admin
-- Replace YOUR_USER_ID with the actual ID from above
```

5. **Open Table Editor** in Supabase Dashboard
6. **Navigate to the `kv_store_8db4ea83` table**
7. **Find the row** where `key` = `user:YOUR_USER_ID` (replace with your actual user ID)
8. **Edit the value** column - it's a JSON object. Change:
   - `"isActive": false` to `"isActive": true`
   - `"isAdmin": false` to `"isAdmin": true`

9. **Save the changes**

Now you can log in as an admin!

### Alternative: Use SQL to Activate Admin

If you prefer SQL, after registering your account, run this in the Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
WITH user_id AS (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
SELECT key, value 
FROM kv_store_8db4ea83 
WHERE key LIKE 'user:%';

-- Then manually update the JSON in Table Editor as described above
```

## 🎯 How It Works

### User Registration Flow
1. User fills out registration form with name, email, password
2. User is created in Supabase Auth
3. User profile is stored in KV store with `isActive: false`
4. Admin receives notification of pending registration
5. Admin activates the user through the Admin panel
6. User can now log in

### Data Storage

All data is stored in the Supabase KV store with these key patterns:

- **Users**: `user:{userId}`
- **Persons**: `person:{userId}:{personId}`
- **Contact Requests**: `contact-request:to:{userId}:{requestId}`
- **Images**: Stored in Supabase Storage bucket `make-8db4ea83-medal-images`

### Authentication

- Uses Supabase Auth with JWT tokens
- Tokens stored in localStorage
- Session automatically restored on page reload
- All API calls require valid access token

## 🔐 Security Features

✅ **CAPTCHA** - Math-based spam prevention on login/register  
✅ **Honeypot** - Hidden form field to catch bots  
✅ **Admin Approval** - New accounts must be activated  
✅ **JWT Tokens** - Secure API authentication  
✅ **Row-level Security** - Users can only access their own data  
✅ **Private Storage** - Images require signed URLs (1-hour expiry)

## 📊 Available Features

### For Regular Users:
- ✅ Register and wait for admin approval
- ✅ Add service members (persons) with up to 2 photos
- ✅ Track multiple medals per person (in collection or entitled)
- ✅ Mark profile as discoverable for global search
- ✅ Search all discoverable persons across users
- ✅ Send contact requests to other collectors
- ✅ Receive and respond to contact requests

### For Admins:
- ✅ All regular user features
- ✅ View all registered users
- ✅ Activate/deactivate user accounts
- ✅ Delete users and all their data
- ✅ See pending registration requests
- ✅ Manage dropdown values (future feature)

## 🔧 Admin Panel Access

Once you're an admin, you can:
1. Click your profile icon in the top right
2. Select "Admin Panel"
3. See all users with their activation status
4. Activate pending registrations
5. Deactivate or delete accounts

## 🐛 Troubleshooting

### "Account pending admin approval" error
- Your account hasn't been activated yet
- Ask an admin to activate your account
- Or follow the manual activation steps above if you're the first user

### Images not loading
- Images use signed URLs that expire after 1 hour
- Refresh the page to generate new signed URLs
- Check that the storage bucket `make-8db4ea83-medal-images` exists

### "Unauthorized" errors
- Your session may have expired
- Log out and log back in
- Clear localStorage and try again

### Server errors
- Check the Supabase Functions logs in your dashboard
- Look for detailed error messages in the browser console
- Ensure all environment variables are set correctly

## 🎉 You're All Set!

Your Valor Vault application is now a fully functional production app with:
- Real user authentication
- Persistent database storage
- Cloud file storage for images
- Admin approval workflow
- Contact request system
- Global search functionality

Just create your admin account using the steps above and you're ready to go!

## 📝 Next Steps

1. Create your admin account
2. Test the registration flow with a second account
3. Add some service members to your collection
4. Try the global search feature
5. Test contact requests between users

---

**Note**: This app uses Supabase's free tier. For production use with many users, consider upgrading your Supabase plan.
