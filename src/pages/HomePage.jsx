import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import ProjectsShowcase from "../components/ProjectsShowcase";
import AboutUs from "../components/AboutUs";
import FinalCTA from "../components/FinalCTA";
import Certifications from "../components/Certifications";
import Footer from "../components/Footer";
import StatsAndPackages from "../components/StatsAndPackages";
import ContactSection from "../components/ContactSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutUs />
      <Services />
      <StatsAndPackages />
      <ProjectsShowcase />
      <Certifications />
      <FinalCTA />
      <ContactSection />
      <Footer />
    </>
  );
}