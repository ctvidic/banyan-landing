/**
 * @fileoverview Debug component to check environment variables in production
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DebugEnvVars() {
  const [showDebug, setShowDebug] = useState(false)
  const [testResult, setTestResult] = useState<string>("")

  const checkEnvVars = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log("Environment Variables Debug:", {
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "NOT SET",
      supabaseKey: supabaseKey ? `${supabaseKey.substring(0, 10)}...` : "NOT SET",
      origin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
    })
    
    setShowDebug(true)
  }

  const testApiCall = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      setTestResult("❌ Environment variables not set")
      return
    }
    
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/waitlist-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ email: 'debug-test@example.com' }),
      })
      
      const data = await response.json()
      setTestResult(`${response.ok ? '✅' : '❌'} ${response.status}: ${JSON.stringify(data)}`)
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md">
      <Button onClick={checkEnvVars} size="sm" className="mb-2">
        Debug Env Vars
      </Button>
      
      {showDebug && (
        <div className="space-y-2">
          <div>
            <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` : "NOT SET"}
          </div>
          <div>
            <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` : "NOT SET"}
          </div>
          <div>
            <strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
          </div>
          
          <Button onClick={testApiCall} size="sm" className="w-full">
            Test API Call
          </Button>
          
          {testResult && (
            <div className="mt-2 p-2 bg-gray-800 rounded text-xs break-all">
              {testResult}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
