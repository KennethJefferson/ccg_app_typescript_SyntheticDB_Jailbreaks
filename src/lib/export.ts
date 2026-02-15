import { GeneratedExample } from "./types";

export function toJSON(examples: GeneratedExample[]): string {
  return JSON.stringify(examples, null, 2);
}

export function toJSONL(examples: GeneratedExample[]): string {
  return examples.map((e) => JSON.stringify(e)).join("\n") + "\n";
}

export function toCSV(examples: GeneratedExample[]): string {
  const headers = [
    "id",
    "category",
    "subcategory",
    "attackTechnique",
    "attackPrompt",
    "targetResponse",
    "defendedResponse",
    "attackSuccess",
    "severity",
    "notes",
  ];

  const escapeCSV = (val: unknown): string => {
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = examples.map((ex) =>
    headers
      .map((h) => escapeCSV(ex[h as keyof GeneratedExample]))
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
