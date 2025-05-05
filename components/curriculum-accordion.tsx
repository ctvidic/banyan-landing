import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CurriculumAccordion() {
  const modules = [
    // Foundational (Modules 1-5)
    {
      title: "Foundations of Money",
      description: "Understanding income sources, the functions of money, differentiating needs vs. wants, and opportunity cost.",
    },
    {
      title: "Financial Psychology & Decision-Making",
      description: "Exploring emotional influences on spending, setting SMART goals, building financial habits, and avoiding common decision biases.",
    },
    {
      title: "Payment Methods & Digital Transactions",
      description: "Comparing payment types (cash, cards, digital wallets, P2P), understanding digital banking security, and protecting financial data.",
    },
    {
      title: "Banking & Account Management",
      description: "Learning about different financial institutions, managing checking and savings accounts effectively, and using basic financial tools.",
    },
    {
      title: "Budgeting & Expense Management",
      description: "Creating and adjusting budgets, building emergency funds, the 'pay yourself first' principle, automation, and budgeting tools.",
    },
    // Intermediate (Modules 6-10)
    {
      title: "Cost of Money & Inflation",
      description: "Grasping simple vs. compound interest, the impact of inflation, understanding APR vs. APY, and the role of the Federal Reserve.",
    },
    {
      title: "Credit Fundamentals & Loans",
      description: "Defining credit, exploring different loan types and terms (like BNPL), and understanding APR, fees, and total loan cost.",
    },
    {
      title: "Credit Reports & Debt Management",
      description: "Understanding credit reports and scores (FICO factors), learning debt repayment strategies, and recognizing predatory lending.",
    },
    {
      title: "Insurance & Risk Management",
      description: "Basics of insurance, overview of key insurance types (auto, health, life, renters), and protecting against identity theft and fraud.",
    },
    {
      title: "Saving, Investing & Stock Market Basics",
      description: "Setting saving goals, understanding asset classes (stocks, bonds, ETFs), risk/return, market basics, virtual trading, and retirement/education accounts.",
    },
    // Advanced / Practical Applications (Modules 11-15)
    {
      title: "Taxes & Government Influences",
      description: "Understanding gross vs. net pay, tax withholdings, basic filing forms (W-2, 1040), and tax credits/deductions.",
    },
    {
      title: "Entrepreneurship & Career Development",
      description: "Exploring income potential of jobs vs. careers, entrepreneurship basics, resume building, interview skills (STAR method), and negotiation.",
    },
    {
      title: "Paying for Higher Education",
      description: "Analyzing college costs, understanding FAFSA/TASFA and aid types, loan repayment options, and evaluating education ROI.",
    },
    {
      title: "Consumer Protection & Ethics",
      description: "Developing consumer research skills, recognizing advertising manipulation, understanding financial documents, and comparison shopping.",
    },
    {
      title: "Real-World Simulation & Capstone",
      description: "Applying learned skills in a 'life-in-a-month' budget simulation and developing an integrated personal financial plan.",
    },
     // Advanced / Specialized (Modules 16-20 - Often Optional/Restricted)
    {
      title: "Economic Systems & Public Policy",
      description: "Basics of supply/demand, macroeconomic goals, fiscal and monetary policy, and international trade concepts.",
    },
    {
      title: "Philanthropy, Ethics & Social Finance",
      description: "Budgeting for charitable giving, introduction to social impact investing (ESG), ethical consumerism, and financial inclusion.",
    },
    {
      title: "Digital & Emerging Finance",
      description: "Fundamentals of cryptocurrency and blockchain, stablecoins/CBDCs, fintech innovations (neobanks), DeFi concepts, and advanced cybersecurity.",
    },
    {
      title: "Regulatory Environment & Consumer Rights",
      description: "Understanding consumer protection agencies (CFPB), key regulations (Truth-in-Lending), deposit insurance (FDIC), and fraud reporting.",
    },
    {
      title: "Global Finance & Currency Exchange",
      description: "Basics of foreign currencies, exchange rates, comparative advantage, global financial crises, and cross-border payments.",
    },
    // Added Module
    {
      title: "Branding and Selling Yourself",
      description: "Discovering your personal brand, growing on social media (TikTok/YouTube), monetization strategies (sponsorships, affiliates, digital goods), and professional showcasing (portfolio, resume, interviews).",
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

