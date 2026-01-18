export class Region {
  constructor(
    public readonly id: number,
    public readonly parentId: number | null,
    public readonly name: string,
    public readonly code: string,
    public readonly level: number,
    public readonly img: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly deletedAt: Date | null
  ) {}
}