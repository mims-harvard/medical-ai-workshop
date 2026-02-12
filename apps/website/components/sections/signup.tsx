"use client";

import { useState } from "react";

export function Signup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to actual mailing list service
    setSubmitted(true);
  };

  return (
    <section id="signup" className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6 text-center">
        <h2 className="heading-2 text-gradient mb-3">Stay Updated</h2>
        <p className="text-sm text-brand-neutral-200 mb-6">
          Get notified about submission deadlines, speaker announcements, and
          Virtual Clinic updates. We respect your privacy and will never share
          your information.
        </p>

        {submitted ? (
          <p className="text-sm text-accent font-medium">Thank you!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="flex-1 h-10 px-4 rounded-md border border-white/20 bg-white/5 text-sm text-white placeholder:text-brand-neutral-300 focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="h-10 px-5 rounded-md bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
