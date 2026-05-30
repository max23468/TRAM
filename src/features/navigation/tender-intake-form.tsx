"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  FolderOpen,
  Loader2,
  RotateCcw,
  Save,
  ShieldCheck,
  UploadCloud
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { demoTendersHref } from "./tender-workspace-config";
import { WorkspaceKicker, WorkspacePanel } from "./tender-workspace-primitives";

const STORAGE_KEY = "tram:tender-intake-draft:v1";
const STORAGE_EVENT = "tram:tender-intake-draft-updated";

type IntakeDraft = {
  authority: string;
  city: string;
  documentsChecked: boolean;
  firstDeadlinesChecked: boolean;
  name: string;
  notes: string;
  owner: string;
  packageReference: string;
  privacy: string;
  sourcePolicyChecked: boolean;
  stage: string;
  updatedAt: string;
};

type UpdateDraft = <Value extends keyof IntakeDraft>(key: Value, value: IntakeDraft[Value]) => void;

const initialDraft: IntakeDraft = {
  authority: "",
  city: "",
  documentsChecked: false,
  firstDeadlinesChecked: false,
  name: "",
  notes: "",
  owner: "",
  packageReference: "",
  privacy: "Uso interno",
  sourcePolicyChecked: false,
  stage: "Gara",
  updatedAt: ""
};

const stageOptions = ["Prequalifica", "Gara", "Negoziazione", "Addendum"];
const privacyOptions = ["Documenti pubblici", "Uso interno", "Accesso ristretto"];

function parseDraft(raw: string | null): IntakeDraft {
  try {
    if (!raw) {
      return initialDraft;
    }

    return { ...initialDraft, ...JSON.parse(raw) } as IntakeDraft;
  } catch {
    return initialDraft;
  }
}

function getDraftSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function subscribeToDraft(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function emitDraftChange() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function useStoredDraft() {
  const snapshot = useSyncExternalStore(subscribeToDraft, getDraftSnapshot, () => "");

  return parseDraft(snapshot);
}

function storeDraft(draft: IntakeDraft) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  emitDraftChange();
}

function clearDraft() {
  window.localStorage.removeItem(STORAGE_KEY);
  emitDraftChange();
}

function getDraftScore(draft: IntakeDraft) {
  const checks = [
    draft.name.trim(),
    draft.authority.trim(),
    draft.stage.trim(),
    draft.owner.trim(),
    draft.privacy.trim(),
    draft.packageReference.trim(),
    draft.documentsChecked,
    draft.sourcePolicyChecked,
    draft.firstDeadlinesChecked
  ];

  return checks.filter(Boolean).length;
}

const savedAtFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "short",
  timeStyle: "short"
});

