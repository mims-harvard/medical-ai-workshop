import { Stethoscope, Pill, AlertTriangle } from "lucide-react";

const tasks = [
  {
    icon: Stethoscope,
    title: "Diagnosis Prediction",
    description:
      "Interview a simulated patient to propose a diagnosis. Ground truth labels are derived from the patient's Synthea-generated longitudinal health record.",
  },
  {
    icon: Pill,
    title: "Treatment Prediction",
    description:
      "Interview a simulated patient to predict the treatment plan that will be administered.",
  },
  {
    icon: AlertTriangle,
    title: "Event Prediction",
    description:
      "Interview a simulated patient to estimate the probability of a specific clinical event (e.g., hospitalization or complication) within a fixed time horizon.",
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
              incomplete feedback. The environment consists of LLM-based
              simulated patient agents powered by realistic underlying health
              records generated using <a href="https://doi.org/10.1093/jamia/ocx079" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Synthea</a>. Participants deploy frontier LLMs
              that interact with these simulated patient agents through
              API-driven multi-turn conversations.
            </p>
            <p>
              We will select up to <strong>20 teams</strong> to participate.
              Each team will receive a fixed budget of frontier LLM queries
              (1,000 per team; all compute costs covered) to conduct experiments
              within the simulation. Teams can modify system prompts, questioning
              strategies, context management, and tool-calling policies to
              identify algorithms that improve performance under partial
              observability.
            </p>
            <p>
              All teams will submit short papers (up to 2 pages) using a provided
              template to describe their findings. Teams will also present
              posters at the workshop, and up to 3 outstanding submissions will
              be invited to present highlights during the workshop program.
            </p>
          </div>

          {/* Three task cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {tasks.map((task) => (
              <div
                key={task.title}
                className="rounded-md border border-border bg-surface-overlay p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <task.icon className="w-4 h-4 text-accent" />
                  <h4 className="text-sm font-semibold text-on-surface">
                    {task.title}
                  </h4>
                </div>
                <p className="text-xs text-brand-neutral-200 leading-relaxed">
                  {task.description}
                </p>
              </div>
            ))}
          </div>

          <a
            href="https://virtual-clinic-api.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 px-5 rounded-md border border-accent/30 text-accent text-sm font-medium hover:bg-accent/10 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
