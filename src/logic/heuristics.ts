export function detectServiceDateHint(rawText: string): boolean {
  return /Leistungsdatum/i.test(rawText);
}

export function detectVatIncluded(rawText: string): boolean {
  return /MwSt\.?\s*inkl|VAT\s+incl/i.test(rawText);
}

export function detectCurrencyInText(rawText: string): string | null {
  const match = rawText.match(/\b(EUR|USD|GBP)\b/);
  return match && match[1] ? match[1] : null;
}

export function detectFreightDescription(text: string): boolean {
  return /Seefracht|Shipping|Transport/i.test(text);
}
