export type BatteryCategory = "ev" | "lmt" | "industrial_gt_2kwh";
export type BatteryAccessLevel = "public" | "legitimate_interest" | "authorities";

export interface RecycledMaterialEntry {
  material: string;
  percentage: number;
}

export interface CriticalRawMaterialEntry {
  material: string;
  massPercent?: number;
}

export interface HazardousSubstanceEntry {
  substance: string;
  casNumber?: string;
  concentrationPercent?: number;
}

export interface BatteryPassportInput {
  gtin?: string;
  batchNumber?: string;
  serialNumber?: string;
  batteryCategory: BatteryCategory;
  chemistry: string;
  ratedCapacityAh?: number;
  ratedEnergyKwh?: number;
  nominalVoltageV?: number;
  carbonFootprintKgCo2ePerKwh?: number;
  carbonFootprintPerformanceClass?: "A" | "B" | "C" | "D" | "E";
  carbonFootprintStudyUrl?: string;
  recycledContent?: RecycledMaterialEntry[];
  criticalRawMaterials?: CriticalRawMaterialEntry[];
  hazardousSubstances?: HazardousSubstanceEntry[];
  disassemblyInstructions?: string;
  disassemblyManualUrl?: string;
  stateOfHealthPercent?: number;
  cycleCount?: number;
}

export const BATTERY_FIELD_ACCESS = {
  batteryCategory: "public",
  chemistry: "public",
  ratedCapacityAh: "public",
  ratedEnergyKwh: "public",
  nominalVoltageV: "public",
  hazardousSubstances: "public",
  criticalRawMaterials: "public",
  recycledContent: "public",
  carbonFootprintKgCo2ePerKwh: "public",
  carbonFootprintPerformanceClass: "public",
  carbonFootprintStudyUrl: "public",
  disassemblyInstructions: "legitimate_interest",
  disassemblyManualUrl: "legitimate_interest",
  stateOfHealthPercent: "legitimate_interest",
  cycleCount: "legitimate_interest",
} as const satisfies Record<string, BatteryAccessLevel>;

export type BatteryField = keyof typeof BATTERY_FIELD_ACCESS;

export function pickBatteryFieldsByAccess(
  data: Partial<Record<BatteryField, unknown>>,
  levels: readonly BatteryAccessLevel[] = ["public"]
): Partial<Record<BatteryField, unknown>> {
  const result: Partial<Record<BatteryField, unknown>> = {};
  for (const field of Object.keys(BATTERY_FIELD_ACCESS) as BatteryField[]) {
    if (field in data && levels.includes(BATTERY_FIELD_ACCESS[field])) {
      result[field] = data[field];
    }
  }
  return result;
}

export function buildGs1DigitalLinkUri(opts: {
  gtin?: string | null;
  batchNumber?: string | null;
  serialNumber?: string | null;
  domain?: string;
}): string | null {
  const digits = opts.gtin?.replace(/\D/g, "") ?? "";
  if (digits.length < 8 || digits.length > 14) return null;

  const base = (opts.domain ?? "https://id.gs1.org").replace(/\/+$/, "");
  const gtin14 = digits.padStart(14, "0");
  let uri = `${base}/01/${gtin14}`;
  if (opts.batchNumber) uri += `/10/${encodeURIComponent(opts.batchNumber)}`;
  if (opts.serialNumber) uri += `/21/${encodeURIComponent(opts.serialNumber)}`;
  return uri;
}

export function validateBatteryPassport(input: Partial<BatteryPassportInput>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!input.batteryCategory) errors.push("batteryCategory is required");
  if (!input.chemistry?.trim()) errors.push("chemistry is required");
  if (input.ratedCapacityAh === undefined && input.ratedEnergyKwh === undefined) {
    errors.push("ratedCapacityAh or ratedEnergyKwh is required");
  }
  if (input.stateOfHealthPercent !== undefined && (input.stateOfHealthPercent < 0 || input.stateOfHealthPercent > 100)) {
    errors.push("stateOfHealthPercent must be between 0 and 100");
  }
  return { valid: errors.length === 0, errors };
}
