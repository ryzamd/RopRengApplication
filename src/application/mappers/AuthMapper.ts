import { User, UserRole, UserProps } from '../../domain/entities/User';
import { UserResponseDTO } from '../dto/AuthDTO';

export class AuthMapper {

  static toUser(dto: UserResponseDTO): User {
    const props: UserProps = {
      id: dto.id,
      uuid: dto.uuid,
      phone: dto.phone,
      email: dto.email,
      displayName: dto.display_name,
      avatarUrl: dto.avatar_url,
      role: dto.role as UserRole,
      storeId: dto.store_id,
      isActive: dto.is_active === 1,
      loyaltyPoint: dto.loyalty_point,
      availablePoint: dto.available_point,
      currentLevelId: dto.current_level_id,
      nextLevelId: dto.next_level_id,
      createdAt: new Date(dto.created_at),
      updatedAt: dto.updated_at ? new Date(dto.updated_at) : null,
    };

    return new User(props);
  }

  static toSerializable(user: User): SerializableUser {
    return {
      id: user.id,
      uuid: user.uuid,
      phone: user.phone,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      storeId: user.storeId,
      isActive: user.isActive,
      loyaltyPoint: user.loyaltyPoint,
      availablePoint: user.availablePoint,
      currentLevelId: user.currentLevelId,
      nextLevelId: user.nextLevelId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? null,
      isNewUser: user.isNewUser,
    };
  }
}

export interface SerializableUser {
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
  createdAt: string;
  updatedAt: string | null;
  isNewUser: boolean;
}