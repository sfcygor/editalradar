"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";

function HashScroller() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => lenis.scrollTo(el, { offset: -80, immediate: true }), 150);
      }
    }

    const onHashChange = () => {
      const el = document.getElementById(window.location.hash.replace("#", ""));
      if (el) lenis.scrollTo(el, { offset: -80 });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,          // silky smooth — between Lenis default and butter
        duration: 1.6,       // slightly longer for a more premium feel
        smoothWheel: true,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      }}
    >
      <HashScroller />
      {children}
    </ReactLenis>
  );
}
