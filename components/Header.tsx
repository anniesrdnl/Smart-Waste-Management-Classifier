"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, CloudUpload, House, Info, ListChecks, Menu, X, type LucideIcon } from "lucide-react";

const NAV_ITEMS: readonly { id: string; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "classifier", label: "Classify Waste", icon: CloudUpload },
  { id: "how-it-works", label: "How It Works", icon: ListChecks },
  { id: "about", label: "About", icon: Info },
];

/** Horizontal padding of each desktop nav link; the underline is inset by this amount. */
const LINK_INSET_PX = 14;

type SectionId = (typeof NAV_ITEMS)[number]["id"];

interface IndicatorRect {
  left: number;
  width: number;
}

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
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

/** Measures the active link so a single underline can slide between items. */
function useSlidingIndicator(active: SectionId) {
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef(new Map<SectionId, HTMLAnchorElement>());
  const [rect, setRect] = useState<IndicatorRect | null>(null);
  const [animate, setAnimate] = useState(false);

  const measure = useCallback(() => {
    const link = linkRefs.current.get(active);
    if (link) setRect({ left: link.offsetLeft, width: link.offsetWidth });
  }, [active]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  // Enable the slide only after the first placement, so the underline doesn't animate in from the left edge.
  useEffect(() => {
    if (rect && !animate) requestAnimationFrame(() => setAnimate(true));
  }, [rect, animate]);

  const registerLink = (id: SectionId) => (element: HTMLAnchorElement | null) => {
    if (element) linkRefs.current.set(id, element);
    else linkRefs.current.delete(id);
  };

  return { listRef, registerLink, rect, animate };
}

export default function Header() {
  const active = useActiveSection();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const { listRef, registerLink, rect, animate } = useSlidingIndicator(active);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled || menuOpen
          ? "border-line bg-surface/90 shadow-[0_1px_12px_rgb(28_31_29/0.05)] backdrop-blur-lg backdrop-saturate-150"
          : "border-transparent bg-surface"
      }`}
    >
      <div className="page-container grid h-16 grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <a href="#home" className="group flex items-center justify-self-start rounded-lg py-1">
          <Image
            src="/logo.png"
            alt="SmartWaste home"
            width={60}
            height={40}
            preload
            className="h-10 w-[60px] object-contain transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
          />
        </a>

        <nav aria-label="Main" className="hidden h-full lg:block">
          <ul ref={listRef} className="relative flex h-full items-stretch">
            {NAV_ITEMS.map(({ id, label }) => {
              const current = active === id;
              return (
                <li key={id} className="flex">
                  <a
                    ref={registerLink(id)}
                    href={`#${id}`}
                    aria-current={current ? "location" : undefined}
                    style={{ paddingInline: LINK_INSET_PX }}
                    className={`flex items-center rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-offset-[-4px] ${
                      current ? "text-ink" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
            {rect && (
              <span
                className={`pointer-events-none absolute -bottom-px left-0 h-0.5 rounded-full bg-brand-600 ${
                  animate ? "transition-[transform,width] duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)]" : ""
                }`}
                style={{
                  width: rect.width - LINK_INSET_PX * 2,
                  transform: `translateX(${rect.left + LINK_INSET_PX}px)`,
                }}
                aria-hidden="true"
              />
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 justify-self-end">
          <a href="#classifier" className="group btn btn-primary hidden py-2 pr-3.5 pl-4 text-sm sm:inline-flex">
            Try Classifier
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink transition-colors duration-150 hover:bg-line/60 active:bg-line lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav id="mobile-nav" aria-label="Mobile" className="overflow-hidden" inert={!menuOpen}>
          <ul className="page-container flex flex-col gap-1 border-t border-line py-3">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const current = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={current ? "location" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      current ? "bg-brand-50 text-brand-800" : "text-ink-muted hover:bg-line/50 hover:text-ink active:bg-line"
                    }`}
                  >
                    <span
                      className={`flex size-8 items-center justify-center rounded-lg ${
                        current ? "bg-brand-600 text-white" : "bg-canvas text-ink-subtle ring-1 ring-line"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    {label}
                  </a>
                </li>
              );
            })}
            <li className="pt-1 sm:hidden">
              <a href="#classifier" className="btn btn-primary w-full py-2.5 text-sm" onClick={() => setMenuOpen(false)}>
                Try Classifier
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
