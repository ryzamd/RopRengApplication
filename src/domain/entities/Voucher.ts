export type VoucherType = 'fixed' | 'percent';

export interface VoucherRules {
  amount?: number;  // For fixed type
  percent?: number; // For percent type
}

export class Voucher {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly name: string,
    public readonly type: VoucherType,
    public readonly description: string | null,
    public readonly rules: VoucherRules,
    public readonly canCombine: boolean,
    public readonly startAt: Date,
    public readonly endAt: Date
  ) {}

  get isValid(): boolean {
    const now = new Date();
    return now >= this.startAt && now <= this.endAt;
  }

  get isExpired(): boolean {
    return new Date() > this.endAt;
  }

  get isPending(): boolean {
    return new Date() < this.startAt;
  }
  /**
   * Get discount value for display
   */
  get discountDisplay(): string {
    if (this.type === 'fixed' && this.rules.amount) {
      return `-${this.rules.amount.toLocaleString('vi-VN')}đ`;
    }
    if (this.type === 'percent' && this.rules.percent) {
      return `-${this.rules.percent}%`;
    }
    return '';
  }

  calculateDiscount(orderTotal: number): number {
    if (!this.isValid) return 0;

    if (this.type === 'fixed' && this.rules.amount) {
      // Fixed discount: subtract exact amount (but not more than order total)
      return Math.min(this.rules.amount, orderTotal);
    }

    if (this.type === 'percent' && this.rules.percent) {
      // Percent discount: calculate percentage of order total
      return Math.floor((orderTotal * this.rules.percent) / 100);
    }

    return 0;
  }

  get daysUntilExpiry(): number {
    const now = new Date();
    const diffTime = this.endAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get formattedExpiry(): string {
    return this.endAt.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}