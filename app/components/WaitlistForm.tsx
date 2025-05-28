"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  // Check if user returned from successful FormSubmit submission
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('success') === 'true') {
        setShowSuccess(true)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // Simple email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (!email) {
      e.preventDefault()
      setEmailError("Email is required")
      return
    }
    
    if (!validateEmail(email)) {
      e.preventDefault()
      setEmailError("Please enter a valid email address")
      return
    }
    
    // If validation passes, the form will submit naturally to FormSubmit
  }

  // Show success message if user just signed up
  if (showSuccess) {
    return (
      <div className="space-y-4 w-full max-w-md mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">You're on the waitlist! 🎉</h3>
        <p className="text-white/80">
          Thank you for joining! We'll notify you as soon as Banyan is ready.
        </p>
        <p className="text-sm text-white/70">
          Check your email for a confirmation message.
        </p>
        <Button 
          onClick={() => setShowSuccess(false)}
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white hover:text-emerald-600"
        >
          Join Another Email
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Direct HTML form that submits to FormSubmit */}
      <form 
        action="https://formsubmit.co/5252bf2f44493dc57a2e749cb29b40af" 
        method="POST"
        onSubmit={handleSubmit}
      >
        {/* FormSubmit configuration fields */}
        <input type="hidden" name="_subject" value="New Banyan Waitlist Signup!" />
        <input type="hidden" name="_autoresponse" value="Thank you for joining the Banyan waitlist! We'll notify you as soon as we launch. 🎉" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value={typeof window !== 'undefined' ? window.location.href + '?success=true' : ''} />
        
        {/* Combine input and button using flex layout */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
          <div className="flex-grow">
            <Input 
              placeholder="Enter your email address" 
              value={email}
              onChange={handleEmailChange}
              type="email"
              name="email"
              className="h-11 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            {emailError && (
              <p className="text-sm text-red-300 mt-1">{emailError}</p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={!email}
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full sm:shrink-0"
          >
            Join Waitlist
          </Button>
        </div>
      </form>
      <p className="text-sm mt-4 text-white/70 text-center">
        We'll notify you as soon as Banyan is ready!
      </p>
    </div>
  )
} 