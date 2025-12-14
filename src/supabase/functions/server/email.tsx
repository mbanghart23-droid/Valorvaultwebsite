// Email service using Resend API

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
if (!RESEND_API_KEY) {
  console.error('⚠️ RESEND_API_KEY environment variable is not set. Email notifications will not work.');
  console.error('Please add RESEND_API_KEY to Supabase Edge Functions environment variables.');
}
const FROM_EMAIL = 'Valor Vault <onboarding@resend.dev>'; // Use resend.dev domain for testing

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using Resend API
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    console.log(`Sending email to ${to}: ${subject}`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send email to ${to}:`, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`Email sent successfully to ${to}:`, result.id);
    return true;
  } catch (error) {
    console.error(`Exception while sending email to ${to}:`, error);
    return false;
  }
}

/**
 * Email template for new user registration notification to admin
 */
export function newRegistrationEmail(userProfile: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .info-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #1e3a8a; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #1e3a8a; }
        .button { display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎖️ New User Registration</h1>
        </div>
        <div class="content">
          <p>A new user has registered for Valor Vault and is awaiting account activation.</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">Name:</span> ${userProfile.name}
            </div>
            <div class="info-row">
              <span class="label">Email:</span> ${userProfile.email}
            </div>
            <div class="info-row">
              <span class="label">Registered:</span> ${new Date(userProfile.registeredAt).toLocaleString()}
            </div>
          </div>
          
          <p>Please review this registration and activate the account if appropriate.</p>
          
          <p style="text-align: center; color: #6b7280; font-size: 14px;">
            Log in to the Valor Vault admin panel to review and activate this account.
          </p>
          
          <div class="footer">
            <p>This is an automated notification from Valor Vault</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template for account activation confirmation to user
 */
export function accountActivatedEmail(userProfile: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .welcome-box { background-color: white; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎉 Welcome to Valor Vault!</h1>
        </div>
        <div class="content">
          <div class="welcome-box">
            <h2 style="color: #059669; margin-top: 0;">Your Account is Active</h2>
            <p>Hi ${userProfile.name},</p>
            <p>Great news! Your Valor Vault account has been activated by an administrator.</p>
            <p>You can now log in and start cataloging your military medal collection.</p>
          </div>
          
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Add service members to your collection</li>
            <li>Track medals for each person</li>
            <li>Upload photos and documentation</li>
            <li>Search for other collectors</li>
            <li>Connect with fellow enthusiasts</li>
          </ul>
          
          <div class="footer">
            <p>Welcome aboard!</p>
            <p>– The Valor Vault Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template for contact request notification to person owner
 */
export function contactRequestEmail(request: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #7c3aed; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .info-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #7c3aed; }
        .message-box { background-color: #f3f4f6; padding: 15px; margin: 15px 0; border-radius: 6px; font-style: italic; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #7c3aed; }
        .button { display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-right: 10px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📬 New Contact Request</h1>
        </div>
        <div class="content">
          <p>You have received a new contact request regarding a service member in your collection.</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">From:</span> ${request.fromUserName}
            </div>
            <div class="info-row">
              <span class="label">Email:</span> ${request.fromUserEmail}
            </div>
            <div class="info-row">
              <span class="label">Regarding:</span> ${request.personName}
            </div>
          </div>
          
          <p><strong>Their message:</strong></p>
          <div class="message-box">
            "${request.message}"
          </div>
          
          <p>You can approve or decline this request by logging in to Valor Vault and viewing your notifications page.</p>
          
          <div class="footer">
            <p>This is an automated notification from Valor Vault</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template for contact request approval notification to requester
 */
export function requestApprovedEmail(request: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .success-box { background-color: #d1fae5; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #059669; }
        .contact-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px solid #059669; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #059669; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✅ Contact Request Approved!</h1>
        </div>
        <div class="content">
          <div class="success-box">
            <p style="margin: 0; font-size: 18px;">
              <strong>Good news!</strong> Your contact request for <strong>${request.personName}</strong> has been approved!
            </p>
          </div>
          
          <p>The collector has shared their contact information with you. You can now reach out directly to discuss the collection.</p>
          
          <p style="text-align: center; color: #6b7280;">
            Contact information will be visible when you view this request in your Valor Vault notifications.
          </p>
          
          <p><strong>Next steps:</strong></p>
          <ul>
            <li>Log in to Valor Vault to view the collector's contact information</li>
            <li>Be respectful and professional in your communication</li>
            <li>Share information and insights about the service member</li>
          </ul>
          
          <div class="footer">
            <p>Happy connecting!</p>
            <p>– The Valor Vault Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template for contact request decline notification to requester
 */
export function requestDeclinedEmail(request: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6b7280; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .info-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #6b7280; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Contact Request Update</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <p>Your contact request regarding <strong>${request.personName}</strong> was not approved at this time.</p>
          </div>
          
          <p>Please note that collectors may decline requests for various reasons, including:</p>
          <ul>
            <li>Privacy preferences</li>
            <li>Lack of additional information to share</li>
            <li>Time constraints</li>
          </ul>
          
          <p>You can continue exploring other collections in the Valor Vault community.</p>
          
          <div class="footer">
            <p>Thank you for using Valor Vault</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get all admin users to send notifications
 */
export async function getAdminEmails(kv: any): Promise<string[]> {
  try {
    const users = await kv.getByPrefix('user:');
    const adminEmails: string[] = [];
    
    for (const user of users) {
      if (user.isAdmin && user.email) {
        adminEmails.push(user.email);
      }
    }
    
    return adminEmails;
  } catch (error) {
    console.error('Error getting admin emails:', error);
    return [];
  }
}

/**
 * Email template for password reset request
 */
export function passwordResetEmail(userName: string, resetToken: string, expiresAt: string): string {
  // In production, this would be your actual domain
  const resetUrl = `${Deno.env.get('APP_URL') || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const expiresIn = Math.round((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60));
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; background-color: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .warning-box { background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        .code-box { background-color: #f3f4f6; padding: 15px; margin: 15px 0; font-family: monospace; font-size: 18px; text-align: center; border-radius: 6px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🔒 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password for your Valor Vault account.</p>
          
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Your Password</a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <div class="code-box">
            ${resetUrl}
          </div>
          
          <div class="warning-box">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0;">
              <li>This link expires in <strong>${expiresIn} minutes</strong></li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will not change unless you click the link above</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>For security reasons, this link will only work once.</p>
            <p>– The Valor Vault Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email template for successful password reset confirmation
 */
export function passwordResetConfirmationEmail(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .success-box { background-color: #d1fae5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✅ Password Changed Successfully</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          
          <div class="success-box">
            <p style="margin: 0;">
              <strong>Your password has been successfully reset.</strong>
            </p>
          </div>
          
          <p>You can now log in to Valor Vault using your new password.</p>
          
          <p><strong>If you didn't make this change:</strong></p>
          <ul>
            <li>Your account may have been compromised</li>
            <li>Please contact support immediately</li>
            <li>Consider enabling additional security measures</li>
          </ul>
          
          <div class="footer">
            <p>This is an automated security notification from Valor Vault</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}