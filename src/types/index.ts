
/** Способы оплаты */
export type TPayment = 'card' | 'cash' | '';

/** Данные одного товара */
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

/** Данные покупателя */
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

/** Ответ сервера при получении каталога */
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

/** Данные для отправки заказа */
export interface IOrderRequest extends IBuyer {
    total: number;
    items: string[];
}

/** Ответ сервера после оформления заказа */
export interface IOrderResponse {
    id: string;
    total: number;
}

/** HTTP-методы для отправки данных */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/** Интерфейс API-клиента */
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}
