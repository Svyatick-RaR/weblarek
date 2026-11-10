
import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { ApiClient } from './components/ApiClient';

import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// Создаём экземпляры моделей
const products = new Products();
const basket = new Basket();
const buyer = new Buyer();

// Моковые товары из data.ts
const mockProducts = apiProducts.items;

// Проверяем модель Products
console.log('--- ТЕСТ МОДЕЛИ PRODUCTS ---');

products.setProducts(mockProducts);
console.log('Список товаров:', products.getProducts());

console.log(
    'Поиск товара по ID:',
    products.getProductById(mockProducts[0].id)
);

products.setSelectedProduct(mockProducts[0]);
console.log('Выбранный товар:', products.getSelectedProduct());

// Проверяем модель Basket
console.log('--- ТЕСТ МОДЕЛИ BASKET ---');

basket.addItem(mockProducts[0]);
basket.addItem(mockProducts[1]);

console.log('Товары в корзине:', basket.getItems());
console.log('Количество товаров:', basket.getCount());
console.log('Общая стоимость:', basket.getTotal());
console.log('Есть ли товар:', basket.hasItem(mockProducts[0].id));

basket.removeItem(mockProducts[0].id);
console.log('Корзина после удаления:', basket.getItems());

basket.clear();
console.log('Корзина после очистки:', basket.getItems());

// Проверяем модель Buyer
console.log('--- ТЕСТ МОДЕЛИ BUYER ---');

console.log('Начальные данные:', buyer.getBuyer());
console.log('Ошибки при пустых данных:', buyer.validate());

buyer.setBuyer({ payment: 'card' });
buyer.setBuyer({ email: 'test@mail.ru' });
buyer.setBuyer({ phone: '+79991234567' });
buyer.setBuyer({ address: 'Москва, улица Тестовая, 1' });

console.log('Данные после заполнения:', buyer.getBuyer());
console.log('Ошибки после заполнения:', buyer.validate());

buyer.clear();
console.log('Данные после очистки:', buyer.getBuyer());

// Создаём коммуникационный класс
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Получаем каталог с сервера
async function loadProducts(): Promise<void> {
    console.log('--- ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА ---');

    try {
        const response = await apiClient.getProducts();

        products.setProducts(response.items);

        console.log('Количество товаров на сервере:', response.total);
        console.log('Полученный каталог:', products.getProducts());
    } catch (error) {
        console.error('Ошибка при получении каталога:', error);
    }
}

loadProducts();
