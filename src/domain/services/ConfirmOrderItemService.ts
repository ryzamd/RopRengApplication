import { ConfirmOrderItem, ItemOptions } from '../entities/ConfirmOrderItem';

export class ConfirmOrderItemService {
    static withQuantity(item: ConfirmOrderItem, newQuantity: number): ConfirmOrderItem {
        return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity,
        };
    }

    static withOptions(item: ConfirmOrderItem, newOptions: ItemOptions): ConfirmOrderItem {
        return {
            ...item,
            options: newOptions,
        };
    }
}
