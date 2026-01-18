export class Menu {
  constructor(
    public readonly id: number,
    public readonly storeId: number,
    public readonly name: string,
    public readonly isDefault: number,
    public readonly note: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly deletedAt: Date | null
  ) {}

  get isDefaultMenu(): boolean {
    return this.isDefault === 1;
  }
}