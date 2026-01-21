import { Menu } from '../entities/Menu';

export class MenuService {
    static isDefaultMenu(menu: Menu): boolean {
        return menu.isDefault === true;
    }
}