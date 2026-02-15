export function CallForPapers() {
  return (
    <section id="cfp" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-10">
          Call for Papers
        </h2>

        <div className="prose max-w-3xl mx-auto">
          <p>
            We invite submissions that advance the algorithmic foundations of
            deployed medical AI. To encourage submissions of both current
            progress and forward-looking discussion, we welcome two types of
            submissions:
          </p>
        </div>

        {/* Two submission type cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-10 max-w-3xl mx-auto">
          <div className="rounded-lg border border-border bg-surface-elevated p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-1">
              Original Research Papers
            </h3>
            <p className="text-xs text-brand-neutral-200 mb-3">
              Up to <strong className="text-on-surface">5 pages</strong>{" "}
              (excluding references & appendix)
            </p>
            <p className="text-xs text-brand-neutral-200">
              Novel contributions to post-deployment improvement, test-time
              scaling, self-evolving agents, human-AI collaboration, or
              deployment science for medical AI.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-elevated p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-1">
              Perspective Pieces
            </h3>
            <p className="text-xs text-brand-neutral-200 mb-3">
              Up to <strong className="text-on-surface">2 pages</strong>
            </p>
            <p className="text-xs text-brand-neutral-200">
              Forward-looking position papers that outline challenges, propose
              research agendas, or spark community discussion on medical AI
              deployment.
            </p>
          </div>
        </div>

        <div className="prose max-w-3xl mx-auto">
          <p>
            All accepted papers will be <strong>non-archival</strong>. One round
            of <strong>double-blinded peer review</strong> will be performed via{" "}
            {/* TODO: Replace with actual OpenReview link when available */}
            <a
              href="https://openreview.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenReview
            </a>
            .
          </p>
        </div>

        {/* Important Dates */}
        <div className="mt-12 rounded-lg border border-border bg-surface-elevated p-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-on-surface mb-4">
            Important Dates
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Submission Deadline",
                date: "TBD" /* TODO: Add actual date */,
              },
              {
                label: "Notification of Acceptance",
                date: "TBD" /* TODO: Add actual date */,
              },
              {
                label: "Camera-Ready Deadline",
                date: "TBD" /* TODO: Add actual date */,
              },
              {
                label: "Workshop Date",
                date: "TBD — ICML 2026" /* TODO: Add actual date and venue */,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
              >
                <span className="text-sm font-medium text-brand-neutral-50 sm:min-w-48">
                  {item.label}:
                </span>
                <span className="text-sm text-brand-neutral-100">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
