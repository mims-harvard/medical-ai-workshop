export function About() {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-10">About</h2>

        <div className="prose max-w-none">
          <p>
            Artificial intelligence (AI), including predictive and generative
            foundation models, is being implemented in clinical settings
            worldwide at an unprecedented rate. As of May 2025, at least 377
            healthcare systems in the U.S. alone have piloted or adopted 70
            generative AI tools for clinical decision support, patient
            communication, documentation, claims processing, and healthcare
            administration. Globally, 48% of clinicians surveyed across 109
            countries report using AI for work.
          </p>

          <p>
            This rapid adoption is driven by the strong technical performance of
            new AI models across several largely synthetic medical benchmarks.
            However, concerns about coherence, accuracy, hallucinations, and
            bias persist. The real-world clinical performance of AI at the
            healthcare system-level remains poorly understood, and algorithmic
            strategies to evaluate and improve deployed medical AI models remain
            underdeveloped.
          </p>

          <p>
            <strong>
              This workshop addresses that gap by focusing on the algorithmic
              frontier of post-deployment improvement for medical AI.
            </strong>{" "}
            Moving beyond conventional supervised or reinforcement fine-tuning,
            we explore an emerging design space where deployment-time
            diagnostics&mdash;from human expert critique to real-world
            performance shifts&mdash;are utilized as a signal for model
            improvement.
          </p>

          <p>
            We emphasize medical applications because improvement must operate
            under unusually stringent constraints&mdash;including high-risk
            decision-making, delayed or noisy feedback, heterogeneous
            populations, and safety and equity requirements&mdash;which make
            post-deployment updates both critical and challenging. While grounded
            in healthcare, the algorithms discussed in this workshop are general
            and will be broadly relevant to ICML researchers interested in
            deploying their models into high-stakes environments.
          </p>
        </div>
      </div>
    </section>
  );
}