function formatSavedAt(value: string) {
  if (!value) {
    return "Non ancora salvata";
  }

  return savedAtFormatter.format(new Date(value));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 102.4) / 10} KB`;
  }

  return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
}

export function TenderIntakeForm() {
  const draft = useStoredDraft();
  const [files, setFiles] = useState<File[]>([]);
  const [manualSaveLabel, setManualSaveLabel] = useState("Salva bozza");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileCount = files.length;
  const totalFileSize = files.reduce((total, file) => total + file.size, 0);
  const score = getDraftScore({
    ...draft,
    documentsChecked: fileCount > 0 || draft.documentsChecked,
    firstDeadlinesChecked: fileCount > 0 || draft.firstDeadlinesChecked
  });
  const progressLabel = `${score}/9`;
  const canOpenWork = score >= 7 && fileCount > 0;
  const canCreateTender = draft.name.trim().length > 0 && fileCount > 0 && !isSubmitting;

  function updateDraft<Value extends keyof IntakeDraft>(key: Value, value: IntakeDraft[Value]) {
    storeDraft({
      ...draft,
      [key]: value,
      updatedAt: new Date().toISOString()
    });
    setManualSaveLabel("Salva bozza");
  }

  function handleManualSave() {
    const nextDraft = { ...draft, updatedAt: new Date().toISOString() };
    storeDraft(nextDraft);
    setManualSaveLabel("Bozza salvata");
  }

  function handleReset() {
    clearDraft();
    setFiles([]);
    setSubmitError("");
    setManualSaveLabel("Salva bozza");
  }

  async function handleCreateTender() {
    if (!canCreateTender) {
      setSubmitError("Inserisci almeno nome gara e un documento prima di creare il workspace.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const formData = new FormData();
    formData.set("authority", draft.authority);
    formData.set("city", draft.city);
    formData.set("name", draft.name);
    formData.set("notes", draft.notes);
    formData.set("owner", draft.owner);
    formData.set("packageReference", draft.packageReference);
    formData.set("privacy", draft.privacy);
    formData.set("stage", draft.stage);

    for (const file of files) {
      formData.append("documents", file);
    }

    try {
      const response = await fetch("/api/local-tenders", {
        body: formData,
        method: "POST"
      });
      const payload = (await response.json()) as { tenderId?: string; error?: string };

      if (!response.ok || !payload.tenderId) {
        throw new Error(payload.error ?? "Creazione gara non riuscita.");
      }

      clearDraft();
      window.location.assign(`/tenders/${payload.tenderId}/overview`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Creazione gara non riuscita.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-5">
        <TenderDetailsPanel
          canOpenWork={canOpenWork}
          draft={draft}
          score={score}
          updateDraft={updateDraft}
        />
        <DocumentPackagePanel
          draft={draft}
          fileCount={fileCount}
          files={files}
          setFiles={setFiles}
          setSubmitError={setSubmitError}
          totalFileSize={totalFileSize}
          updateDraft={updateDraft}
        />
        <NotesPanel draft={draft} updateDraft={updateDraft} />
      </div>

      <IntakeSidebar
        canCreateTender={canCreateTender}
        canOpenWork={canOpenWork}
        draft={draft}
        fileCount={fileCount}
        handleCreateTender={handleCreateTender}
        handleManualSave={handleManualSave}
        handleReset={handleReset}
        isSubmitting={isSubmitting}
        manualSaveLabel={manualSaveLabel}
        progressLabel={progressLabel}
        score={score}
        submitError={submitError}
      />
    </section>
  );
}

function TenderDetailsPanel({
  canOpenWork,
  draft,
  score,
  updateDraft
}: {
  canOpenWork: boolean;
  draft: IntakeDraft;
  score: number;
  updateDraft: UpdateDraft;
}) {
  return (
    <WorkspacePanel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <WorkspaceKicker>Anagrafica</WorkspaceKicker>
          <h2 className="mt-1 text-lg font-semibold">Dati minimi gara</h2>
        </div>
        <DraftStatusBadge canOpenWork={canOpenWork} score={score} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextField
          label="Nome gara"
          onChange={(value) => updateDraft("name", value)}
          placeholder="Es. Metro Copenhagen M1/M4"
          value={draft.name}
        />
        <TextField
          label="Ente o committente"
          onChange={(value) => updateDraft("authority", value)}
          placeholder="Es. Metroselskabet"
          value={draft.authority}
        />
        <TextField
          label="Città o area"
          onChange={(value) => updateDraft("city", value)}
          placeholder="Es. Copenhagen"
          value={draft.city}
        />
        <TextField
          label="Responsabile interno"
          onChange={(value) => updateDraft("owner", value)}
          placeholder="Nome o team"
          value={draft.owner}
        />
        <SelectField
          label="Fase"
          onChange={(value) => updateDraft("stage", value)}
          options={stageOptions}
          value={draft.stage}
        />
        <SelectField
          label="Regole dati"
          onChange={(value) => updateDraft("privacy", value)}
          options={privacyOptions}
          value={draft.privacy}
        />
      </div>
    </WorkspacePanel>
  );
}

function DraftStatusBadge({ canOpenWork, score }: { canOpenWork: boolean; score: number }) {
  if (canOpenWork) {
    return <Badge variant="success">Pronta per il primo controllo</Badge>;
  }

  if (score >= 4) {
    return <Badge variant="default">In preparazione</Badge>;
  }

  return <Badge variant="muted">Da completare</Badge>;
}

function DocumentPackagePanel({
  draft,
  fileCount,
  files,
  setFiles,
  setSubmitError,
  totalFileSize,
  updateDraft
}: {
  draft: IntakeDraft;
  fileCount: number;
  files: File[];
  setFiles: (files: File[]) => void;
  setSubmitError: (error: string) => void;
  totalFileSize: number;
  updateDraft: UpdateDraft;
}) {
  return (
    <WorkspacePanel>
      <WorkspaceKicker>Pacchetto documenti</WorkspaceKicker>
      <h2 className="mt-1 text-lg font-semibold">Documenti da inventariare</h2>
      <div className="mt-5">
        <TextField
          label="Cartella, drive o codice pacchetto"
          onChange={(value) => updateDraft("packageReference", value)}
          placeholder="Es. SharePoint/Gare/2026/Copenhagen"
          value={draft.packageReference}
        />
      </div>
      <label className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted px-4 py-6 text-center transition-colors hover:bg-card active:scale-[0.99]">
        <UploadCloud aria-hidden="true" className="text-primary" size={26} />
        <span className="mt-3 text-sm font-semibold">Seleziona documenti</span>
        <span className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
          I file vengono inviati solo al server locale TRAM, salvati fuori dal repo e usati per
          creare inventario, hash e controlli iniziali.
        </span>
        <input
          aria-label="Seleziona documenti"
          className="sr-only"
          multiple
          onChange={(event) => {
            const nextFiles = Array.from(event.target.files ?? []);
            setFiles(nextFiles);
            updateDraft("documentsChecked", nextFiles.length > 0);
            setSubmitError("");
          }}
          type="file"
        />
      </label>
      <SelectedFilesSummary fileCount={fileCount} files={files} totalFileSize={totalFileSize} />
      <DocumentChecklist draft={draft} fileCount={fileCount} updateDraft={updateDraft} />
    </WorkspacePanel>
  );
}

function SelectedFilesSummary({
  fileCount,
  files,
  totalFileSize
}: {
  fileCount: number;
  files: File[];
  totalFileSize: number;
}) {
  if (fileCount === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md border border-border bg-background p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium">{fileCount} file selezionati</span>
        <span className="text-muted-foreground">{formatBytes(totalFileSize)}</span>
      </div>
      <ul className="mt-3 grid max-h-36 gap-2 overflow-auto text-sm text-muted-foreground">
        {files.slice(0, 8).map((file) => (
          <li key={`${file.name}-${file.size}`} className="truncate">
            {file.name}
          </li>
        ))}
        {files.length > 8 ? <li>{files.length - 8} altri file…</li> : null}
      </ul>
    </div>
  );
}

function DocumentChecklist({
  draft,
  fileCount,
  updateDraft
}: {
  draft: IntakeDraft;
  fileCount: number;
  updateDraft: UpdateDraft;
}) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <CheckTile
        checked={fileCount > 0 || draft.documentsChecked}
        icon={FolderOpen}
        label="Inventario documenti"
        onChange={(checked) => updateDraft("documentsChecked", checked)}
      />
      <CheckTile
        checked={draft.sourcePolicyChecked}
        icon={ShieldCheck}
        label="Regole fonti"
        onChange={(checked) => updateDraft("sourcePolicyChecked", checked)}
      />
      <CheckTile
        checked={draft.firstDeadlinesChecked}
        icon={ClipboardCheck}
        label="Prime scadenze"
        onChange={(checked) => updateDraft("firstDeadlinesChecked", checked)}
      />
    </div>
  );
}

function NotesPanel({ draft, updateDraft }: { draft: IntakeDraft; updateDraft: UpdateDraft }) {
  return (
    <WorkspacePanel>
      <WorkspaceKicker>Note operative</WorkspaceKicker>
      <h2 className="mt-1 text-lg font-semibold">Punti da ricordare</h2>
      <textarea
        aria-label="Note operative"
        className="mt-4 min-h-32 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => updateDraft("notes", event.target.value)}
        placeholder="Scadenze dubbie, documenti mancanti, vincoli di riservatezza, domande già emerse."
        value={draft.notes}
      />
    </WorkspacePanel>
  );
}

function IntakeSidebar({
  canCreateTender,
  canOpenWork,
  draft,
  fileCount,
  handleCreateTender,
  handleManualSave,
  handleReset,
  isSubmitting,
  manualSaveLabel,
  progressLabel,
  score,
  submitError
}: {
  canCreateTender: boolean;
  canOpenWork: boolean;
  draft: IntakeDraft;
  fileCount: number;
  handleCreateTender: () => void;
  handleManualSave: () => void;
  handleReset: () => void;
  isSubmitting: boolean;
  manualSaveLabel: string;
  progressLabel: string;
  score: number;
  submitError: string;
}) {
  return (
    <aside className="grid gap-5 xl:sticky xl:top-6 xl:self-start">
      <DraftProgressPanel
        canCreateTender={canCreateTender}
        canOpenWork={canOpenWork}
        draft={draft}
        fileCount={fileCount}
        handleCreateTender={handleCreateTender}
        handleManualSave={handleManualSave}
        handleReset={handleReset}
        isSubmitting={isSubmitting}
        manualSaveLabel={manualSaveLabel}
        progressLabel={progressLabel}
        score={score}
        submitError={submitError}
      />
      <NextStepPanel />
    </aside>
  );
}

function DraftProgressPanel({
  canCreateTender,
  canOpenWork,
  draft,
  fileCount,
  handleCreateTender,
  handleManualSave,
  handleReset,
  isSubmitting,
  manualSaveLabel,
  progressLabel,
  score,
  submitError
}: {
  canCreateTender: boolean;
  canOpenWork: boolean;
  draft: IntakeDraft;
  fileCount: number;
  handleCreateTender: () => void;
  handleManualSave: () => void;
  handleReset: () => void;
  isSubmitting: boolean;
  manualSaveLabel: string;
  progressLabel: string;
  score: number;
  submitError: string;
}) {
  return (
    <WorkspacePanel>
      <WorkspaceKicker>Preparazione</WorkspaceKicker>
      <h2 className="mt-1 text-lg font-semibold">Stato bozza</h2>
      <div className="mt-4 rounded-md border border-border bg-muted p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Completamento</span>
          <span className="text-2xl font-semibold tabular-nums">{progressLabel}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${Math.round((score / 9) * 100)}%` }}
          />
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <InfoRow label="Ultimo salvataggio" value={formatSavedAt(draft.updatedAt)} />
        <InfoRow label="Regole dati" value={draft.privacy} />
        <InfoRow label="Documenti selezionati" value={fileCount > 0 ? `${fileCount} file` : "Nessuno"} />
        <InfoRow label="Stato" value={canOpenWork ? "Pronta" : "In preparazione"} />
      </dl>

      <div className="mt-5 grid gap-2">
        <button
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
          disabled={!canCreateTender}
          onClick={handleCreateTender}
          type="button"
        >
          {isSubmitting ? <Loader2 aria-hidden="true" className="animate-spin" size={16} /> : <UploadCloud aria-hidden="true" size={16} />}
          Crea gara locale
        </button>
        <button
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          onClick={handleManualSave}
          type="button"
        >
          <Save aria-hidden="true" size={16} />
          {manualSaveLabel}
        </button>
        <button
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          onClick={handleReset}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={16} />
          Pulisci bozza
        </button>
      </div>
      {submitError ? (
        <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm leading-5 text-amber-950">
          {submitError}
        </p>
      ) : null}
    </WorkspacePanel>
  );
}

