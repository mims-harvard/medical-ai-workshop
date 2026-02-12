import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Topics } from "@/components/sections/topics";
import { CallForPapers } from "@/components/sections/call-for-papers";
import { VirtualClinic } from "@/components/sections/virtual-clinic";
import { Schedule } from "@/components/sections/schedule";
import { Speakers } from "@/components/sections/speakers";
import { Organizers } from "@/components/sections/organizers";
import { GlobalHealthPanel } from "@/components/sections/global-health-panel";
import { FAQs } from "@/components/sections/faqs";
import { Signup } from "@/components/sections/signup";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="section-divider mx-auto max-w-6xl" />
      <About />

      <div className="section-divider mx-auto max-w-6xl" />
      <Topics />

      <div className="section-divider mx-auto max-w-6xl" />
      <CallForPapers />

      <div className="section-divider mx-auto max-w-6xl" />
      <VirtualClinic />

      <div className="section-divider mx-auto max-w-6xl" />
      <Schedule />

      <div className="section-divider mx-auto max-w-6xl" />
      <Speakers />

      <div className="section-divider mx-auto max-w-6xl" />
      <Organizers />

      <div className="section-divider mx-auto max-w-6xl" />
      <GlobalHealthPanel />

      <div className="section-divider mx-auto max-w-6xl" />
      <FAQs />

      <div className="section-divider mx-auto max-w-6xl" />
      <Signup />
    </>
  );
}
