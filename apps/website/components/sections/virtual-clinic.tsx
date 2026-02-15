import { Stethoscope, Pill, MessageSquare, FileCheck } from "lucide-react";

const workflows = [
  {
    icon: Stethoscope,
    title: "Diagnosis",
    description:
      "Interview a simulated patient (created using Synthea and GPT-4o) to gather symptoms and medical history. Ground truth conditions are withheld, requiring models to reason from incomplete information.",
  },
  {
    icon: Pill,
    title: "Treatment Planning",
    description:
      "Discuss therapeutic options with the simulated patient. Medications are hidden during evaluation, requiring clinical reasoning under uncertainty.",
  },
  {
    icon: MessageSquare,
    title: "Curbside Consultation",
    description:
      "Present and defend clinical reasoning to a simulated attending physician. Models must justify their decisions under expert scrutiny.",
  },
  {
    icon: FileCheck,
    title: "Insurance Authorization",
    description:
      "Justify medical necessity to a simulated healthcare administrator. Models must navigate documentation and policy constraints.",
  },
];

export function VirtualClinic() {
  return (
    <section id="virtual-clinic" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-lg border border-accent/20 bg-accent/[0.03] p-8 sm:p-10">
          <p className="text-xs font-mono uppercase tracking-wider text-accent mb-2">
            Interactive Challenge
          </p>
          <h2 className="heading-2 text-gradient mb-4">Virtual Clinic</h2>

          <div className="prose max-w-none mb-8">
            <p>
              A key barrier to post-deployment medical AI research is the lack of
              safe, interactive environments where algorithms can be tested under
              realistic uncertainty. Static benchmarks fail to capture the
              sequential, partially observed, and high-stakes nature of clinical
              decision making.
            </p>
            <p>
              The <strong>Virtual Clinic</strong> is a public clinical world
              model designed specifically for this workshop&mdash;an experimental
              sandbox to study algorithmic adaptation under delayed and
              incomplete feedback. The environment consists of LLM-powered agents
              simulating patients, physicians, and healthcare administrators,
              which participants can interact with through API-driven multi-turn
              conversation.
            </p>
            <p>
              We will select <strong>20 teams</strong> to receive access to
              frontier LLMs (1,000 queries each, all costs covered) to conduct
              analyses within our simulation. All participants will be encouraged
              to submit short papers (up to 2 pages) describing lessons learned
              and will be invited to present posters at the workshop.
            </p>
          </div>

          {/* Four workflow cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {workflows.map((workflow) => (
              <div
                key={workflow.title}
                className="rounded-md border border-border bg-surface-overlay p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <workflow.icon className="w-4 h-4 text-accent" />
                  <h4 className="text-sm font-semibold text-on-surface">
                    {workflow.title}
                  </h4>
                </div>
                <p className="text-xs text-brand-neutral-200 leading-relaxed">
                  {workflow.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-brand-neutral-200 mb-4">
            Downstream tasks build on upstream submissions, creating an
            environment of interacting agents. A public leaderboard will track
            performance and adaptation across all four tasks.
          </p>

          <a
            href="https://github.com/mims-harvard/virtual-clinic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 px-5 rounded-md border border-accent/30 text-accent text-sm font-medium hover:bg-accent/10 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
