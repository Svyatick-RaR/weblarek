
import { IProduct } from '../../types';

export class Products {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    /** Сохранить список товаров */
    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    /** Получить список всех товаров */
    getProducts(): IProduct[] {
        return this.products;
    }

    /** Найти товар по идентификатору */
    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    /** Сохранить выбранный товар */
    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    /** Получить выбранный товар */
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
