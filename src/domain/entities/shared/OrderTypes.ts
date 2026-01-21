export interface ToppingOption {
    id: string;
    name?: string;
    price?: number;
}

export interface ItemOptions {
    size: string;
    ice: string;
    sweetness: string;
    toppings: ToppingOption[];
}

export interface OrderItemOptions {
    size: string;
    ice: string;
    sweetness: string;
    toppings: string[];
}
