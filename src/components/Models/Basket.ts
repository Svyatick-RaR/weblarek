
import { IProduct } from '../../types';

export class Basket {
    private items: IProduct[] = [];

    /** Получить все товары в корзине */
    getItems(): IProduct[] {
        return this.items;
    }

    /** Добавить товар в корзину */
    addItem(product: IProduct): void {
        this.items.push(product);
    }

    /** Удалить товар из корзины по идентификатору */
    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    /** Очистить корзину */
    clear(): void {
        this.items = [];
    }

    /** Получить общую стоимость товаров */
    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    /** Получить количество товаров */
    getCount(): number {
        return this.items.length;
    }

    /** Проверить наличие товара */
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}