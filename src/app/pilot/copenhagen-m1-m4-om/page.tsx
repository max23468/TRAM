import Link from "next/link";
import { AlertTriangle, FileText, FolderOpen, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatBytes,
  getCphPilotInventory,
  getCphPilotSummary,
  getCphTextExtract,
  getCphTextExtractSummary,
  getTopLevelFolder,
  type PilotInventoryFile
} from "@/lib/pilot-cph";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ doc?: string; folder?: string }>;
};

const statusLabels: Record<string, string> = {
  needs_ocr_check: "Testo da estrarre/verificare",
  ready_for_parser: "Pronto per parser",
  unsupported: "Formato non supportato"
};

const parserLabels: Record<string, string> = {
  docx: "DOCX",
  mpp: "MPP",
  pdf: "PDF",
  spreadsheet: "XLSX"
};

function statusVariant(status: string) {
  return status === "ready_for_parser" ? "success" : "risk";
}

function documentHref(file: PilotInventoryFile) {
  return `/pilot/copenhagen-m1-m4-om/document?id=${encodeURIComponent(file.id)}`;
}

function pageHref(params: { doc?: string; folder?: string }) {
  const searchParams = new URLSearchParams();

  if (params.folder) {
    searchParams.set("folder", params.folder);
  }

  if (params.doc) {
    searchParams.set("doc", params.doc);
  }

  const query = searchParams.toString();

  return query ? `/pilot/copenhagen-m1-m4-om?${query}` : "/pilot/copenhagen-m1-m4-om";
}

function clipText(text: string | null) {
  if (!text) {
    return null;
  }

  const normalized = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join("\n");

  return normalized.slice(0, 12000);
}

export default async function CphPilotPage({ searchParams }: PageProps) {
  const [inventory, summary, textSummary, params] = await Promise.all([
    getCphPilotInventory(),
    getCphPilotSummary(),
    getCphTextExtractSummary(),
    searchParams
  ]);

  if (!inventory || !summary) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        <TopNav />
        <section className="rounded-lg border border-border bg-card p-6">
          <Badge variant="risk">Inventario assente</Badge>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Pilot CPH non inizializzato</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Genera prima l’inventario locale del pacchetto CPH.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs">
            npm run pilot:inventory -- data/packages/copenhagen-m1-m4-om copenhagen-m1-m4-om tender_cph_m1_m4_om CPH M1/M4 O&amp;M
          </pre>
        </section>
      </main>
    );
  }

  const folder = params?.folder;
  const folders = Object.keys(summary.topLevelFolderCounts).sort((left, right) =>
    left.localeCompare(right)
  );
  const filteredFiles = folder
    ? inventory.files.filter((file) => getTopLevelFolder(file) === folder)
    : inventory.files;
  const selectedFile =
    filteredFiles.find((file) => file.id === params?.doc) ?? filteredFiles[0] ?? inventory.files[0];
  const selectedText = clipText(selectedFile ? await getCphTextExtract(selectedFile.id) : null);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <TopNav />

      <section>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Pilot reale/rappresentativo
        </p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">CPH M1/M4 O&amp;M</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Vista locale su documenti pubblici della procedura: document map, file originali e
              testo estratto dai PDF quando disponibile.
            </p>
          </div>
          <Badge variant="success">Locale</Badge>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4" aria-label="Sintesi CPH">
        <SummaryCard icon={Layers3} label="File" value={String(summary.fileCount)} />
        <SummaryCard
          icon={FileText}
          label="PDF"
          value={String(summary.extensionCounts[".pdf"] ?? 0)}
        />
        <SummaryCard
          icon={FolderOpen}
          label="Cartelle"
          value={String(Object.keys(summary.topLevelFolderCounts).length)}
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Testi PDF"
          value={`${textSummary?.extractedCount ?? 0}/${summary.extensionCounts[".pdf"] ?? 0}`}
        />
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap gap-2">
          <Link
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              !folder ? "border-primary bg-secondary text-secondary-foreground" : "border-border"
            )}
            href={pageHref({})}
          >
            Tutti
          </Link>
          {folders.map((folderName) => (
            <Link
              key={folderName}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                folder === folderName
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border"
              )}
              href={pageHref({ folder: folderName })}
            >
              {folderName} ({summary.topLevelFolderCounts[folderName]})
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="text-base font-semibold">Document map reale</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {filteredFiles.length} file mostrati. Seleziona un documento per vedere fonte,
              link e testo estratto.
            </p>
          </div>

          <div className="divide-y divide-border">
            {filteredFiles.map((file) => (
              <Link
                key={file.id}
                className={cn(
                  "grid gap-3 px-4 py-4 transition-colors hover:bg-muted lg:grid-cols-[minmax(0,1fr)_auto]",
                  file.id === selectedFile?.id ? "bg-muted" : ""
                )}
                href={pageHref({ doc: file.id, folder })}
              >
                <span>
                  <span className="block text-sm font-medium">{file.fileName}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {getTopLevelFolder(file)} · {formatBytes(file.sizeBytes)}
                  </span>
                </span>
                <span className="flex flex-wrap gap-2 lg:justify-end">
                  <Badge variant="muted">{parserLabels[file.parserKind] ?? file.parserKind}</Badge>
                  <Badge variant={statusVariant(file.status)}>
                    {statusLabels[file.status] ?? file.status}
                  </Badge>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 xl:sticky xl:top-6 xl:self-start">
          {selectedFile ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    Documento selezionato
                  </p>
                  <h2 className="mt-1 text-lg font-semibold leading-6">
                    {selectedFile.fileName}
                  </h2>
                </div>
                <Badge variant={statusVariant(selectedFile.status)}>
                  {statusLabels[selectedFile.status] ?? selectedFile.status}
                </Badge>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <InfoRow label="Cartella" value={getTopLevelFolder(selectedFile)} />
                <InfoRow label="Formato" value={parserLabels[selectedFile.parserKind] ?? selectedFile.parserKind} />
                <InfoRow label="Dimensione" value={formatBytes(selectedFile.sizeBytes)} />
                <InfoRow label="Hash" value={selectedFile.sha256.slice(0, 16)} />
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  className="rounded-md border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  href={documentHref(selectedFile)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Apri documento originale
                </a>
                <a
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  href={documentHref(selectedFile)}
                  download={selectedFile.fileName}
                >
                  Scarica copia locale
                </a>
              </div>

              <section className="mt-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">Testo estratto</h3>
                  <Badge variant={selectedText ? "success" : "muted"}>
                    {selectedText ? "Disponibile" : "Non disponibile"}
                  </Badge>
                </div>
                {selectedText ? (
                  <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-3 text-xs leading-5">
                    {selectedText}
                  </pre>
                ) : (
                  <p className="mt-3 rounded-md border border-border bg-muted p-3 text-sm leading-6 text-muted-foreground">
                    Nessun testo estratto per questo formato. Per i PDF, rigenera con
                    `npm run pilot:extract-text -- copenhagen-m1-m4-om`.
                  </p>
                )}
              </section>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Nessun documento disponibile.</p>
          )}
        </aside>
      </section>
    </main>
  );
}

function TopNav() {
  return (
    <nav className="flex items-center justify-between border-b border-border pb-4">
      <Link className="text-sm font-medium text-muted-foreground" href="/tenders">
        TRAM
      </Link>
      <Link className="text-sm font-medium text-primary hover:underline" href="/tenders">
        Torna ai Tender
      </Link>
    </nav>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ "aria-hidden": true; size: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
        <Icon aria-hidden={true} className="text-primary" size={18} />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium">{value}</dd>
    </div>
  );
}
