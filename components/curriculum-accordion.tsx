import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CurriculumAccordion() {
  const modules = [
    {
      title: "Foundations of Money",
      description: "Income, functions of money, needs vs. wants, and opportunity cost.",
    },
    {
      title: "Financial Psychology & Decision-Making",
      description: "Emotional influences, SMART goals, habit formation, and debiasing techniques.",
    },
    {
      title: "Payment Methods & Digital Transactions",
      description: "Cash, checks, debit/credit, mobile wallets, P2P apps, and digital banking security.",
    },
    {
      title: "Banking & Account Management",
      description: "Types of institutions, checking account essentials, and savings account strategies.",
    },
    {
      title: "Budgeting & Expense Management",
      description: "Budget foundations, adjustments, emergency funds, and automation.",
    },
    {
      title: "Investing & Stock Market Basics",
      description: "Asset classes, risk/return, stock market basics, and investment returns.",
    },
    {
      title: "Branding and Selling Yourself",
      description: "Personal branding, social media growth, monetization, and professional showcasing.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {modules.map((module, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-emerald-100">
          <AccordionTrigger className="text-left hover:text-emerald-600 transition-colors">
            {module.title}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600">{module.description}</p>
            <div className="mt-4 flex items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-600 mr-2"></div>
              <span className="text-sm text-emerald-600 font-medium">Unlocks real investing features</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
