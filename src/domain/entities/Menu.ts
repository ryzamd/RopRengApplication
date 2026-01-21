export interface Menu {
  readonly id: number;
  readonly storeId: number;
  readonly name: string;
  readonly isDefault: boolean;
  readonly note: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
}