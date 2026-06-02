import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import DemoSection from "@/components/landing/DemoSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";

export const metadata = {
  title: "EditalRadar | Transforme horas de estudo em aprovação",
  description: "A plataforma definitiva para organizar, medir e acelerar a sua aprovação em concursos militares e policiais. Questões, Flashcards, Revisões e Metas em um só lugar.",
  openGraph: {
    title: "EditalRadar | Transforme horas de estudo em aprovação",
    description: "A plataforma definitiva para organizar, medir e acelerar a sua aprovação em concursos militares e policiais.",
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "EditalRadar Logo" }],
  },
};

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fdfdfd", color: "var(--text)", position: "relative", overflowX: "hidden" }}>
        {/* Global Background Layer */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          {/* Subtle Grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "linear-gradient(to bottom, white, transparent 80%)", WebkitMaskImage: "linear-gradient(to bottom, white, transparent 80%)" }} />
          {/* Orbs */}
          <div style={{ position: "absolute", top: -200, left: "20%", width: 600, height: 600, background: "rgba(39, 174, 96, 0.15)", borderRadius: "50%", filter: "blur(120px)" }} />
          <div style={{ position: "absolute", top: 100, right: "10%", width: 500, height: 500, background: "rgba(59, 130, 246, 0.1)", borderRadius: "50%", filter: "blur(100px)" }} />
        </div>

        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
          <Header />
          
          <main style={{ flex: 1 }}>
            <HeroSection />
            <DemoSection />
            <PricingSection />
          </main>

          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
}
