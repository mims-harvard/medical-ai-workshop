import Image from "next/image";

interface Organizer {
  name: string;
  affiliation: string;
  email: string;
  bio: string;
  image: string;
}

const organizers: Organizer[] = [
  {
    name: "Marinka Zitnik",
    affiliation: "Harvard Medical School",
    email: "marinka@hms.harvard.edu",
    bio: "Associate Professor of Biomedical Informatics at Harvard with appointments at the Broad Institute and Kempner Institute for the Study of Natural and Artificial Intelligence. Her research focuses on the foundations of artificial intelligence for medicine and therapeutic discovery. Co-organized 20+ international workshops at NeurIPS, ICML, and ICLR.",
    image: "/marinka-zitnik.webp",
  },
  {
    name: "Ayush Noori",
    affiliation: "University of Oxford",
    email: "ayush.noori@sjc.ox.ac.uk",
    bio: "PhD student and Rhodes Scholar in the Department of Engineering Science at the University of Oxford. Seeks to advance AI for diagnosis and treatment of neurological disorders. Served on the organizing committee of the international Machine Learning for Health symposium (co-located with NeurIPS).",
    image: "/ayush-noori.webp",
  },
  {
    name: "Marie-Laure Charpignon",
    affiliation: "Kaiser Permanente, UC Berkeley, Boston Children's Hospital",
    email: "mariecharpignon@berkeley.edu",
    bio: "Postdoctoral fellow in computational health informatics. Received her PhD in Social & Engineering Systems and Statistics from MIT. Her research focuses on causal inference and network science approaches in public health and medicine. Co-organized the ICLR 2021 workshop on AI for Public Health.",
    image: "/marie-laure-charpignon.webp",
  },
  {
    name: "Lucas Vittor",
    affiliation: "Harvard Medical School",
    email: "lucas_vittor@hms.harvard.edu",
    bio: "Research Associate in the Department of Biomedical Informatics at Harvard Medical School. His work includes designing and deploying model pipelines for large language and foundation models using multi-GPU training and inference, building high-throughput data pipelines, and training and orchestrating graph-based and multi-agent AI systems.",
    image: "/lucas-vittor.webp",
  },
];

export function Organizers() {
  return (
    <section id="organizers" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-12">
          Workshop Organizers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {organizers.map((person) => (
            <div
              key={person.name}
              className="rounded-lg border border-border bg-surface-elevated overflow-hidden"
            >
              <div className="flex items-center gap-4 p-5 pb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-border shrink-0">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">
                    {person.name}
                  </h4>
                  <p className="text-xs text-brand-neutral-200 mt-0.5">
                    {person.affiliation}
                  </p>
                  <a
                    href={`mailto:${person.email}`}
                    className="text-[10px] text-accent hover:underline mt-0.5 inline-block"
                  >
                    {person.email}
                  </a>
                </div>
              </div>
              <p className="text-xs text-brand-neutral-200 leading-relaxed px-5 pb-5">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