function NextStepPanel() {
  return (
    <WorkspacePanel>
      <WorkspaceKicker>Prossimo passo</WorkspaceKicker>
      <h2 className="mt-1 text-lg font-semibold">Dopo la creazione</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        TRAM crea una gara locale, salva i documenti fuori dal repository e apre subito il quadro
        gara con inventario, controlli iniziali e registro.
      </p>
      <div className="mt-5 grid gap-2">
        <Link className={cn(buttonVariants({ variant: "default" }), "w-full")} href="/tenders">
          <FileText aria-hidden="true" size={16} />
          Apri gare
        </Link>
        <Link className={cn(buttonVariants({ variant: "secondary" }), "w-full")} href={demoTendersHref}>
          Apri dati dimostrativi
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </WorkspacePanel>
  );
}

function TextField({
  label,
  onChange,
  placeholder,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <input
        aria-label={label}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <select
        aria-label={label}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckTile({
  checked,
  icon: Icon,
  label,
  onChange
}: {
  checked: boolean;
  icon: LucideIcon;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-24 cursor-pointer flex-col justify-between rounded-md border p-3 text-sm transition-colors active:scale-95",
        checked ? "border-emerald-300 bg-emerald-50 text-emerald-950" : "border-border bg-muted"
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <Icon aria-hidden="true" size={17} />
        <input
          aria-label={label}
          checked={checked}
          className="size-4 accent-[color:var(--primary)]"
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
      </span>
      <span className="font-medium">{label}</span>
    </label>
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
