export interface ToppingOption {
  id: string;
  name?: string;
  price?: number;
}

export interface ItemOptions {
  size: string;
  ice: string;
  sweetness: string;
  toppings: ToppingOption[];
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

  if (options.toppings && options.toppings.length > 0) {
    const toppingNames = options.toppings.map((t) => t.name || `Topping #${t.id}`).join(", ");
    parts.push(toppingNames);
  }

  return parts.join(" • ");
}

export class ConfirmOrderItem {
  constructor(
    public readonly id: number,
    public readonly orderId: number,
    public readonly productId: number | null,
    public readonly menuItemId: number,
    public readonly name: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
    public readonly options: ItemOptions,
    public readonly createdAt: Date,
  ) {}

  get optionsDisplayText(): string {
    return formatItemOptions(this.options);
  }

  withQuantity(newQuantity: number): ConfirmOrderItem {
    return new ConfirmOrderItem(
      this.id,
      this.orderId,
      this.productId,
      this.menuItemId,
      this.name,
      newQuantity,
      this.unitPrice,
      this.unitPrice * newQuantity,
      this.options,
      this.createdAt,
    );
  }

  withOptions(newOptions: ItemOptions): ConfirmOrderItem {
    return new ConfirmOrderItem(
      this.id,
      this.orderId,
      this.productId,
      this.menuItemId,
      this.name,
      this.quantity,
      this.unitPrice,
      this.totalPrice,
      newOptions,
      this.createdAt,
    );
  }
}
