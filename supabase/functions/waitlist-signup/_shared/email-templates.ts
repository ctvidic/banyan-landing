// Welcome email template for new signups (casual tone, plain text formatted nicely)
export function getWelcomeEmailHtml(): string {
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