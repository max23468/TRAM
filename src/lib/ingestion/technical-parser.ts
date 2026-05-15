import type {
  ContentSignature,
  IngestionFileRecord,
  ParserIssue,
  ParserKind,
  TechnicalParseResult,
  TechnicalParseStatus
} from "./types";

const compoundBinaryMagic = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

function startsWithBytes(body: Uint8Array, expected: number[]) {
  return expected.every((byte, index) => body[index] === byte);
}

function startsWithText(body: Uint8Array, expected: string) {
  return new TextDecoder().decode(body.slice(0, expected.length)) === expected;
}

function isMostlyText(body: Uint8Array) {
  if (body.length === 0) {
    return false;
  }

  const sample = body.slice(0, Math.min(body.length, 2048));
  const printable = sample.filter((byte) => byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte <= 126));

  return printable.length / sample.length > 0.9;
}

function sniffSignature(body: Uint8Array): ContentSignature {
  if (body.length === 0) {
    return "empty";
  }

  if (startsWithText(body, "%PDF")) {
    return "pdf";
  }

  if (startsWithText(body, "PK")) {
    return "zip_office";
  }

  if (startsWithBytes(body, compoundBinaryMagic)) {
    return "compound_binary";
  }

  if (isMostlyText(body)) {
    return "text";
  }

  return "unknown";
}

function countPdfPages(body: Uint8Array) {
  const text = new TextDecoder("latin1").decode(body);
  const matches = text.match(/\/Type\s*\/Page\b/g);

  return matches?.length ?? 0;
}

function countLines(body: Uint8Array) {
  const text = new TextDecoder().decode(body);

  if (text.length === 0) {
    return 0;
  }

  return text.split(/\r\n|\r|\n/).length;
}

function expectedSignature(parserKind: ParserKind): ContentSignature[] {
  if (parserKind === "pdf") {
    return ["pdf"];
  }

  if (parserKind === "docx" || parserKind === "spreadsheet") {
    return ["zip_office"];
  }

  if (parserKind === "legacy_spreadsheet" || parserKind === "mpp") {
    return ["compound_binary"];
  }

  if (parserKind === "text") {
    return ["text"];
  }

  return [];
}

function getStatus({
  issues,
  parserKind,
  signature
}: {
  issues: ParserIssue[];
  parserKind: ParserKind;
  signature: ContentSignature;
}): TechnicalParseStatus {
  if (issues.some((issue) => issue.severity === "blocking")) {
    return "blocked";
  }

  if (parserKind === "unknown") {
    return "unsupported";
  }

  if (parserKind === "pdf" && signature === "pdf") {
    return "needs_ocr_check";
  }

  return "metadata_extracted";
}

export function parseTechnicalMetadata({
  body,
  file
}: {
  body: Uint8Array;
  file: IngestionFileRecord;
}): TechnicalParseResult {
  const signature = sniffSignature(body);
  const issues = [...file.issues];
  const expected = expectedSignature(file.parserKind);

  if (signature === "empty") {
    issues.push({
      code: "empty_file",
      message: "File vuoto: nessun metadato tecnico estraibile.",
      severity: "blocking"
    });
  }

  if (expected.length > 0 && !expected.includes(signature)) {
    issues.push({
      code: "invalid_file_signature",
      message: "La firma del file non combacia con l’estensione dichiarata.",
      severity: "blocking"
    });
  }

  if (file.parserKind === "unknown") {
    issues.push({
      code: "unsupported_extension",
      message: "Nessun parser tecnico disponibile per questo formato.",
      severity: "blocking"
    });
  }

  if (["docx", "spreadsheet", "legacy_spreadsheet", "mpp"].includes(file.parserKind)) {
    issues.push({
      code: "parser_metadata_limited",
      message: "Parser tecnico limitato al riconoscimento del container in questa slice.",
      severity: "info"
    });
  }

  const result: TechnicalParseResult = {
    fileId: file.id,
    fileName: file.fileName,
    parserKind: file.parserKind,
    status: getStatus({ issues, parserKind: file.parserKind, signature }),
    contentSignature: signature,
    issues
  };

  if (signature === "pdf") {
    result.pageCount = countPdfPages(body);
  }

  if (file.parserKind === "text" && signature === "text") {
    result.lineCount = countLines(body);
  }

  if (signature === "zip_office") {
    result.containerKind = "zip";
  }

  if (signature === "compound_binary") {
    result.containerKind = "compound_binary";
  }

  return result;
}
