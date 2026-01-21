import { User } from '../entities/User';

export class UserService {
    static isNewUser(user: User): boolean {
        return user.displayName === null;
    }

    static hasStoreAccess(user: User): boolean {
        return user.storeId !== null;
    }
}
