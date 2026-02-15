import Image from "next/image";

interface Person {
  name: string;
  affiliation: string;
  role: string;
  image: string;
}

const speakers: Person[] = [
  {
    name: "Karandeep Singh",
    affiliation: "UC San Diego Health",
    role: "Chief Health AI Officer and Associate Professor",
    image: "/karandeep-singh.webp",
  },
  {
    name: "Bilal Mateen",
    affiliation: "PATH; University of Birmingham",
    role: "Chief AI Officer; Professor",
    image: "/bilal-mateen.webp",
  },
  {
    name: "Robert Korom",
    affiliation: "Penda Health",
    role: "Chief Medical Officer",
    image: "/robert-korom.webp",
  },
  {
    name: "Kim Branson",
    affiliation: "GlaxoSmithKline",
    role: "SVP and Global Head of AI and Machine Learning",
    image: "/kim-branson.webp",
  },
  {
    name: "Maryam Mustafa",
    affiliation: "Lahore University of Management Sciences",
    role: "Professor; Founder, Awaaz-e-Sehat",
    image: "/maryam-mustafa.webp",
  },
  {
    name: "Melissa Miles",
    affiliation: "Gates Foundation",
    role: "Senior Program Officer, AI and Innovations in Primary Health Care",
    image: "/melissa-miles.webp",
  },
  {
    name: "Lorenzo Righetto",
    affiliation: "Nature Health",
    role: "Senior Editor",
    image: "/lorenzo-righetto.webp",
  },
];

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="group flex flex-col items-center text-center">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 border border-border group-hover:border-border-hover transition-colors">
        <Image
          src={person.image}
          alt={person.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 112px, 128px"
        />
      </div>
      <h4 className="text-sm font-medium text-on-surface">{person.name}</h4>
      <p className="text-xs text-brand-neutral-200 mt-0.5">
        {person.affiliation}
      </p>
      <p className="text-[10px] text-brand-neutral-300 mt-0.5">{person.role}</p>
    </div>
  );
}

export function Speakers() {
  return (
    <section id="speakers" className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-4">
          Invited Speakers & Panelists
        </h2>
        <p className="text-center text-sm text-brand-neutral-200 mb-12">
          Experts with real-world experience deploying AI at healthcare system
          scale.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10">
          {speakers.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}
