/**
 * Display-only plan information for Phase 1.
 * Real prices come from Stripe (STRIPE_MONTHLY_PRICE_ID / STRIPE_ANNUAL_PRICE_ID)
 * in Phase 9; keep this the only place that mentions an amount.
 */
export type PlanInterval = "month" | "year";

export interface PremiumPlan {
  id: "monthly" | "annual";
  name: string;
  amount: number;
  currency: string;
  interval: PlanInterval;
}

export const premiumPlans: readonly PremiumPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    amount: 7,
    currency: "USD",
    interval: "month",
  },
  {
    id: "annual",
    name: "Yearly",
    amount: 49,
    currency: "USD",
    interval: "year",
  },
];

export const freeBenefits = [
  "Every beginner tutorial",
  "Selected intermediate tutorials",
  "Selected advanced samples",
  "Browse every subject and category",
] as const;

export const premiumBenefits = [
  "Every intermediate tutorial",
  "Every advanced tutorial",
  "Printable worksheets",
  "High-resolution downloads",
  "New premium collections as they are released",
] as const;

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Percentage saved by paying yearly instead of monthly, rounded. */
export function annualSavingsPercent(
  monthly: PremiumPlan,
  annual: PremiumPlan,
): number {
  return Math.round((1 - annual.amount / (monthly.amount * 12)) * 100);
}
