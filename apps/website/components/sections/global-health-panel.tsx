import { Globe } from "lucide-react";

const panelists = [
  {
    name: "Gates Foundation",
    description: "Pioneering AI for primary healthcare in Africa",
  },
  {
    name: "University of Global Health Equity",
    description: "Global health education",
  },
  {
    name: "Partners In Health",
    description: "Quality healthcare in low-resource settings",
  },
  {
    name: "Nature Health",
    description: "Research impacting health policy and practice",
  },
  /* TODO: Add additional panelists and their details when confirmed */
];

export function GlobalHealthPanel() {
  return (
    <section id="global-health" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-lg border border-accent/20 bg-accent/[0.03] p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center">
              <Globe className="w-4.5 h-4.5 text-accent" />
            </div>
            <p className="text-xs font-mono uppercase tracking-wider text-accent">
              Special Session
            </p>
          </div>

          <h2 className="heading-2 text-gradient mb-4">Global Health Panel</h2>

          <div className="prose max-w-none mb-8">
            <p>
              There are unique opportunities and challenges for real-world
              medical AI in low- and middle-income countries (LMICs). For
              example, LMIC health AI deployments often encounter extreme
              distribution shift; must operate with intermittent connectivity and
              limited compute, necessitating distillation, quantization, or
              low-bitwidth inference; and often rely on sparse or noisy human
              feedback when clinical expertise is limited. Recognizing these
              differences, our workshop is committed to a global perspective.
              This commitment is reflected through a diverse organizing committee
              and speaker list that draws from five continents.
            </p>
            <p>
              This panel will feature leaders in global health delivery and AI
              deployment who will outline specific priority global health
              application areas for AI, such as autonomous triage, maternal
              health risk prediction, and AI-assisted clinical documentation. We
              will actively invite frontline implementation partners from LMICs
              to participate, ensuring that technical discussions remain grounded
              in realities of the Global South.
            </p>
          </div>

          {/* Panelist organizations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {panelists.map((panelist) => (
              <div
                key={panelist.name}
                className="rounded-md border border-border bg-surface-overlay p-4"
              >
                <h4 className="text-sm font-semibold text-on-surface mb-1">
                  {panelist.name}
                </h4>
                <p className="text-xs text-brand-neutral-200">
                  {panelist.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
