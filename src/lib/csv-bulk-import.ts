export interface BulkCsvSopStep {
  stepOrder: number;
  title: string;
  instruction: string;
  isCritical: boolean;
}

export interface ParsedBulkCsvRow {
  rowNumber: number;
  title: string;
  folder: string;
  sopSteps: BulkCsvSopStep[];
  managerWhatsapp: string;
  errors: string[];
  isValid: boolean;
}

export interface BulkCsvParseResult {
  headerError: string | null;
  rows: ParsedBulkCsvRow[];
  validRows: ParsedBulkCsvRow[];
  invalidCount: number;
}

interface RawCsvGridResult {
  rows: string[][];
  error: string | null;
}

const SAMPLE_BULK_ROWS: readonly [string, string, string, string][] = [
  [
    "Kitchen Fridge #1",
    "Main Kitchen",
    "Check temp 0-5C | Wipe gasket | Log reading",
    "+919876543210",
  ],
  [
    "DG Set 125 kVA",
    "Basement Utility",
    "Check diesel level % | Inspect engine oil & coolant | Verify battery voltage",
    "+919876543210",
  ],
  [
    "Fire Extinguisher #04",
    "Floor 2",
    "Verify pressure gauge in green | Confirm safety pin intact | Inspect hose & nozzle",
    "",
  ],
  [
    "Forklift #02",
    "Warehouse A",
    "Inspect tyres & lug nuts | Check hydraulic fluid | Test horn & reverse alarm",
    "+919811122233",
  ],
];

function escapeRfc4180Cell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Parses RFC-4180 CSV text (supporting quoted commas, escaped `""`, CRLF/LF/CR,
 * embedded newlines in quoted cells, and UTF-8 BOM).
 */
export function parseRfc4180Csv(input: string): RawCsvGridResult {
  const text = input.startsWith("\uFEFF") ? input.slice(1) : input;
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;
  let cellStartedWithQuote = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          currentCell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += ch;
      }
      continue;
    }

    if (ch === '"' && currentCell.length === 0 && !cellStartedWithQuote) {
      inQuotes = true;
      cellStartedWithQuote = true;
      continue;
    }

    if (ch === ",") {
      currentRow.push(currentCell);
      currentCell = "";
      cellStartedWithQuote = false;
      continue;
    }

    if (ch === "\r" || ch === "\n") {
      if (ch === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      currentRow.push(currentCell);
      const isBlankRow =
        currentRow.length === 1 && currentRow[0].trim().length === 0;
      if (!isBlankRow) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
      cellStartedWithQuote = false;
      continue;
    }

    currentCell += ch;
  }

  if (inQuotes) {
    return {
      rows: [],
      error: "Malformed CSV: unclosed quoted field detected.",
    };
  }

  if (currentCell.length > 0 || currentRow.length > 0 || cellStartedWithQuote) {
    currentRow.push(currentCell);
    const isBlankRow =
      currentRow.length === 1 && currentRow[0].trim().length === 0;
    if (!isBlankRow) {
      rows.push(currentRow);
    }
  }

  return { rows, error: null };
}

function normalizeHeaderName(raw: string): string {
  return raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function parsePipeSopSteps(raw: string): BulkCsvSopStep[] {
  if (!raw.trim()) return [];
  return raw
    .split("|")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map((stepTitle, index) => ({
      stepOrder: index + 1,
      title: stepTitle,
      instruction: "",
      isCritical: false,
    }));
}

/**
 * Parses and validates a CSV string for bulk QR code creation.
 * Required column: `title`. Optional columns: `folder`, `sop_steps`, `manager_whatsapp`.
 */
export function parseBulkQrCsv(csvText: string): BulkCsvParseResult {
  const { rows: rawGrid, error: parseError } = parseRfc4180Csv(csvText);

  if (parseError) {
    return {
      headerError: parseError,
      rows: [],
      validRows: [],
      invalidCount: 0,
    };
  }

  if (rawGrid.length === 0) {
    return {
      headerError:
        "CSV file is empty. Download the sample template to see the required columns.",
      rows: [],
      validRows: [],
      invalidCount: 0,
    };
  }

  const headerCells = rawGrid[0].map(normalizeHeaderName);
  const titleIndex = headerCells.indexOf("title");
  if (titleIndex === -1) {
    return {
      headerError:
        'Missing required "title" column in header row. Expected: title, folder, sop_steps, manager_whatsapp.',
      rows: [],
      validRows: [],
      invalidCount: 0,
    };
  }

  const folderIndex = headerCells.indexOf("folder");
  const sopStepsIndex = headerCells.indexOf("sop_steps");
  const whatsappIndex = headerCells.indexOf("manager_whatsapp");

  const dataRows = rawGrid.slice(1);
  if (dataRows.length === 0) {
    return {
      headerError: "CSV contains headers only — add at least one QR data row.",
      rows: [],
      validRows: [],
      invalidCount: 0,
    };
  }

  const parsedRows: ParsedBulkCsvRow[] = dataRows.map((cells, idx) => {
    const rawTitle = (cells[titleIndex] ?? "").trim();
    const rawFolder =
      folderIndex >= 0 ? (cells[folderIndex] ?? "").trim() : "";
    const rawSteps =
      sopStepsIndex >= 0 ? (cells[sopStepsIndex] ?? "").trim() : "";
    const rawWhatsapp =
      whatsappIndex >= 0 ? (cells[whatsappIndex] ?? "").trim() : "";

    const errors: string[] = [];
    if (!rawTitle) {
      errors.push("Missing required title");
    } else if (rawTitle.length > 200) {
      errors.push("Title exceeds 200 characters");
    }

    const folder =
      rawFolder.toLowerCase() === "unassigned" ? "" : rawFolder;
    if (folder.length > 80) {
      errors.push("Folder name exceeds 80 characters");
    }

    if (rawWhatsapp) {
      const digits = rawWhatsapp.replace(/\D/g, "");
      if (digits.length < 7) {
        errors.push("Invalid WhatsApp number (min 7 digits)");
      }
    }

    const sopSteps = parsePipeSopSteps(rawSteps);

    return {
      rowNumber: idx + 1,
      title: rawTitle,
      folder,
      sopSteps,
      managerWhatsapp: rawWhatsapp,
      errors,
      isValid: errors.length === 0,
    };
  });

  const validRows = parsedRows.filter((row) => row.isValid);
  const invalidCount = parsedRows.length - validRows.length;

  return {
    headerError: null,
    rows: parsedRows,
    validRows,
    invalidCount,
  };
}

/** Generates the RFC-4180 sample CSV content for bulk QR import. */
export function buildSampleBulkCsv(): string {
  const header = ["title", "folder", "sop_steps", "manager_whatsapp"];
  const lines = [
    header.join(","),
    ...SAMPLE_BULK_ROWS.map((row) => row.map(escapeRfc4180Cell).join(",")),
  ];
  return lines.join("\r\n");
}

/** Triggers a client-side download of the sample bulk QR CSV template. */
export function downloadSampleBulkCsv(): void {
  const csvContent = buildSampleBulkCsv();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "fastcc-bulk-qr-template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
