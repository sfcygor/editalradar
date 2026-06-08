import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import DemoSection from "@/components/landing/DemoSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FaqSection from "@/components/landing/FaqSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";
import { LifeBuoy } from "lucide-react";
import Link from "next/link";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
export const metadata = {
  title: "EditalRadar | Transforme horas de estudo em aprovação",
  description: "A plataforma definitiva para organizar, medir e acelerar a sua aprovação em concursos militares e policiais. Questões, Flashcards, Revisões e Metas em um só lugar.",
  openGraph: {
    title: "EditalRadar | Transforme horas de estudo em aprovação",
    description: "A plataforma definitiva para organizar, medir e acelerar a sua aprovação em concursos militares e policiais.",
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "EditalRadar Logo" }],
  },
};

export default async function LandingPage() {
  const session = await getSession();
  let user = null;

  if (session?.userId) {
    const res = await db().select().from(users).where(eq(users.id, session.userId)).limit(1);
    if (res.length > 0) user = res[0];
  }

  return (
    <SmoothScroll>
      <Suspense fallback={<div>Carregando...</div>}>
        <AuthModalProvider>
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
          <Header user={user} />
          
          <main style={{ flex: 1 }}>
            <HeroSection />
            <StatsSection />
            <DemoSection />
            <TestimonialsSection />
            <PricingSection user={user} />
            <FaqSection />
          </main>

          <Footer />

          {/* Floating Support Button */}
          <Link 
            href="/suporte" 
            style={{ 
              position: "fixed", 
              bottom: 32, 
              right: 32, 
              zIndex: 999, 
              background: "var(--primary)", 
              color: "white", 
              width: 60, 
              height: 60, 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              boxShadow: "0 10px 30px rgba(39,174,96,0.4)",
              transition: "transform 0.2s ease"
            }}
            className="hover:scale-110"
            title="Central de Suporte"
          >
            <LifeBuoy size={28} />
          </Link>
        </div>
        </div>
        </AuthModalProvider>
      </Suspense>
    </SmoothScroll>
  );
}
