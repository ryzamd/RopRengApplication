import { Voucher } from '../entities/Voucher';

export class VoucherService {
    static isValid(voucher: Voucher): boolean {
        const now = new Date();
        return now >= voucher.startAt && now <= voucher.endAt;
    }

    static isExpired(voucher: Voucher): boolean {
        return new Date() > voucher.endAt;
    }

    static isPending(voucher: Voucher): boolean {
        return new Date() < voucher.startAt;
    }

    static calculateDiscount(voucher: Voucher, orderTotal: number): number {
        if (!this.isValid(voucher)) return 0;

        if (voucher.type === 'fixed' && voucher.rules.amount) {
            return Math.min(voucher.rules.amount, orderTotal);
        }

        if (voucher.type === 'percent' && voucher.rules.percent) {
            return Math.floor((orderTotal * voucher.rules.percent) / 100);
        }

        return 0;
    }

    static getDaysUntilExpiry(voucher: Voucher): number {
        const now = new Date();
        const diffTime = voucher.endAt.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}