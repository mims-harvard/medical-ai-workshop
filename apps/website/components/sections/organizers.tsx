interface Organizer {
  name: string;
  affiliation: string;
  email: string;
  bio: string;
  /* TODO: Add image URLs when photos are provided */
}

const organizers: Organizer[] = [
  {
    name: "Marinka Zitnik",
    affiliation: "Harvard Medical School",
    email: "marinka@hms.harvard.edu",
    bio: "Associate Professor of Biomedical Informatics at Harvard with appointments at the Broad Institute and Kempner Institute for the Study of Natural and Artificial Intelligence. Her research focuses on the foundations of artificial intelligence for medicine and therapeutic discovery. Co-organized 20+ international workshops at NeurIPS, ICML, and ICLR.",
  },
  {
    name: "Ayush Noori",
    affiliation: "University of Oxford",
    email: "ayush.noori@sjc.ox.ac.uk",
    bio: "PhD student and Rhodes Scholar in the Department of Engineering Science at the University of Oxford. Seeks to advance AI for diagnosis and treatment of neurological disorders. Served on the organizing committee of the international Machine Learning for Health symposium (co-located with NeurIPS).",
  },
  {
    name: "Marie-Laure Charpignon",
    affiliation: "Kaiser Permanente, UC Berkeley, Boston Children's Hospital",
    email: "mariecharpignon@berkeley.edu",
    bio: "Postdoctoral fellow in computational health informatics. Received her PhD in Social & Engineering Systems and Statistics from MIT. Her research focuses on causal inference and network science approaches in public health and medicine. Co-organized the ICLR 2021 workshop on AI for Public Health.",
  },
];

export function Organizers() {
  return (
    <section id="organizers" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-12">
          Workshop Organizers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {organizers.map((person) => {
            // Generate initials for placeholder avatar
            const initials = person.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <div
                key={person.name}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* TODO: Replace placeholder with actual photo */}
                  <div className="w-16 h-16 rounded-full border border-white/10 bg-accent/5 flex items-center justify-center shrink-0">
                    <span className="text-lg font-semibold text-accent/60">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {person.name}
                    </h4>
                    <p className="text-xs text-brand-neutral-200">
                      {person.affiliation}
                    </p>
                    <a
                      href={`mailto:${person.email}`}
                      className="text-[10px] text-accent hover:underline"
                    >
                      {person.email}
                    </a>
                  </div>
                </div>
                <p className="text-xs text-brand-neutral-200 leading-relaxed">
                  {person.bio}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
