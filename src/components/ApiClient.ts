
import type {
    IApi,
    IProductsResponse,
    IOrderRequest,
    IOrderResponse
} from '../types';

export class ApiClient {
    constructor(private readonly api: IApi) {}

    /** Получить каталог товаров с сервера */
    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    /** Отправить заказ на сервер */
    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}
