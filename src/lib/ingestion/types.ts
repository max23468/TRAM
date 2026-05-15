export type IngestionFileStatus =
  | "ready_for_parser"
  | "needs_ocr_check"
  | "unsupported"
  | "empty_file"
  | "blocked";

export type ParserKind =
  | "pdf"
  | "docx"
  | "spreadsheet"
  | "legacy_spreadsheet"
  | "mpp"
  | "text"
  | "unknown";

export type ParserIssueCode =
  | "empty_file"
  | "invalid_file_signature"
  | "parser_metadata_limited"
  | "unsupported_extension"
  | "unsafe_relative_path"
  | "parser_requires_ocr_check";

export type ParserIssueSeverity = "info" | "warning" | "blocking";

export type ParserIssue = {
  code: ParserIssueCode;
  message: string;
  severity: ParserIssueSeverity;
};

export type IngestionFileRecord = {
  id: string;
  tenderId: string;
  packageId: string;
  relativePath: string;
  fileName: string;
  extension: string;
  sizeBytes: number;
  sha256: string;
  contentType: string;
  parserKind: ParserKind;
  status: IngestionFileStatus;
  storageKey: string;
  issues: ParserIssue[];
};

export type DocumentPackageInventory = {
  tenderId: string;
  packageId: string;
  packageLabel: string;
  rootLabel: string;
  generatedAt: string;
  fileCount: number;
  totalSizeBytes: number;
  files: IngestionFileRecord[];
  issues: ParserIssue[];
};

export type BuildDocumentPackageInventoryInput = {
  tenderId: string;
  packageId: string;
  packageLabel: string;
  rootPath: string;
  rootLabel?: string;
  generatedAt?: string;
};

export type TechnicalParseStatus =
  | "metadata_extracted"
  | "needs_ocr_check"
  | "unsupported"
  | "blocked";

export type ContentSignature =
  | "empty"
  | "pdf"
  | "zip_office"
  | "compound_binary"
  | "text"
  | "unknown";

export type TechnicalParseResult = {
  fileId: string;
  fileName: string;
  parserKind: ParserKind;
  status: TechnicalParseStatus;
  contentSignature: ContentSignature;
  pageCount?: number;
  lineCount?: number;
  containerKind?: "zip" | "compound_binary";
  issues: ParserIssue[];
};

export type TechnicalSourceReferenceLocatorType =
  | "file"
  | "page"
  | "line_range"
  | "container";

export type TechnicalSourceReferenceReviewStatus =
  | "not_required"
  | "needs_review"
  | "blocked";

export type TechnicalSourceReference = {
  id: string;
  tenderId: string;
  packageId: string;
  fileId: string;
  fileName: string;
  locatorType: TechnicalSourceReferenceLocatorType;
  locator: string;
  label: string;
  parserKind: ParserKind;
  reviewStatus: TechnicalSourceReferenceReviewStatus;
  issueCodes: ParserIssueCode[];
};
