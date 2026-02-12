"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the format of submissions?",
    answer:
      "We welcome two types of submissions: original research papers (up to 5 pages) and perspective pieces (up to 2 pages), both excluding references and appendix. All submissions must be formatted using the ICML 2026 workshop template. One round of double-blinded peer review will be performed via OpenReview.",
  },
  {
    question: "Is this workshop archival?",
    answer:
      "No. All accepted papers will be non-archival. Authors retain the freedom to submit their work elsewhere for archival publication without facing exclusivity restrictions.",
  },
  {
    question: "How can I participate in the Virtual Clinic?",
    answer:
      "The Virtual Clinic is publicly available at https://github.com/mims-harvard/virtual-clinic. We will select 20 teams to receive access to frontier LLMs (1,000 queries each, all costs covered) to conduct analyses within our simulation. All participants are encouraged to submit short papers (up to 2 pages) describing lessons learned and will be invited to present posters at the workshop.",
  },
  {
    question: "Will there be virtual attendance options?",
    answer:
      "Details on virtual attendance will be announced closer to the workshop date. Please check back for updates." /* TODO: Update when virtual policy is confirmed */,
  },
  {
    question: "Is this workshop only about medical AI?",
    answer:
      "While grounded in healthcare, the algorithms discussed in this workshop are general and broadly relevant to ICML researchers interested in deploying models into any high-stakes environment. We emphasize medical applications because post-deployment improvement must operate under unusually stringent constraints, including high-risk decision-making, delayed or noisy feedback, heterogeneous populations, and safety and equity requirements.",
  },
  {
    question: "What is the Global Health Panel?",
    answer:
      "We will host a global health panel featuring the Gates Foundation, University of Global Health Equity, Partners In Health, Nature Health, and other leaders in global health delivery and AI deployment. They will outline specific priority applications of AI such as autonomous triage, predicting maternal health risk, and AI-assisted documentation.",
  },
  {
    question: "Are there travel grants available?",
    answer:
      "Details on travel grants and financial assistance for attendees will be announced closer to the workshop. Please check back for updates." /* TODO: Update when travel grant policy is confirmed */,
  },
  {
    question: "Who should I contact with questions?",
    answer:
      "The primary contacts for the workshop are Marinka Zitnik (marinka@hms.harvard.edu) and Ayush Noori (ayush.noori@sjc.ox.ac.uk).",
  },
];

export function FAQs() {
  return (
    <section id="faqs" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-4">FAQs</h2>

        <p className="text-center text-sm text-brand-neutral-200 mb-10">
          For any questions not covered here, please contact{" "}
          <a
            href="mailto:marinka@hms.harvard.edu"
            className="text-white underline underline-offset-2 decoration-white/40 hover:decoration-white"
          >
            marinka@hms.harvard.edu
          </a>{" "}
          or{" "}
          <a
            href="mailto:ayush.noori@sjc.ox.ac.uk"
            className="text-white underline underline-offset-2 decoration-white/40 hover:decoration-white"
          >
            ayush.noori@sjc.ox.ac.uk
          </a>
          .
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
