"use client";

import { useEffect, useState } from "react";
import { Menu, Recycle, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "classifier", label: "Classify Waste" },
  { id: "how-it-works", label: "How It Works" },
  { id: "about", label: "About" },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]["id"];

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}

export default function Header() {
  const active = useActiveSection();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const linkClass = (id: SectionId) =>
    `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 active:bg-brand-100 ${
      active === id ? "bg-brand-50 text-brand-700" : "text-ink-muted hover:bg-line/50 hover:text-ink"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-canvas/90 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${
        scrolled ? "border-line shadow-[0_1px_12px_rgb(28_31_29/0.06)]" : "border-transparent"
      }`}
    >
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <a href="#home" className="group flex items-center gap-2.5 rounded-lg font-semibold tracking-tight text-ink">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white transition-transform duration-200 group-hover:rotate-[-8deg] group-active:scale-95">
            <Recycle className="size-4.5" aria-hidden="true" />
          </span>
          SmartWaste
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={linkClass(id)} aria-current={active === id ? "location" : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href="#classifier" className="btn btn-secondary hidden px-4 py-2 text-sm sm:inline-flex">
            Try Classifier
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink transition-colors duration-150 hover:bg-line/60 active:bg-line md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-canvas md:hidden">
          <ul className="page-container flex flex-col gap-1 py-3">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block ${linkClass(id)}`}
                  aria-current={active === id ? "location" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-2 sm:hidden">
              <a href="#classifier" className="btn btn-primary w-full py-2.5 text-sm" onClick={() => setMenuOpen(false)}>
                Try Classifier
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
