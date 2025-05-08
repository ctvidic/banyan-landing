"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Initialize React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setSubmitError(null) // Clear previous errors
    
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      
      const result = await response.json()

      if (!response.ok) {
        // Throw an error with the message from the API if available
        throw new Error(result.error || "An unexpected error occurred.")
      }
      
      // Show success toast
      toast.success("Success! You're on the waitlist. 🎉")
      form.reset() // Reset the form fields

    } catch (error: any) {
      // Show error toast
      const errorMessage = error.message || "Something went wrong. Please try again."
      toast.error(errorMessage)
      setSubmitError(errorMessage) // Optionally display error near the form too
      console.error("Submission Error:", error)

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      {/* Use space-y for vertical spacing in the form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto">
        {/* Combine input and button using flex layout, try aligning by baseline */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow">
                {/* Optional: Add a visible label or keep it sr-only */}
                <FormLabel className="sr-only">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email address" 
                    {...field} 
                    type="email" // Use type="email" for better browser support
                    disabled={isSubmitting} // Disable input while submitting
                    className="h-11 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50" // Reverted padding change
                  />
                </FormControl>
                {/* Display validation errors below the input */}
                <FormMessage /> 
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting} // Disable button while submitting
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full sm:shrink-0"
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Button>
        </div>
        {/* Optional: Display submission error message */}
        {submitError && (
          <p className="text-sm text-red-300 text-center mt-2">Error: {submitError}</p>
        )}
        <p className="text-sm mt-4 text-white/70 text-center">
          We'll notify you as soon as Banyan is ready!
        </p>
      </form>
    </Form>
  )
} 