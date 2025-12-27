export interface UserProps {
  id: number;
  uuid: string;
  phone: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  storeId: number | null;
  isActive: boolean;
  loyaltyPoint: number;
  availablePoint: number;
  currentLevelId: number | null;
  nextLevelId: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export type UserRole = 'end_user' | 'admin' | 'store_staff';

export class User {
  public readonly id: number;
  public readonly uuid: string;
  public readonly phone: string;
  public readonly email: string | null;
  public readonly displayName: string | null;
  public readonly avatarUrl: string | null;
  public readonly role: UserRole;
  public readonly storeId: number | null;
  public readonly isActive: boolean;
  public readonly loyaltyPoint: number;
  public readonly availablePoint: number;
  public readonly currentLevelId: number | null;
  public readonly nextLevelId: number | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.uuid = props.uuid;
    this.phone = props.phone;
    this.email = props.email;
    this.displayName = props.displayName;
    this.avatarUrl = props.avatarUrl;
    this.role = props.role;
    this.storeId = props.storeId;
    this.isActive = props.isActive;
    this.loyaltyPoint = props.loyaltyPoint;
    this.availablePoint = props.availablePoint;
    this.currentLevelId = props.currentLevelId;
    this.nextLevelId = props.nextLevelId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get isNewUser(): boolean {
    return this.displayName === null;
  }

  get hasStoreAccess(): boolean {
    return this.storeId !== null;
  }
}