import React, { useState } from 'react';

interface EmailFormProps {
  title?: string;
  onSubmitEmail: (email: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ title = "Want to see how you did?", onSubmitEmail }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === '' || !email.includes('@')) { // Basic validation
      alert('Please enter a valid email address.');
      return;
    }
    onSubmitEmail(email);
    setSubmitted(true);
    // Optionally clear email: setEmail('');
  };

  if (submitted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Thank You!</h2>
        <p className="text-lg text-gray-700">
          Your results will be sent to {email} shortly.
        </p>
        {/* Add any other follow-up actions or messages here */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col items-center justify-center p-8 bg-white text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-6">Drop your email here to get your quiz results.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full max-w-md p-3 mb-6 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-colors"
        required
      />
      <button
        type="submit"
        className="w-full max-w-md px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
      >
        Get My Results
      </button>
    </form>
  );
};

export default EmailForm; 