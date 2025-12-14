# 📧 Email Notification Integration Guide

## Overview

This guide shows you how to add email notifications to Valor Vault using **Resend** (recommended) or other email services.

---

## Option 1: Resend (Recommended)

### Why Resend?
- ✅ 3,000 free emails/month
- ✅ Modern, developer-friendly API
- ✅ React Email templates (beautiful HTML emails)
- ✅ 5-minute setup
- ✅ Excellent documentation

### Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Sign up (free account)
3. Verify your email
4. Get your API key from dashboard

### Step 2: Add API Key to Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Environment Variables**
3. Add new variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxx` (your Resend API key)

### Step 3: Add Email Service to Backend

The app will automatically prompt you to add the API key when you try to send an email.

---

## Option 2: SendGrid

### Step 1: Sign Up for SendGrid

1. Go to https://sendgrid.com
2. Sign up (100 emails/day free forever)
3. Verify your account
4. Create API key in Settings → API Keys

### Step 2: Add API Key to Supabase

1. Supabase Dashboard → Project Settings → Edge Functions → Environment Variables
2. Add:
   - Name: `SENDGRID_API_KEY`
   - Value: `SG.xxxxxxxxxxxx`

---

## Option 3: AWS SES (Advanced)

### Best for:
- High volume (62k free emails/month on AWS)
- Cost-sensitive projects ($0.10 per 1,000 emails)
- Already using AWS

### Setup:
1. AWS Console → SES
2. Verify your domain
3. Create SMTP credentials or API access
4. Add `AWS_SES_ACCESS_KEY` and `AWS_SES_SECRET_KEY` to Supabase

---

## 📬 What Emails Will Be Sent?

### 1. New Registration → Admin
**Trigger**: User completes registration  
**To**: All admin users  
**Subject**: "New User Registration - [Name]"  
**Content**: User details + activation link

### 2. Account Activated → User
**Trigger**: Admin activates user account  
**To**: Newly activated user  
**Subject**: "Your Valor Vault Account is Active!"  
**Content**: Welcome message + login link

### 3. Contact Request → Person Owner
**Trigger**: User sends contact request  
**To**: Person owner  
**Subject**: "New Contact Request for [Person Name]"  
**Content**: Requester info + message + view link

### 4. Request Approved → Requester
**Trigger**: Owner approves contact request  
**To**: Original requester  
**Subject**: "Your Contact Request was Approved"  
**Content**: Owner email + next steps

### 5. Request Declined → Requester
**Trigger**: Owner declines contact request  
**To**: Original requester  
**Subject**: "Contact Request Update"  
**Content**: Polite decline message

---

## 🔧 Implementation Code

Once you choose an email service and add the API key, here's what happens in the backend:

### Email Sent on Registration
```typescript
// In /supabase/functions/server/index.tsx
// After creating user account:

await sendEmail({
  to: 'admin@valorvault.com',
  subject: `New User Registration - ${name}`,
  html: `
    <h2>New User Needs Approval</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Registered:</strong> ${new Date().toLocaleDateString()}</p>
    <br>
    <a href="https://your-app.com/admin">View in Admin Panel</a>
  `
});
```

### Email Sent on Activation
```typescript
// After admin activates user:

await sendEmail({
  to: userEmail,
  subject: 'Your Valor Vault Account is Active!',
  html: `
    <h2>Welcome to Valor Vault!</h2>
    <p>Your account has been activated.</p>
    <p>You can now log in and start cataloging your collection.</p>
    <br>
    <a href="https://your-app.com/login">Login Now</a>
  `
});
```

### Email Sent on Contact Request
```typescript
// When contact request is created:

await sendEmail({
  to: ownerEmail,
  subject: `New Contact Request for ${personName}`,
  html: `
    <h2>New Contact Request</h2>
    <p><strong>From:</strong> ${requesterName}</p>
    <p><strong>Regarding:</strong> ${personName}</p>
    <p><strong>Message:</strong></p>
    <blockquote>${message}</blockquote>
    <br>
    <a href="https://your-app.com/notifications">View Request</a>
  `
});
```

---

## 💰 Cost Comparison for Valor Vault

Assuming moderate usage:

### Scenario: 100 Users, 50 New Users/Month

**Emails Generated:**
- New registrations: 50 emails/month (to admin)
- Account activations: 50 emails/month (to users)
- Contact requests: ~20 emails/month
- Request responses: ~20 emails/month
- **Total: ~140 emails/month**

### Service Costs:
- **Resend**: FREE (3,000/month limit)
- **SendGrid**: FREE (100/day = 3,000/month limit)
- **AWS SES**: FREE (62,000/month on AWS)
- **Mailgun**: FREE (5,000/month for 3 months)

**Verdict**: For a prototype/MVP, all services are free!

---

## 🎨 Advanced: Beautiful HTML Emails

### Using React Email (with Resend)

Resend supports **React Email** - write emails as React components!

```tsx
// email-templates/NewUserRegistration.tsx
export default function NewUserEmail({ name, email }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>New User Registration</Heading>
          <Text>A new user has registered:</Text>
          <Section style={{ padding: '20px', background: '#f5f5f5' }}>
            <Text><strong>Name:</strong> {name}</Text>
            <Text><strong>Email:</strong> {email}</Text>
          </Section>
          <Button href="https://your-app.com/admin">
            View in Admin Panel
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

Much better than writing HTML strings!

---

## 🚀 Quick Start Recommendation

**For Valor Vault, I recommend Resend:**

1. **Sign up**: https://resend.com (2 minutes)
2. **Get API key**: Dashboard → API Keys (1 minute)
3. **Add to app**: I can implement it (10 minutes)
4. **Test**: Send yourself a test email (1 minute)

**Total setup: 15 minutes** ⏱️

---

## 🔐 Security Notes

✅ API keys stored in environment variables (never in code)  
✅ Email service handles SPF/DKIM/DMARC (prevents spam)  
✅ Rate limiting built-in (prevents abuse)  
✅ Unsubscribe links (if needed for compliance)  

---

## 📊 Email Tracking

Most services provide:
- ✅ Delivery confirmation
- ✅ Open tracking (who opened the email)
- ✅ Click tracking (which links were clicked)
- ✅ Bounce handling (invalid emails)
- ✅ Spam complaints

You can view all this in the service dashboard.

---

## ❓ FAQ

**Q: Do I need to verify my domain?**  
A: Not for testing! You can send from `onboarding@resend.dev`. For production, verify your domain (valorvault.com).

**Q: Will emails go to spam?**  
A: Email services handle all anti-spam setup. Emails are highly deliverable.

**Q: Can I customize the "from" address?**  
A: Yes! Once you verify your domain, you can use `notifications@valorvault.com` or any address.

**Q: What if I exceed the free tier?**  
A: Services will notify you. Resend is $20/month for 50k emails (very reasonable).

**Q: Can I test emails without sending real ones?**  
A: Yes! Most services have test modes, or you can send to your own email.

---

## 🎯 Next Steps

1. Choose an email service (Resend recommended)
2. Sign up and get API key
3. Let me know and I'll implement the email integration
4. Test with a registration
5. Go live!

**Estimated implementation time: 30 minutes**

---

**Want me to implement email notifications?** Just choose a service and provide the API key!
