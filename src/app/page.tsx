import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import LevelCards from "@/components/landing/LevelCards";
import Features from "@/components/landing/Features";
import Journey from "@/components/landing/Journey";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LevelCards />
        <Features />
        <Journey />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
