export interface Region {
  readonly id: number;
  readonly parentId: number | null;
  readonly name: string;
  readonly code: string;
  readonly level: number;
  readonly img: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
}