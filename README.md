# Banyan Landing Page

Banyan is a financial literacy platform for teens with a spending card and investing platform controlled by parents. This landing page showcases the product's features, curriculum, and allows users to join the waitlist.

![Banyan Logo](/public/favicon.png)

## 📚 About

Banyan helps teens develop practical financial skills through interactive lessons while giving them access to a real spending card and investment platform - all under parent supervision. The curriculum covers modern financial concepts aligned with global financial literacy frameworks.

### Key Features

- **Interactive Financial Curriculum**: Educational modules covering money basics to advanced investing
- **Parent-Controlled Spending Card**: Allow teens to make purchases with parental oversight
- **Investment Platform**: Practical investing experience with parental guardrails
- **Financial Literacy Score**: Track progress through financial literacy milestones

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/banyan-landing.git
   cd banyan-landing
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the landing page.

## 🛠️ Build and Deployment

### Building for Production

To create a production build:

```bash
npm run build
# or
pnpm build
```

To start the production server:

```bash
npm run start
# or
pnpm start
```

### Deploying to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com).

#### Automatic Deployments

1. Push your code to a GitHub repository
2. Import the project in Vercel dashboard
3. Vercel will automatically detect Next.js and set up the appropriate build settings
4. Every push to the main branch will trigger a new deployment

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

## 📂 Project Structure

```
banyan-landing/
├── app/                 # Next.js app router
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── ui/              # UI components
│   └── ...              # Feature components
├── lib/                 # Utility functions
├── public/              # Static assets
└── styles/              # Additional styling
```

## 🧩 Dependencies

Note: This project uses React 19, which is newer than what many packages officially support. We use the `--legacy-peer-deps` flag during installation to handle these compatibility issues.

## 📝 Notes for Development

- Use the development server (`npm run dev`) for hot reloading during development
- The project uses Next.js App Router for page routing
- Components are organized by feature and UI primitives
- TailwindCSS is used for styling with utility classes

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
