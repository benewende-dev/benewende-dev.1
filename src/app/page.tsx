"use client";

import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import AgencyServices from "@/components/sections/AgencyServices";
import Pricing from "@/components/sections/Pricing";
import CoursesPreview from "@/components/sections/CoursesPreview";
import ShopPreview from "@/components/sections/ShopPreview";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AgencyServices />
        <Pricing />
        <CoursesPreview />
        <ShopPreview />
        <ProjectsShowcase />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
