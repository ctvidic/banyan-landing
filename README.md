# Banyan Landing Page

A modern landing page for Banyan Financial Education built with Next.js 15 and React 19.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd banyan-landing
```

2. Install dependencies (using legacy peer deps due to React 19):
```bash
npm install --legacy-peer-deps
# or
yarn install --legacy-peer-deps
# or
pnpm install --legacy-peer-deps
```

3. Create a `.env.local` file in the root directory with the required environment variables (see Environment Variables section below).

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# OpenAI API Configuration (required for bill negotiator feature)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (required for database operations)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Security Configuration
API_SECRET=your_random_secret_for_request_signing_at_least_32_chars
```

### Optional Variables

```bash
# CORS Configuration (defaults to localhost:3000)
ALLOWED_ORIGIN=https://yourdomain.com

# Feature Flags
NEXT_PUBLIC_ENABLE_BILL_NEGOTIATOR=false  # Set to 'true' to enable bill negotiator feature

# Production Domain (for enhanced CORS validation)
PRODUCTION_DOMAIN=yourdomain.com
```

### Security Notes

- **API_SECRET**: Generate a random string of at least 32 characters for request signing
- **OPENAI_API_KEY**: Keep this secret and never commit it to version control
- **SUPABASE_ANON_KEY**: This is safe to expose to clients (it's prefixed with NEXT_PUBLIC_)

## 🔒 Security Features

The application includes comprehensive security measures:

### API Protection
- **Request Origin Validation**: All API routes validate request origins
- **Enhanced Rate Limiting**: Different limits for different operations:
  - OpenAI Chat: 100 requests per hour
  - OpenAI Realtime: 50 sessions per day  
  - Bill Negotiator: 200 requests per hour
  - General APIs: 10 requests per minute

### Input Validation
- **Zod Schema Validation**: All inputs are validated against strict schemas
- **Content Sanitization**: XSS protection through input sanitization
- **Email Validation**: Proper email format validation
- **Data Length Limits**: Prevents oversized payloads

### Cost Controls
- **Session Duration Limits**: Voice calls limited to 5 minutes
- **Message Limits**: Maximum 50 messages per conversation
- **Idle Timeouts**: Automatic disconnection after 60 seconds of inactivity
- **Request Timeouts**: API requests timeout after 10 seconds

### Headers & CORS
- **Security Headers**: CSP, XSS protection, frame options
- **CORS Configuration**: Strict origin validation
- **Rate Limit Headers**: Transparent rate limiting information

## 🏗️ Architecture

### API Security Flow
1. **Middleware**: Validates origins, applies rate limiting, sets security headers
2. **Route Handlers**: Validate inputs, sanitize data, check authentication
3. **Database**: Row-level security with Supabase RLS policies

### Voice Negotiation Security
- **Session Limits**: Per-IP daily and hourly limits
- **WebRTC Validation**: Secure connection establishment
- **Auto-disconnect**: Multiple safety mechanisms prevent runaway costs

## 🌍 Deployment

### Vercel (Recommended)

1. Connect your repository to [Vercel](https://vercel.com)
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Manual Deployment

You can also deploy manually using the Vercel CLI:

```bash
npm install -g vercel
vercel login
vercel
```

For production deployment:

```bash
vercel --prod
```

## 🧰 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **React Version**: React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [Radix UI](https://radix-ui.com/) primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Database**: [Supabase](https://supabase.com/)
- **AI/Voice**: [OpenAI API](https://openai.com/api/)

## 📂 Project Structure

```
banyan-landing/
├── app/                 # Next.js app router
│   ├── api/             # API routes with security
│   ├── bill-negotiator/ # Voice negotiation feature
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── ui/              # UI components
│   └── ...              # Feature components
├── lib/                 # Utility functions
│   ├── security.ts      # Security utilities
│   └── ...              # Other utilities
├── public/              # Static assets
├── supabase/            # Database migrations
└── middleware.ts        # Security middleware
```

## 🧩 Dependencies

Note: This project uses React 19, which is newer than what many packages officially support. We use the `--legacy-peer-deps` flag during installation to handle these compatibility issues.

## 🔧 Bill Negotiator Feature

The voice negotiation feature includes:

- **AI-Powered Conversations**: Real-time voice interaction with OpenAI
- **Progressive Difficulty**: Escalation from frontline to supervisor agents
- **Skill Assessment**: Automated scoring and feedback
- **Leaderboards**: Anonymous competition with other users
- **Cost Controls**: Comprehensive limits to prevent API abuse

### Security Considerations

- Sessions are limited and tracked per IP
- All conversations are anonymized
- No personal data is stored without explicit consent
- Automatic disconnection prevents runaway costs

## 📝 Notes for Development

- Use the development server (`npm run dev`) for hot reloading during development
- The project uses Next.js App Router for page routing
- Components are organized by feature and UI primitives
- TailwindCSS is used for styling with utility classes
- All API routes include comprehensive security validation

## 🛡️ Security Best Practices

When deploying to production:

1. **Rotate API Keys**: Regularly rotate your OpenAI API key
2. **Monitor Usage**: Set up billing alerts in OpenAI dashboard
3. **Review Logs**: Monitor API access logs for suspicious activity
4. **Update Dependencies**: Keep all packages up to date
5. **Environment Variables**: Never commit secrets to version control

## 📄 License

[Add your license information here]

## 👥 Contributing

[Add contribution guidelines if applicable]

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI API Key (required for bill negotiator feature)
OPENAI_API_KEY=your_openai_api_key_here

# Feature Flags
NEXT_PUBLIC_ENABLE_BILL_NEGOTIATOR=false  # Set to 'true' to enable bill negotiator feature
```

### Feature Flags

- **NEXT_PUBLIC_ENABLE_BILL_NEGOTIATOR**: Controls visibility of the bill negotiator feature
  - `false` (default): Bill negotiator link is hidden
  - `true`: Bill negotiator link appears in navigation

## Landing Page Routes
