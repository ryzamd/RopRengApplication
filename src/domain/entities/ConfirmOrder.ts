export class ConfirmOrder {
  constructor(
    public readonly userId: string,
    public readonly storeId: number,
    public readonly items: ConfirmOrderItem[],
    public readonly voucherCodes: string[],
    public readonly address: ConfirmOrderAddress,
    public readonly contactName: string,
    public readonly contactPhone: string,
    public readonly note: string
  ) {}
}

export class ConfirmOrderItem {
  constructor(
    public readonly menuItemId: number,
    public readonly productId: number,
    public readonly name: string,
    public readonly qty: number,
    public readonly unitPrice: number,
    public readonly toppingIds: number[]
  ) {}
}

export class ConfirmOrderAddress {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
    public readonly detail: string
  ) {}
}