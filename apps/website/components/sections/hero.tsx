import { Activity } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-8 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
          </div>

          {/* Title */}
          <h1 className="display text-gradient max-w-4xl">
            Algorithmic Foundations for Medical AI in the Real World
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base text-brand-neutral-100 max-w-xl">
            Workshop at the International Conference on Machine Learning
          </p>

          {/* TODO: Replace with actual ICML 2026 venue and date when announced */}
          <p className="mt-2 text-sm sm:text-base font-medium text-brand-neutral-50">
            ICML 2026 &mdash; Date & Venue TBD
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {/* TODO: Replace with actual OpenReview submission link */}
            <a
              href="https://openreview.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Submit on OpenReview
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
