import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-sm font-semibold text-white mb-2">
              Medical AI Workshop
            </p>
            <p className="text-xs text-brand-neutral-200">
              Algorithmic Foundations for Medical AI in the Real World
            </p>
            <p className="text-xs text-brand-neutral-300 mt-1">
              ICML 2026 Workshop
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-medium text-brand-neutral-100 uppercase tracking-wider mb-3">
              Contact
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="mailto:marinka@hms.harvard.edu"
                className="text-xs text-brand-neutral-200 hover:text-white transition-colors"
              >
                marinka@hms.harvard.edu
              </Link>
              <Link
                href="mailto:ayush.noori@sjc.ox.ac.uk"
                className="text-xs text-brand-neutral-200 hover:text-white transition-colors"
              >
                ayush.noori@sjc.ox.ac.uk
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-medium text-brand-neutral-100 uppercase tracking-wider mb-3">
              Links
            </p>
            <div className="flex flex-col gap-2">
              {/* TODO: Replace with actual OpenReview link when available */}
              <Link
                href="https://openreview.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-neutral-200 hover:text-white transition-colors"
              >
                OpenReview
              </Link>
              <Link
                href="https://icml.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-neutral-200 hover:text-white transition-colors"
              >
                ICML 2026
              </Link>
              <Link
                href="https://github.com/mims-harvard/virtual-clinic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-neutral-200 hover:text-white transition-colors"
              >
                Virtual Clinic (GitHub)
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-xs text-brand-neutral-300 text-center">
            Algorithmic Foundations for Medical AI in the Real World &mdash; ICML
            2026
          </p>
        </div>
      </div>
    </footer>
  );
}
