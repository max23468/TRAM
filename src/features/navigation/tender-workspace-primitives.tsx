import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "./tender-workspace-config";

type IconComponent = ComponentType<{
  "aria-hidden": true;
  className?: string;
  size: number;
}>;

export function WorkspaceMetricCard({
  className,
  detail,
  href,
  icon: Icon,
  label,
  tone = "default",
  value
}: {
  className?: string;
  detail?: string;
  href?: string;
  icon: IconComponent | LucideIcon;
  label: string;
  tone?: "default" | "attention" | "risk" | "success";
  value: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md border",
            tone === "risk"
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : tone === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-primary/20 bg-secondary text-primary"
          )}
        >
          <Icon aria-hidden={true} size={16} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold leading-8 tabular-nums">{value}</p>
      {detail ? <p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p> : null}
    </>
  );
  const classNameValue = cn(
    "rounded-md border bg-card p-4 shadow-[var(--shadow-card)] transition-colors",
    tone === "risk" ? "border-amber-300" : "border-border",
    tone === "attention" ? "bg-secondary" : "",
    tone === "success" ? "border-emerald-300" : "",
    href ? "hover:bg-muted active:scale-95" : "",
    className
  );

  if (href) {
    return (
      <Link className={classNameValue} href={href}>
        {content}
      </Link>
    );
  }

  return <div className={classNameValue}>{content}</div>;
}

export function WorkspacePanel({
  children,
  className,
  id
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]", className)}
    >
      {children}
    </section>
  );
}

export function WorkspaceKicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase text-muted-foreground">
      {children}
    </p>
  );
}

export function InspectorInfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium">{value}</dd>
    </div>
  );
}

export function SourceInspectorPanel({
  actions,
  badgeLabel,
  badgeVariant = "muted",
  children,
  className,
  excerpt,
  eyebrow = "Fonte aperta",
  rows,
  title
}: {
  actions?: ReactNode;
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
  children?: ReactNode;
  className?: string;
  excerpt?: ReactNode;
  eyebrow?: string;
  rows: Array<{ label: string; value: ReactNode }>;
  title: ReactNode;
}) {
  return (
    <aside className={cn("rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] xl:sticky xl:top-6 xl:self-start", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <WorkspaceKicker>{eyebrow}</WorkspaceKicker>
          <h2 className="mt-1 text-lg font-semibold leading-6 tracking-tight">{title}</h2>
        </div>
        {badgeLabel ? <Badge variant={badgeVariant}>{badgeLabel}</Badge> : null}
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        {rows.map((row) => (
          <InspectorInfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>

      {excerpt ? (
        <blockquote className="mt-4 rounded-md border border-border bg-muted p-3 text-sm leading-6 text-muted-foreground">
          {excerpt}
        </blockquote>
      ) : null}

      {actions ? <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">{actions}</div> : null}
      {children}
    </aside>
  );
}

export type RouteStatusItem = {
  badge: string;
  badgeVariant: BadgeVariant;
  href: string;
  label: string;
  value: string;
};

export function RouteStatusGrid({ items }: { items: RouteStatusItem[] }) {
  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.label}
          className="rounded-md border border-border bg-card p-3 shadow-[var(--shadow-card)] transition-colors hover:bg-muted active:scale-95"
          href={item.href}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold">{item.label}</p>
            <Badge variant={item.badgeVariant}>{item.badge}</Badge>
          </div>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">{item.value}</p>
        </Link>
      ))}
    </div>
  );
}
