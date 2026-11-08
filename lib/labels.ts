import { INDUSTRIES } from "./reference-data";
import type { IndustryKey, RoleKey } from "./types";

/** Human-readable industry name, including industries a business defined itself. */
export function industryLabel(e: { industry: IndustryKey; customIndustry?: string }): string {
  if (e.industry === "custom") return e.customIndustry?.trim() || "Custom industry";
  return INDUSTRIES.find((i) => i.id === e.industry)?.name ?? e.industry;
}

/** Human-readable role name, including roles a business defined itself. */
export function roleLabel(e: { role: RoleKey; customRole?: string }): string {
  if (e.role === "custom") return e.customRole?.trim() || "Custom role";
  return e.role.replace("-", " ");
}
