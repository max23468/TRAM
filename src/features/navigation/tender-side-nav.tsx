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
        "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted",
        activeSection === item.id
          ? "border-primary bg-secondary text-secondary-foreground"
          : "border-border text-muted-foreground",
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
        className="mt-5 inline-flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted lg:hidden"
        type="button"
        aria-expanded={isDrawerOpen}
        aria-controls="tender-mobile-sections"
        onClick={() => setIsDrawerOpen(true)}
      >
        <span className="inline-flex items-center gap-2">
          <Menu aria-hidden="true" size={16} />
          Sezioni
        </span>
        <span className="text-xs text-muted-foreground">{currentLabel}</span>
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
            className="relative flex h-full w-[min(320px,calc(100%-32px))] flex-col border-r border-border bg-card p-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Sezioni</p>
                <p className="mt-1 text-base font-semibold">{currentLabel}</p>
              </div>
              <button
                className="inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                type="button"
                aria-label="Chiudi navigazione sezioni"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>

            <nav className="mt-4 grid gap-2" aria-label="Sezioni tender">
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

      <nav className="mt-5 hidden gap-2 lg:flex lg:flex-col" aria-label="Sezioni tender">
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
