import AboutSection from "@/components/homepage/about";
import Blog from "@/components/homepage/blog/blog";
import ContactSection from "@/components/homepage/contact/contact";
import Education from "@/components/homepage/education";
import Experience from "@/components/homepage/experienct";
import HeroSection from "@/components/homepage/hero-section";
import Projects from "@/components/homepage/projects/projects";
import Skills from "@/components/homepage/skills";
import { BlogType } from "@/components/homepage/blog/blog";
import { personalData } from "@/utils/data/personal-data";

async function getData() {
  const res = await fetch(
    `https://dev.to/api/articles?username=${personalData.devUsername}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: BlogType[] = await res.json();

  const filtered = data
    .filter((item: BlogType) => item?.cover_image)
    .sort(() => Math.random() - 0.5);

  return filtered;
}

export default async function Home() {
  const blogs = await getData();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Blog blogs={blogs} />
      <ContactSection />
    </>
  );
}
