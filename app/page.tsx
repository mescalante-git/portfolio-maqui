import Nav from "@/components/home/Nav";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Projects from "@/components/home/Projects";
import Skills from "@/components/home/Skills";
import Experience from "@/components/home/Experience";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import HomeEffects from "@/components/home/HomeEffects";
import "@/components/home/home.css";

export default function Home() {
  return (
    <>
      <div className="scan" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <HomeEffects />
    </>
  );
}
