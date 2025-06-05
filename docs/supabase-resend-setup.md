# Supabase + Resend.com Setup Guide

Complete setup instructions for switching the waitlist form from FormSubmit.co to Supabase Edge Functions + Resend.com.

## 📋 Overview

This setup will give you:
- ✅ Professional email delivery via Resend.com
- ✅ Data ownership in your Supabase database
- ✅ Better control and analytics
- ✅ Scalable architecture

---

## 1. 🗄️ Supabase Setup

### Step 1.1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Organization**: Select or create
   - **Name**: `banyan-waitlist` (or your preference)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your users
4. Wait for project creation (~2 minutes)

### Step 1.2: Get Project Credentials
1. Go to Project Settings → API
2. Copy these values (save for later):
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 1.3: Link Local Project
```bash
# In your project root
supabase link --project-ref YOUR_PROJECT_ID

# Enter your database password when prompted
```

---

## 2. 📧 Resend.com Setup

### Step 2.1: Create Account
1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your account

### Step 2.2: Get API Key
1. Go to API Keys in dashboard
2. Click "Create API Key"
3. Name: `banyan-waitlist`
4. Copy the key (starts with `re_`)

### Step 2.3: Domain Setup (Optional but Recommended)

#### Option A: Use Your Own Domain
1. Go to Domains in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `banyan.com`)
4. Add these DNS records to your domain provider:

```
Type: TXT
Name: @
Value: [provided by Resend]

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
```

5. Wait for verification (can take up to 72 hours)

#### Option B: Use Resend Domain (Quick Start)
- Use `noreply@resend.dev` as your FROM_EMAIL
- No DNS setup required
- Professional enough for testing/initial launch

---

## 3. 🔧 Environment Variables Setup

### Step 3.1: Create/Update .env.local
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role (for Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=hello@yourdomain.com
# OR for testing: FROM_EMAIL=noreply@resend.dev

# Admin Notifications
ADMIN_EMAIL=your-email@gmail.com

# Optional: App Configuration
APP_URL=https://yourdomain.com
# OR for development: APP_URL=http://localhost:3000
```

### Step 3.2: Update .env.example (for team members)
```bash
# Copy your .env.local to .env.example but remove actual keys
cp .env.local .env.example
# Then edit .env.example and replace values with placeholders
```

### Step 3.3: Update .gitignore
Make sure these are in your `.gitignore`:
```
.env.local
.env*.local
```

---

## 4. 📦 Dependencies Setup

### Step 4.1: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 4.2: Verify Installation
```bash
# Check if Supabase CLI is working
supabase --version

# Test connection
supabase status
```

---

## 5. 📁 Project Structure

After setup, your project structure should look like this:

```
banyan-landing/
├── app/
│   ├── components/
│   │   └── WaitlistForm.tsx (will be updated)
│   └── page.tsx
├── docs/
│   └── supabase-resend-setup.md (this file)
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   └── waitlist-signup/
│   │       ├── index.ts (will be created)
│   │       └── _shared/
│   │           ├── email-templates.ts (will be created)
│   │           └── validation.ts (will be created)
│   └── migrations/
│       └── 20240101_create_waitlist_table.sql (will be created)
├── .env.local
├── .env.example
└── package.json
```

---

## 6. ⚙️ Supabase Configuration

### Step 6.1: Check config.toml
Your `supabase/config.toml` should have Edge Functions enabled:

```toml
[functions]
enabled = true
```

### Step 6.2: Database Schema Setup
We'll create a migration file for the waitlist table:

```sql
-- This will be created in supabase/migrations/
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token VARCHAR(255),
  source VARCHAR(50) DEFAULT 'landing_page',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);
```

---

## 7. ✅ Verification Checklist

Before proceeding with implementation, verify:

- [ ] Supabase project created and accessible
- [ ] Project linked locally (`supabase status` works)
- [ ] Resend account created with API key
- [ ] Domain verified (or using resend.dev)
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Project structure ready

---

## 8. 🚀 Next Steps

Once setup is complete:

1. **Database Migration**: Run the waitlist table migration
2. **Edge Function**: Create the waitlist-signup function
3. **Frontend Update**: Update WaitlistForm component
4. **Testing**: Test the complete flow
5. **Deployment**: Deploy edge function to production

---

## 9. 🔍 Troubleshooting

### Common Issues:

**Supabase CLI not working:**
```bash
# Try reinstalling
brew uninstall supabase
brew install supabase/tap/supabase
```

**Environment variables not loading:**
```bash
# Restart your development server
npm run dev
```

**Resend domain not verifying:**
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- DNS changes can take up to 72 hours
- Use resend.dev domain for testing

**Database connection issues:**
- Double-check project URL and keys
- Ensure project is not paused (free tier limitation)

---

## 📞 Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)

---

*Setup completed? Ready for implementation! 🎉* 