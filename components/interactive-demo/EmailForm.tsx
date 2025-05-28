import React, { useState } from 'react';

interface EmailFormProps {
  title?: string;
  onSubmitEmail: (email: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ title = "Want to see how you did?", onSubmitEmail }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Simple email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Call the parent callback
    onSubmitEmail(email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Thank You!</h2>
        <p className="text-lg text-gray-700 mb-4">
          Your results will be sent to {email} shortly.
        </p>
        <p className="text-sm text-gray-500">
          Check your email for your quiz results and learn more about Banyan!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-6">Drop your email here to get your quiz results.</p>
      
      {/* Direct HTML form that submits to FormSubmit */}
      <form 
        onSubmit={handleSubmit}
        action="https://formsubmit.co/5252bf2f44493dc57a2e749cb29b40af" 
        method="POST"
        className="w-full max-w-md"
      >
        {/* FormSubmit configuration fields */}
        <input type="hidden" name="_subject" value="Quiz Results Request - Banyan Interactive Demo" />
        <input type="hidden" name="_autoresponse" value="Thank you for trying our interactive demo! Here are your quiz results and more information about Banyan. We'll be in touch soon!" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="quiz_completed" value="true" />
        <input type="hidden" name="demo_source" value="interactive_demo" />
        
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full p-3 mb-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-colors"
          required
        />
        
        {emailError && (
          <p className="text-sm text-red-500 mb-4">{emailError}</p>
        )}
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        >
          Get My Results
        </button>
      </form>
    </div>
  );
};

export default EmailForm; 