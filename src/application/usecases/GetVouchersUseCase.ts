import { LocationPermissionError } from '../../core/errors/AppErrors';
import { Voucher } from '../../domain/entities/Voucher';
import { HomeRepository, VouchersParams, VouchersResult } from '../../domain/repositories/HomeRepository';

export class GetVouchersUseCase {
  constructor(private readonly repository: HomeRepository) {}

  async execute(params: VouchersParams): Promise<VouchersResult> {
    if (!params.lat || !params.lng) {
      throw new LocationPermissionError();
    }

    const result = await this.repository.getVouchers({
      lat: params.lat,
      lng: params.lng,
      limit: params.limit ?? 10,
      page: params.page ?? 0,
    });

    const validVouchers = result.vouchers.filter(v => v.isValid);

    return {
      ...result,
      vouchers: validVouchers,
    };
  }

  getApplicableVouchers(vouchers: Voucher[], orderTotal: number): Voucher[] {
    return vouchers.filter(v => {
      if (!v.isValid) return false;
      // For now, all valid vouchers are applicable
      // Future: Add minimum order amount check
      return true;
    });
  }

  calculateBestDiscount(vouchers: Voucher[], orderTotal: number): { voucher: Voucher | null; discountAmount: number } {
    let bestVoucher: Voucher | null = null;
    let maxDiscount = 0;

    for (const voucher of vouchers) {
      if (!voucher.isValid) continue;

      const discount = voucher.calculateDiscount(orderTotal);
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestVoucher = voucher;
      }
    }

    return {
      voucher: bestVoucher,
      discountAmount: maxDiscount,
    };
  }
}