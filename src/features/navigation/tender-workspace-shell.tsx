import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TenderSideNav } from "./tender-side-nav";
import type { TenderNavigationSection } from "./tender-workspace-config";

export function TenderWorkspaceShell({
  children,
  className,
  currentSection,
  description,
  headerBadges,
  productHref = "/tenders",
  productLabel = "TRAM",
  sectionEyebrow,
  sections,
  sidebarBadges,
  sidebarContent,
  sidebarEyebrow = "Gara",
  sidebarSubtitle,
  sidebarTitle,
  statusLabel = "TRAM",
  statusVariant = "muted",
  tenderId,
  title,
  topActions
}: {
  children: ReactNode;
  className?: string;
  currentSection?: string;
  description: string;
  headerBadges?: ReactNode;
  productHref?: string;
  productLabel?: string;
  sectionEyebrow: string;
  sections?: readonly TenderNavigationSection[];
  sidebarBadges?: ReactNode;
  sidebarContent?: ReactNode;
  sidebarEyebrow?: string;
  sidebarSubtitle?: string;
  sidebarTitle: string;
  statusLabel?: string;
  statusVariant?: "default" | "muted" | "risk" | "success";
  tenderId?: string;
  title: string;
  topActions?: ReactNode;
}) {
  const shouldRenderTenderNav = tenderId && currentSection && sections;

  return (
    <main className={cn("min-h-screen bg-background px-2 py-2 sm:px-4 sm:py-4", className)}>
      <div className="mx-auto grid min-h-[calc(100vh-16px)] w-full max-w-[1480px] overflow-hidden rounded-xl border border-[color:var(--frame-border)] bg-[color:var(--workspace)] shadow-[var(--shadow-frame)] lg:min-h-[calc(100vh-32px)] lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="flex min-h-full flex-col bg-[color:var(--sidebar)] p-4 text-[color:var(--sidebar-text)] sm:p-5">
          <div className="flex items-center gap-3">
            <Link
              className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[color:var(--sidebar-border)] bg-white/[0.08] font-semibold tracking-tight text-white transition-transform active:scale-95"
              href={productHref}
              aria-label={productLabel}
            >
              T
            </Link>
            <div className="min-w-0">
              <Link className="block text-base font-semibold leading-5 text-white" href={productHref}>
                {productLabel}
              </Link>
              <p className="mt-1 text-xs leading-4 text-[color:var(--sidebar-muted)]">
                Analisi gare TPL
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-[color:var(--sidebar-border)] bg-white/[0.06] p-4">
            <p className="text-[11px] font-medium uppercase text-[color:var(--sidebar-muted)]">
              {sidebarEyebrow}
            </p>
            <h2 className="mt-2 text-base font-semibold leading-6 text-white">{sidebarTitle}</h2>
            {sidebarSubtitle ? (
              <p className="mt-2 text-sm leading-5 text-[color:var(--sidebar-muted)]">
                {sidebarSubtitle}
              </p>
            ) : null}
            {sidebarBadges ? <div className="mt-4 flex flex-wrap gap-2">{sidebarBadges}</div> : null}
          </div>

          {shouldRenderTenderNav ? (
            <TenderSideNav
              key={currentSection}
              currentSection={currentSection}
              sections={sections}
              tenderId={tenderId}
            />
          ) : null}

          {sidebarContent ? (
            <div className="mt-5 rounded-md border border-[color:var(--sidebar-border)] bg-white/[0.04] p-3">
              {sidebarContent}
            </div>
          ) : null}
        </aside>

        <section className="flex min-w-0 flex-col">
          <nav className="flex min-h-14 items-center justify-between gap-3 border-b border-border bg-card/80 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium uppercase text-muted-foreground">
                {sectionEyebrow}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {topActions}
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <section id={currentSection === "overview" ? "overview" : undefined} className="scroll-mt-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
                {headerBadges ? (
                  <div className="flex max-w-full flex-wrap justify-start gap-2 lg:justify-end">
                    {headerBadges}
                  </div>
                ) : null}
              </div>
            </section>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
