import { Metadata } from "next"
import BillNegotiatorClient from "./components/BillNegotiatorClient"

export const metadata: Metadata = {
  title: "Bill Negotiator | Banyan",
  description: "Learn negotiation skills through interactive AI simulation",
}

export default function BillNegotiatorPage() {
  return <BillNegotiatorClient />
}