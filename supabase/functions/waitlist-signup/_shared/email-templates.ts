// Welcome email template for new signups (HTML formatted)
// Email is much nicer now
export function getWelcomeEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Banyan!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="padding: 20px 0; text-align: left; margin-bottom: 20px;">
    <h1 style="color: #10b981; margin: 0; font-size: 24px; font-weight: normal;">Thanks for joining Banyan!</h1>
  </div>
  
  <div style="margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hi there,</p>
    
    <p style="margin-bottom: 15px;">Thank you for your interest in Banyan. We're working hard to create a unique platform where teenagers can develop real financial literacy skills through hands-on learning.</p>
    
    <p style="margin-bottom: 15px;">As an early supporter, you'll be the first to know when we launch. We're currently in development and expect to have something ready to share in the coming months.</p>
    
    <p style="margin-bottom: 15px;">What makes Banyan different:</p>
    
    <ul style="margin-bottom: 20px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Practical financial education designed specifically for teens</li>
      <li style="margin-bottom: 8px;">Interactive learning experiences that make complex topics accessible</li>
      <li style="margin-bottom: 8px;">A safe environment to practice real-world money management</li>
    </ul>
    
    <p style="margin-bottom: 15px;">If you have any questions or feedback, please don't hesitate to reply to this email. We'd love to hear from you.</p>
  </div>
  
  <p style="margin-bottom: 20px;">Best regards,<br>
  The Banyan Team</p>
  
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
  
  <div style="color: #666; font-size: 14px;">
    <p style="margin: 0;">Banyan Financial Education</p>
    <p style="margin: 5px 0; font-size: 12px; color: #999;">You're receiving this because you signed up for our waitlist.</p>
  </div>
</body>
</html>
`.trim()
}

// Welcome email template for plain text version
export function getWelcomeEmailText(): string {
  return `
Hi there,

Thank you for your interest in Banyan. We're working hard to create a unique platform where teenagers can develop real financial literacy skills through hands-on learning.

As an early supporter, you'll be the first to know when we launch. We're currently in development and expect to have something ready to share in the coming months.

What makes Banyan different:
- Practical financial education designed specifically for teens
- Interactive learning experiences that make complex topics accessible
- A safe environment to practice real-world money management

If you have any questions or feedback, please don't hesitate to reply to this email. We'd love to hear from you.

Best regards,
The Banyan Team

---
Banyan Financial Education
You're receiving this because you signed up for our waitlist.
`.trim()
}

// Admin notification template when someone signs up
export function getAdminNotificationHtml(email: string): string {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Waitlist Signup</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="padding: 20px 0; text-align: left; margin-bottom: 20px;">
    <h1 style="color: #10b981; margin: 0; font-size: 20px; font-weight: normal;">🎉 New Banyan Waitlist Signup!</h1>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
    <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${timestamp}</p>
    <p style="margin: 0;"><strong>Source:</strong> Landing Page</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
  
  <div style="color: #666; font-size: 14px;">
    <p style="margin: 0;">View all signups in your <a href="https://zmkodllxauzgwaebwmtj.supabase.co/project/zmkodllxauzgwaebwmtj" style="color: #10b981;">Supabase dashboard</a>.</p>
  </div>
</body>
</html>
`.trim()
}

// Admin notification template (plain text version)
export function getAdminNotificationText(email: string): string {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  
  return `
🎉 New Banyan Waitlist Signup!

Email: ${email}
Time: ${timestamp}
Source: Landing Page

---
View all signups in your Supabase dashboard:
https://zmkodllxauzgwaebwmtj.supabase.co/project/zmkodllxauzgwaebwmtj
`.trim()
}

// Get formatted timestamp
export function getFormattedTimestamp(): string {
  return new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
} 