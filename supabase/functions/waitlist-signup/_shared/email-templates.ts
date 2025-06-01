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
  <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Banyan! 🌱</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
    <p style="font-size: 18px; margin-bottom: 15px;"><strong>Hey there! 👋</strong></p>
    
    <p style="margin-bottom: 15px;">Welcome to the Banyan waitlist! We're thrilled to have you join us on this journey to revolutionize how teens learn about money.</p>
    
    <h3 style="color: #10b981; margin-bottom: 15px;">Here's what happens next:</h3>
    
    <div style="margin-bottom: 20px;">
      <p style="margin-bottom: 10px;"><strong>🌱 We're building something special</strong><br>
      A platform where teens actually EARN while they learn about finance</p>
      
      <p style="margin-bottom: 10px;"><strong>💰 Your teen could earn up to $40/month</strong><br>
      Just by mastering money skills</p>
      
      <p style="margin-bottom: 10px;"><strong>📚 Real-world finance education</strong><br>
      That actually sticks</p>
    </div>
  </div>
  
  <p style="margin-bottom: 20px;">We'll keep you in the loop as we get closer to launch. In the meantime, feel free to reply to this email if you have any questions!</p>
  
  <p style="margin-bottom: 20px;"><strong>Thanks for believing in what we're building,<br>
  The Banyan Team</strong></p>
  
  <div style="background: #e5f7f0; padding: 15px; border-radius: 5px; margin-top: 25px;">
    <p style="margin: 0; font-size: 14px;"><strong>P.S.</strong> Got friends who'd love this? Feel free to share - the more the merrier! 🎉</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  
  <div style="text-align: center; color: #666; font-size: 12px;">
    <p style="margin: 0;">© Banyan Financial Education</p>
    <p style="margin: 0;">Teaching money skills that matter</p>
  </div>
</body>
</html>
`.trim()
}

// Welcome email template for plain text version
export function getWelcomeEmailText(): string {
  return `
Hey there! 👋

Welcome to the Banyan waitlist! We're thrilled to have you join us on this journey to revolutionize how teens learn about money.

Here's what happens next:

🌱 We're building something special - a platform where teens actually EARN while they learn about finance
💰 Your teen could earn up to $40/month just by mastering money skills  
📚 Real-world finance education that actually sticks

We'll keep you in the loop as we get closer to launch. In the meantime, feel free to reply to this email if you have any questions!

Thanks for believing in what we're building,
The Banyan Team

P.S. Got friends who'd love this? Feel free to share - the more the merrier! 🎉

---
© Banyan Financial Education
Teaching money skills that matter
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
🎉 New Waitlist Signup!

Email: ${email}
Time: ${timestamp}
Source: Landing Page

---
Total signups can be viewed in your Supabase dashboard.
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