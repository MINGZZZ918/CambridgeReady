import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import LevelCards from "@/components/landing/LevelCards";
import Features from "@/components/landing/Features";
import ProductDemo from "@/components/landing/ProductDemo";
import Testimonials from "@/components/landing/Testimonials";
import Journey from "@/components/landing/Journey";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ProductDemo />
        <LevelCards />
        <Testimonials />
        <PainPoints />
        <Journey />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
