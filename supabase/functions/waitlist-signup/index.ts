import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders, validateEmail } from "./_shared/validation.ts"
import { getWelcomeEmailHtml, getAdminNotificationHtml } from "./_shared/email-templates.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { email } = await req.json()

    // Validate email
    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Initialize Supabase client with service role key
    // Supabase automatically provides SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get email configuration from custom secrets
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!
    const fromEmail = Deno.env.get('FROM_EMAIL')!
    const adminEmail = Deno.env.get('ADMIN_EMAIL')!

    // Try to insert email into database
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        { 
          email: email.toLowerCase().trim(),
          source: 'landing_page',
          metadata: {
            user_agent: req.headers.get('user-agent') || 'unknown',
            timestamp: new Date().toISOString()
          }
        }
      ])
      .select()
      .single()

    // If email already exists, return success anyway (security best practice)
    if (error && error.code === '23505') { // Unique constraint violation
      console.log(`Duplicate email submission: ${email}`)
      return new Response(
        JSON.stringify({ success: true, message: 'Thanks for signing up!' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Handle other database errors
    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Something went wrong. Please try again.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Send welcome email to user
    const welcomeEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: '🌿 Welcome to the Banyan Waitlist!',
        html: getWelcomeEmailHtml(),
        text: getWelcomeEmailHtml() // Using same content for plain text
      }),
    })

    // Send admin notification email
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: '🎉 New Banyan Waitlist Signup',
        html: getAdminNotificationHtml(email),
        text: getAdminNotificationHtml(email)
      }),
    })

    // Log email sending results
    if (!welcomeEmailResponse.ok) {
      console.error('Failed to send welcome email:', await welcomeEmailResponse.text())
    }
    if (!adminEmailResponse.ok) {
      console.error('Failed to send admin notification:', await adminEmailResponse.text())
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thanks for signing up! Check your email for a welcome message.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}) 