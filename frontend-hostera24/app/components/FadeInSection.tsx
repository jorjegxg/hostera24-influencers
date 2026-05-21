"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type FadeInSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
};

export function FadeInSection({
  id,
  className = "",
  children,
  "aria-labelledby": ariaLabelledBy,
}: FadeInSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {children}
    </section>
  );
}
