import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CurriculumAccordion() {
  const modules = [
    // Foundational (Modules 1-5)
    {
      title: "Foundations of Money",
      description: "Understand what money is, its functions (e.g., medium of exchange, store of value), and its evolution (e.g., barter to digital). Differentiate between earned income (e.g., wages, chores) and unearned income (e.g., gifts, allowances). Distinguish needs (e.g., food, shelter) from wants (e.g., toys, games) and grasp opportunity cost (what's sacrificed when choosing). For K-6: Learn to earn pocket money through simple tasks (e.g., chores, lemonade stands).",
    },
    {
      title: "Financial Psychology & Decision-Making",
      description: "Recognize how emotions (e.g., excitement, peer pressure) influence spending and how to avoid impulsive decisions. Set SMART financial goals (Specific, Measurable, Achievable, Relevant, Time-bound), like saving for a purchase. Understand mental shortcuts (e.g., price anchoring) and how to make rational financial choices.",
    },
    {
      title: "Payment Methods & Digital Transactions",
      description: "Know the differences between cash, checks, debit cards, credit cards, and digital wallets. Use mobile payment apps (e.g., Venmo) and peer-to-peer transfers safely. Practice basic cybersecurity (e.g., spotting phishing emails, using two-factor authentication). Protect personal financial information (e.g., not sharing PINs for K-6, understanding data breaches for 9-12).",
    },
    {
      title: "Banking & Account Management",
      description: "Differentiate between banks, credit unions, and other financial institutions. Manage checking accounts (e.g., writing checks, avoiding overdrafts) and savings accounts (e.g., earning interest). Use financial tools like budgeting apps (e.g., virtual piggy banks for K-6, Mint for 9-12).",
    },
    {
      title: "Budgeting & Expense Management",
      description: "Apply the 50/30/20 budgeting rule (needs, wants, savings) and create a simple budget. Adjust budgets for variable expenses and unexpected costs. Understand the importance of emergency funds and how to start one. Set up automatic savings or payments to build financial discipline.",
    },
    // Intermediate (Modules 6-10)
    {
      title: "Cost of Money & Inflation",
      description: "Understand simple vs. compound interest and how compounding grows savings or debt. Explain how inflation reduces purchasing power over time. Differentiate APR (Annual Percentage Rate for loans) from APY (Annual Percentage Yield for savings).",
    },
    {
      title: "Credit Fundamentals & Loans",
      description: "Define credit as borrowing and repaying money. Identify types of loans (e.g., secured vs. unsecured, auto, student) and their purposes. Calculate the total cost of a loan, including APR, fees, and interest.",
    },
    {
      title: "Credit Reports & Debt Management",
      description: "Understand credit reports, how credit scores (e.g., FICO) are calculated, and their importance. Use debt repayment strategies like the snowball (smallest debt first) or avalanche (highest interest first) methods. Avoid predatory lending (e.g., payday loans) and over-borrowing.",
    },
    {
      title: "Insurance & Risk Management",
      description: "Explain why insurance matters and how it protects against risks. Know the basics of auto, health, renters, and life insurance. Protect against identity theft and financial fraud (e.g., monitoring accounts, reporting scams).",
    },
    {
      title: "Saving, Investing & Stock-Market Basics",
      description: "Set short- and long-term savings goals with clear strategies. Understand asset classes (stocks, bonds) and their risk-return profiles. Explain how the stock market works and build a mock investment portfolio. Use the Rule of 72 to estimate investment doubling time. Know retirement (e.g., 401(k), IRA) and education (e.g., 529) savings options.",
    },
    {
      title: "Practical Investing Playbook",
      description: "Open and fund a brokerage account (IDs, bank link, first fractional share). Compare core investment choices: broad ETFs vs. individual stocks vs. themed funds. Automate contributions with dollar‑cost averaging to smooth market ups and downs. Spot and minimize hidden drags — fees, bid‑ask spreads, and basic capital‑gains taxes. Manage risk and behavior: position‑size rules, stop‑loss alerts, FOMO & bias checkpoints. Draft a starter Investing Policy Statement (goal, timeline, asset mix, automation schedule).",
    },
    {
      title: "Understanding Investment Metrics",
      description: "Learn how the P/E ratio helps you judge whether a stock is 'expensive' or priced fairly based on its earnings. Use beta to understand how volatile an investment is compared to the overall market. Apply the Sharpe ratio to evaluate whether an investment's returns are worth the risk. Explore how dividend yield can generate passive income—even if you never sell your shares. Get fluent in key stats like market cap, volume, EPS, debt-to-equity and 52-week range to better evaluate stocks at a glance.",
    },
    // Advanced / Practical Applications (Modules 11-15)
    {
      title: "Taxes & Government Influences",
      description: "Differentiate gross pay (total earnings) from net pay (after deductions). Understand basic tax filing (e.g., W-2s, 1040 forms) and how to complete a simple return. Maximize tax refunds with credits (e.g., education) and deductions.",
    },
    {
      title: "Entrepreneurship & Career Development",
      description: "Explore career paths, their income potential, and job requirements. Learn to start a small business or side hustle (e.g., planning, pricing). Write a resume and prepare for interviews using the STAR method (Situation, Task, Action, Result).",
    },
    {
      title: "Paying for Higher Education",
      description: "Understand college costs (tuition, net price) and financial aid options. Complete FAFSA/TASFA applications for federal and state aid. Evaluate student loan repayment plans and forgiveness programs. Assess the return on investment (ROI) of degrees and careers.",
    },
    {
      title: "Consumer Protection & Ethics",
      description: "Research products using price, features, and value (e.g., unit pricing). Spot misleading ads and dark patterns (e.g., hidden fees, subscription traps). Interpret financial documents (e.g., receipts, contracts, terms of service).",
    },
    {
      title: "Real-World Simulation & Capstone",
      description: "Manage a simulated monthly budget, including emergencies and trade-offs. Create and defend a comprehensive financial plan in a peer debate.",
    },
    // Advanced / Specialized (Modules 16-20 - Often Optional/Restricted)
    {
      title: "Economic Systems & Public Policy",
      description: "Explain supply and demand, market equilibrium, and price changes. Understand macroeconomic indicators (e.g., GDP, inflation, unemployment). Describe fiscal policy (government budgets, taxes) and monetary policy (central banking).",
    },
    {
      title: "Philanthropy, Ethics & Social Finance",
      description: "Budget for charitable giving and understand donor-advised funds. Explore social impact investing (e.g., ESG: Environmental, Social, Governance). Make ethical purchasing decisions (e.g., sustainable, fair-trade products).",
    },
    {
      title: "Digital & Emerging Finance",
      description: "Understand cryptocurrency (e.g., Bitcoin), stablecoins, and blockchain basics. Explore fintech innovations like neobanks, smart contracts, and advanced cybersecurity.",
    },
    {
      title: "Regulatory Environment & Consumer Rights",
      description: "Know the roles of consumer protection agencies (e.g., CFPB). Understand borrower rights under Truth-in-Lending and debt collection laws. Explain how FDIC/NCUA insurance protects bank deposits.",
    },
    {
      title: "Global Finance & Currency Exchange",
      description: "Convert currencies and interpret exchange rates. Understand international trade principles (e.g., comparative advantage). Analyze global financial crises (e.g., 2008) and preventive measures.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {modules.map((module, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-emerald-100 last:border-b-0">
          <AccordionTrigger className="text-left hover:text-emerald-600 transition-colors py-4 text-base font-medium">
            {module.title}
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-0">
            <p className="text-gray-600 text-sm">{module.description}</p>
            {/* Removed the generic 'unlocks' message for now, as it varies per module based on detailed spec */}
            {/* 
            <div className="mt-4 flex items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-600 mr-2"></div>
              <span className="text-sm text-emerald-600 font-medium">Unlocks ...</span> 
            </div>
            */}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}



