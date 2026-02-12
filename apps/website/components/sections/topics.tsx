import {
  Cpu,
  Timer,
  Bot,
  Users,
  Globe,
} from "lucide-react";

const topics = [
  {
    icon: Cpu,
    title: "Model & Data-Efficient Learning",
    description:
      "Parameter-efficient fine-tuning, model editing, synthetic data generation, curriculum learning, lifelong learning, and other meta-learning strategies.",
  },
  {
    icon: Timer,
    title: "Test-Time Scaling",
    description:
      "Self-consistency decoding, verification-guided reasoning, and other methods to allocate computation by risk, uncertainty, or need in resource-constrained healthcare environments.",
  },
  {
    icon: Bot,
    title: "Self-Evolving Agents",
    description:
      "Autonomously improving systems capable of adaptive prompt or data sequencing, self-critique or revision, generation of new tasks from failures, updating of long-term memory modules, or self-modification of tools or agent architecture.",
  },
  {
    icon: Users,
    title: "Human-AI Collaboration",
    description:
      "Human feedback loops, clinical interpretability, and abstention strategies for safe and trustworthy AI-assisted clinical decision-making.",
  },
  {
    icon: Globe,
    title: "Deployment Science",
    description:
      "Generalization under distribution shifts and domain adaptation, including monitoring, distillation, and quantization for edge and low-resource settings.",
  },
];

export function Topics() {
  return (
    <section id="topics" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-4">Topics</h2>
        <p className="text-center text-sm text-brand-neutral-200 mb-10 max-w-2xl mx-auto">
          We invite contributions on the following topics at the intersection of
          algorithmic research and deployed medical AI.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center mb-4">
                <topic.icon className="w-4.5 h-4.5 text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {topic.title}
              </h3>
              <p className="text-xs text-brand-neutral-200 leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
