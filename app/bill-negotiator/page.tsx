"use client"                              // ← declare this page as a Client Component  [oai_citation:2‡Next.js](https://nextjs.org/docs/app/api-reference/directives/use-client?utm_source=chatgpt.com)

import { Metadata } from "next"
import BillNegotiatorClient from "@/app/components/BillNegotiatorClient"

// Optional: metadata must live in a Server Component, so remove "use client" 
// if you want to export metadata here. Otherwise omit metadata or move it server-side.
// export const metadata: Metadata = {
//   title: "Bill Negotiator Simulator",
//   description: "Practice negotiating your bill with an AI-powered customer service rep",
// }

export default function BillNegotiatorPage() {
  return <BillNegotiatorClient />
}