export type VoucherType = 'fixed' | 'percent';

export interface VoucherRules {
  amount?: number;
  percent?: number;
}

export interface Voucher {
  readonly id: number;
  readonly code: string;
  readonly name: string;
  readonly type: VoucherType;
  readonly description: string | null;
  readonly rules: VoucherRules;
  readonly canCombine: boolean;
  readonly startAt: string;
  readonly endAt: string;
  readonly isValid: boolean;
}

export function calculateVoucherDiscount(voucher: Voucher, orderTotal: number): number {
  if (!voucher.isValid) return 0;

  if (voucher.rules.amount) {
    return Math.min(voucher.rules.amount, orderTotal);
  }

  if (voucher.rules.percent) {
    return Math.floor(orderTotal * (voucher.rules.percent / 100));
  }

  return 0;
}