import Image from "next/image";

interface Organizer {
  name: string;
  affiliation: string;
  email: string;
  bio: string;
  bioSuffix?: string;
  image: string;
}

const organizers: Organizer[] = [
  {
    name: "Ayush Noori",
    affiliation: "University of Oxford",
    email: "ayush.noori@sjc.ox.ac.uk",
    bio: "PhD student, Rhodes Scholar, and Encode: AI for Science Fellow at the University of Oxford. His research advances AI for diagnosis and treatment of neurological disorders. Published over 40 papers, including 14 first or co-first works. Served on the organizing committee of the Machine Learning for Health Symposium for two years.",
    image: "/ayush-noori.webp",
  },
  {
    name: "Marinka Zitnik",
    affiliation: "Harvard University",
    email: "marinka@hms.harvard.edu",
    bio: "Associate Professor of Biomedical Informatics at Harvard with appointments at the Broad Institute and Kempner Institute. Her research focuses on AI for medicine and therapeutic discovery. Co-organized 20+ international workshops at NeurIPS, ICML, and ICLR, including the NeurIPS AI for Science series and workshops on foundation models for biology.",
    image: "/marinka-zitnik.webp",
  },
  {
    name: "Emily Alsentzer",
    affiliation: "Stanford University",
    email: "ealsentzer@stanford.edu",
    bio: "Assistant Professor of Biomedical Data Science and Computer Science at Stanford University. Her research uses machine learning to augment clinical decision making and broaden access to healthcare. Founding organizer of the Symposium on AI for Learning Health Systems (SAIL) and former General Chair of the Machine Learning for Health Symposium.",
    image: "/emily-alsentzer.webp",
  },
  {
    name: "David A. Clifton",
    affiliation: "University of Oxford",
    email: "david.clifton@eng.ox.ac.uk",
    bio: "Royal Academy of Engineering Chair of Clinical Machine Learning and NIHR Research Professor at the University of Oxford. His research focuses on real-world deployment of in-hospital AI systems and translation into low- and middle-income countries. Co-organized workshops at ICML 2022, AAAI 2025, and ICCV 2025, among others.",
    image: "/david-clifton.webp",
  },
  {
    name: "Marie-Laure Charpignon",
    affiliation: "Kaiser Permanente, UC Berkeley, Boston Children's Hospital",
    email: "mariecharpignon@berkeley.edu",
    bio: "Postdoctoral fellow in computational health informatics. Received her PhD in Social & Engineering Systems and Statistics from MIT. Her research focuses on causal inference and network science in public health. Co-organized the ICLR 2021 AI for Public Health workshop and co-chairs the KDD epiDAMIK workshop.",
    image: "/marie-laure-charpignon.webp",
  },
  {
    name: "Lucas Vittor",
    affiliation: "Harvard Medical School",
    email: "lucas_vittor@hms.harvard.edu",
    bio: "Research Associate in Biomedical Informatics at Harvard Medical School. Designs and deploys pipelines for large language models and multi-agent AI systems. Previously an early engineer at Mutt Data, building ML architectures for industry leaders.",
    bioSuffix: "Research Engineer providing support for the Virtual Clinic.",
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
                {person.bioSuffix && (
                  <>
                    {" "}
                    <em>{person.bioSuffix}</em>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
