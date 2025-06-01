"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Simple email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError("")
    if (submitError) setSubmitError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setEmailError("")
    setSubmitError("")

    // Validate email
    if (!email) {
      setEmailError("Email is required")
      return
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Get Supabase URL from environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      // Log environment variables (partially masked for security)
      console.log("Debug - Environment check:", {
        supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "NOT SET",
        supabaseAnonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : "NOT SET",
        origin: window.location.origin
      })
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Configuration error: Missing environment variables")
      }

      const requestUrl = `${supabaseUrl}/functions/v1/waitlist-signup`
      const requestBody = { email: email.toLowerCase().trim() }
      
      // Log request details
      console.log("Debug - Request details:", {
        url: requestUrl,
        method: 'POST',
        body: requestBody,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey.substring(0, 10)}...`,
        }
      })

      // Call the Edge Function
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey, // Add this header as well
        },
        body: JSON.stringify(requestBody),
      })

      // Log response details
      console.log("Debug - Response details:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      })

      const data = await response.json()
      console.log("Debug - Response data:", data)

      if (response.ok && data.success) {
        // Success! Show success message
        setShowSuccess(true)
        setEmail("") // Clear the form
      } else {
        // Handle API errors with more detail
        if (response.status === 401) {
          console.error("401 Unauthorized - Check Supabase configuration")
          setSubmitError("Authentication error. Please try again later.")
        } else if (response.status === 403) {
          console.error("403 Forbidden - CORS or permissions issue")
          setSubmitError("Permission error. Please try again later.")
        } else {
          setSubmitError(data.error || `Error: ${response.status} - ${response.statusText}`)
        }
      }
    } catch (error) {
      // Handle network errors
      console.error("Submission error:", error)
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack
        })
      }
      setSubmitError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success message if user just signed up
  if (showSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 space-y-6 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">You're on the waitlist! 🎉</h3>
            <div className="h-px bg-white/20 mx-8"></div>
            <p className="text-lg text-white/90">
              Thank you for joining! We'll notify you as soon as Banyan is ready.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Check your email for a welcome message.
            </p>
            <Button 
              onClick={() => setShowSuccess(false)}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-emerald-600"
            >
              Join Another Email
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
          <div className="flex-grow">
            <Input 
              placeholder="Enter your email address" 
              value={email}
              onChange={handleEmailChange}
              type="email"
              disabled={isSubmitting}
              className="h-11 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
              required
            />
            {emailError && (
              <p className="text-sm text-red-300 mt-1">{emailError}</p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={!email || isSubmitting}
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full sm:shrink-0 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </div>
        
        {submitError && (
          <p className="text-sm text-red-300 mt-2 text-center">{submitError}</p>
        )}
      </form>
      
      <p className="text-sm mt-4 text-white/70 text-center">
        We'll notify you as soon as Banyan is ready!
      </p>
    </div>
  )
} 