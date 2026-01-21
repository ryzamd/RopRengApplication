import { ItemOptions } from '../../domain/entities/ConfirmOrderItem';
import { Product } from '../../domain/entities/Product';
import { Voucher } from '../../domain/entities/Voucher';

export function formatPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')}đ`;
}

export function formatProductPrice(product: Product): string {
    return formatPrice(product.price);
}

export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
}

export function formatVoucherDiscount(voucher: Voucher): string {
    if (voucher.type === 'fixed' && voucher.rules.amount) {
        return `-${voucher.rules.amount.toLocaleString('vi-VN')}đ`;
    }
    if (voucher.type === 'percent' && voucher.rules.percent) {
        return `-${voucher.rules.percent}%`;
    }
    return '';
}

export function formatVoucherExpiry(voucher: Voucher): string {
    return voucher.endAt.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

const SIZE_LABELS: Record<string, string> = {
    small: "Nhỏ",
    medium: "Vừa",
    large: "Lớn",
};

const ICE_LABELS: Record<string, string> = {
    normal: "Bình thường",
    less: "Ít đá",
    separate: "Đá riêng",
};

const SWEETNESS_LABELS: Record<string, string> = {
    normal: "Bình thường",
    less: "Ít ngọt",
    more: "Thêm ngọt",
};

export function formatItemOptions(options: ItemOptions): string {
    const parts: string[] = [];

    if (options.size) {
        parts.push(SIZE_LABELS[options.size] || options.size);
    }

    if (options.ice) {
        parts.push(ICE_LABELS[options.ice] || options.ice);
    }

    if (options.sweetness) {
        parts.push(SWEETNESS_LABELS[options.sweetness] || options.sweetness);
    }

    return parts.join(" • ");
}

export function getSizeLabel(size: string): string {
    return SIZE_LABELS[size] || size;
}

export function getIceLabel(ice: string): string {
    return ICE_LABELS[ice] || ice;
}

export function getSweetnessLabel(sweetness: string): string {
    return SWEETNESS_LABELS[sweetness] || sweetness;
}

export const OPTION_LABELS = {
    SIZE: SIZE_LABELS,
    ICE: ICE_LABELS,
    SWEETNESS: SWEETNESS_LABELS,
};
