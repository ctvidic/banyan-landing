# Email Deliverability Guide for Banyan Waitlist

## Why Your Emails Go to Promotions

Gmail and other providers categorize emails based on:
- Content (promotional language, money mentions, CTAs)
- Technical factors (authentication, reputation)
- User engagement (open rates, replies)

## Completed Improvements ✅

1. **Updated Email Content**
   - Removed promotional language ("earn $40/month")
   - Removed emojis from subject lines
   - Simplified design (no gradient backgrounds)
   - Personal tone from founder
   - Clear unsubscribe option

2. **Added Email Headers**
   - Proper "From" name formatting
   - Reply-to address
   - List-Unsubscribe header
   - Unique message IDs

## Required DNS Configuration 🔧

### 1. Set up SPF Record
Add this TXT record to your domain's DNS:
```
v=spf1 include:amazonses.com include:_spf.resend.com ~all
```

### 2. Configure DKIM
In your Resend dashboard:
1. Go to Domains section
2. Add your sending domain
3. Copy the DKIM records they provide
4. Add them to your DNS

### 3. Set up DMARC
Add this TXT record:
```
_dmarc.yourdomain.com
v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

### 4. Verify in Resend
1. Log into Resend dashboard
2. Go to Domains
3. Verify all records are green

## Additional Best Practices

### 1. Warm Up Your Domain
- Start by sending to engaged users
- Gradually increase volume
- Monitor bounce rates

### 2. Encourage Engagement
- Ask users to reply to the welcome email
- Request they add your email to contacts
- Include this in your form success message

### 3. Monitor Performance
Track these metrics in Resend:
- Open rates (aim for >20%)
- Bounce rates (keep <2%)
- Spam complaints (keep <0.1%)

### 4. Test Deliverability
Use these tools to test:
- [Mail Tester](https://www.mail-tester.com/)
- [GlockApps](https://glockapps.com/)
- Send test emails to gmail.com addresses

## Quick Implementation Checklist

- [ ] Deploy the updated email templates
- [ ] Add your domain to Resend
- [ ] Configure SPF, DKIM, DMARC records
- [ ] Wait for DNS propagation (2-24 hours)
- [ ] Verify domain in Resend
- [ ] Send test emails
- [ ] Update success message to ask users to check primary inbox
- [ ] Monitor initial sends closely

## Update Your Success Message

Consider updating your form success message to help with engagement:

```javascript
"Thanks for joining! 📧 Check your primary inbox for a welcome email from Tom. If you don't see it, check your Promotions tab and drag it to Primary."
```

## Questions?

Email deliverability improves over time as your domain builds reputation. The changes we've made should significantly help emails reach the primary inbox, but DNS configuration is crucial for the best results. 