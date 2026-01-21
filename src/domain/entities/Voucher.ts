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
  readonly startAt: Date;
  readonly endAt: Date;
}