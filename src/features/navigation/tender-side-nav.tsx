"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TenderNavSection = {
  id: string;
  route: string;
  label: string;
};

type TenderSideNavProps = {
  currentSection: string;
  sections: readonly TenderNavSection[];
  tenderId: string;
};

function getNavigationHref({
  currentSection,
  id,
  route,
  tenderId
}: {
  currentSection: string;
  id: string;
  route: string;
  tenderId: string;
}) {
  if (currentSection === "overview" && id === "overview") {
    return `#${id}`;
  }

  return `/tenders/${tenderId}/${route}`;
}

function TenderSideNavLinks({
  activeSection,
  className,
  currentSection,
  onNavigate,
  sections,
  tenderId
}: {
  activeSection: string;
  className?: string;
  currentSection: string;
  onNavigate: () => void;
  sections: readonly TenderNavSection[];
  tenderId: string;
}) {
  return sections.map((item) => (
    <Link
      key={item.id}
      className={cn(
        "group relative min-h-10 rounded-md px-3 py-2 pl-9 text-sm font-medium transition-colors active:scale-95",
        activeSection === item.id
          ? "bg-white/[0.10] text-white"
          : "text-[color:var(--sidebar-muted)] hover:bg-white/[0.06] hover:text-white",
        className
      )}
      href={getNavigationHref({
        currentSection,
        id: item.id,
        route: item.route,
        tenderId
      })}
      onClick={onNavigate}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-3 top-1/2 size-3 -translate-y-1/2 rounded-full border border-current bg-[color:var(--sidebar)]",
          activeSection === item.id ? "text-primary" : "text-[color:var(--sidebar-muted)]"
        )}
      />
      {item.label}
    </Link>
  ));
}

export function TenderSideNav({ currentSection, sections, tenderId }: TenderSideNavProps) {
  const initialActiveSection = useMemo(
    () => sections.find((item) => item.route === currentSection)?.id ?? "overview",
    [currentSection, sections]
  );
  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentLabel =
    sections.find((item) => item.id === activeSection || item.route === currentSection)?.label ??
    "Sezioni";

  useEffect(() => {
    if (currentSection !== "overview") {
      return;
    }

    const sectionIds = sections.map((item) => item.id);
    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;
      const current = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          return element ? { id, top: element.getBoundingClientRect().top } : null;
        })
        .filter((item): item is { id: string; top: number } => item !== null)
        .reduce(
          (closest, item) => {
            if (item.top <= 140 && item.top > closest.top) {
              return item;
            }

            return closest;
          },
          { id: "overview", top: Number.NEGATIVE_INFINITY }
        );

      setActiveSection(current.id);
    };

    const requestUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentSection, initialActiveSection, sections]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen]);

  return (
    <>
      <button
        className="mt-5 inline-flex h-10 w-full items-center justify-between rounded-md border border-[color:var(--sidebar-border)] bg-white/[0.06] px-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.10] active:scale-95 lg:hidden"
        type="button"
        aria-expanded={isDrawerOpen}
        aria-controls="tender-mobile-sections"
        onClick={() => setIsDrawerOpen(true)}
      >
        <span className="inline-flex items-center gap-2">
          <Menu aria-hidden="true" size={16} />
          Sezioni
        </span>
        <span className="text-xs text-[color:var(--sidebar-muted)]">{currentLabel}</span>
      </button>

      {isDrawerOpen ? (
        <dialog
          aria-modal="true"
          className="fixed inset-0 z-50 m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0 lg:hidden"
          open
        >
          <button
            className="absolute inset-0 bg-foreground/25"
            type="button"
            aria-label="Chiudi navigazione sezioni"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside
            id="tender-mobile-sections"
            className="relative flex h-full w-[min(320px,calc(100%-32px))] flex-col border-r border-[color:var(--sidebar-border)] bg-[color:var(--sidebar)] p-4 text-white shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[color:var(--sidebar-border)] pb-4">
              <div>
                <p className="text-xs font-medium uppercase text-[color:var(--sidebar-muted)]">Sezioni</p>
                <p className="mt-1 text-base font-semibold">{currentLabel}</p>
              </div>
              <button
                className="inline-flex size-9 items-center justify-center rounded-md border border-[color:var(--sidebar-border)] transition-colors hover:bg-white/[0.08] active:scale-95"
                type="button"
                aria-label="Chiudi navigazione sezioni"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>

            <nav className="mt-4 grid gap-1" aria-label="Sezioni gara">
              <TenderSideNavLinks
                activeSection={activeSection}
                className="w-full py-2 text-sm"
                currentSection={currentSection}
                onNavigate={() => setIsDrawerOpen(false)}
                sections={sections}
                tenderId={tenderId}
              />
            </nav>
          </aside>
        </dialog>
      ) : null}

      <nav className="relative mt-5 hidden gap-1 lg:flex lg:flex-col" aria-label="Sezioni gara">
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-[18px] top-4 w-px bg-[color:var(--sidebar-border)]"
        />
        <TenderSideNavLinks
          activeSection={activeSection}
          className="lg:w-full"
          currentSection={currentSection}
          onNavigate={() => setIsDrawerOpen(false)}
          sections={sections}
          tenderId={tenderId}
        />
      </nav>
    </>
  );
}
