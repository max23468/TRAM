"use client";

import Link from "next/link";
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

export function TenderSideNav({ currentSection, sections, tenderId }: TenderSideNavProps) {
  const initialActiveSection = useMemo(
    () => sections.find((item) => item.route === currentSection)?.id ?? "overview",
    [currentSection, sections]
  );
  const [activeSection, setActiveSection] = useState(initialActiveSection);

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

  return (
    <div className="mt-5 flex flex-wrap gap-2 lg:flex-col">
      {sections.map((item) => (
        <Link
          key={item.id}
          className={cn(
            "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted lg:w-full",
            activeSection === item.id
              ? "border-primary bg-secondary text-secondary-foreground"
              : "border-border text-muted-foreground"
          )}
          href={getNavigationHref({
            currentSection,
            id: item.id,
            route: item.route,
            tenderId
          })}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
