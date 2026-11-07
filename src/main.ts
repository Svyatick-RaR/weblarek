
import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { ApiClient } from './components/ApiClient';

import { API_URL, CDN_URL, categoryMap } from './utils/constants';

import type {
    IProduct,
    IOrderRequest,
    TPayment
} from './types';

// Создаём экземпляры моделей
const products = new Products();
const basket = new Basket();
const buyer = new Buyer();

// Тестовые товары для проверки моделей
const product1: IProduct = {
    id: 'test-1',
    description: 'Тестовый товар 1',
    image: '/test-1.svg',
    title: 'Тестовый товар 1',
    category: 'другое',
    price: 1000
};

const product2: IProduct = {
    id: 'test-2',
    description: 'Тестовый товар 2',
    image: '/test-2.svg',
    title: 'Тестовый товар 2',
    category: 'другое',
    price: 2000
};

// Проверяем модель Products
console.log('--- ТЕСТ МОДЕЛИ PRODUCTS ---');

products.setProducts([product1, product2]);
console.log('Список товаров:', products.getProducts());

console.log(
    'Поиск товара по ID:',
    products.getProductById('test-1')
);

products.setSelectedProduct(product1);
console.log('Выбранный товар:', products.getSelectedProduct());

// Проверяем модель Basket
console.log('--- ТЕСТ МОДЕЛИ BASKET ---');

basket.addItem(product1);
basket.addItem(product2);
basket.addItem(product1);

console.log('Товары в корзине:', basket.getItems());
console.log('Количество товаров:', basket.getCount());
console.log('Общая стоимость:', basket.getTotal());
console.log('Есть ли товар test-1:', basket.hasItem('test-1'));

basket.removeItem('test-1');
console.log('Корзина после удаления:', basket.getItems());

basket.clear();
console.log('Корзина после очистки:', basket.getItems());

// Проверяем модель Buyer
console.log('--- ТЕСТ МОДЕЛИ BUYER ---');

console.log('Начальные данные:', buyer.getBuyer());
console.log('Ошибки при пустых данных:', buyer.validate());

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

// Элементы модального окна
const modal = document.querySelector<HTMLElement>('#modal-container');
const modalContent = modal?.querySelector<HTMLElement>('.modal__content');
const modalClose = modal?.querySelector<HTMLButtonElement>('.modal__close');

// Кнопка корзины
const basketButton = document.querySelector<HTMLButtonElement>('.header__basket');

// Обновляем счётчик корзины
function updateBasketCounter(): void {
    const counter = document.querySelector<HTMLElement>('.header__basket-counter');

    if (counter) {
        counter.textContent = String(basket.getCount());
    }
}

// Открываем модальное окно
function openModal(): void {
    modal?.classList.add('modal_active');
}

// Закрываем модальное окно
function closeModal(): void {
    modal?.classList.remove('modal_active');
}

// Отображаем каталог товаров
function renderProducts(productsList: IProduct[]): void {
    const gallery = document.querySelector<HTMLElement>('.gallery');
    const template = document.querySelector<HTMLTemplateElement>('#card-catalog');

    if (!gallery || !template) {
        console.error('Не найден контейнер каталога или шаблон карточки');
        return;
    }

    gallery.replaceChildren();

    productsList.forEach((product) => {
        const card = template.content.firstElementChild?.cloneNode(true) as HTMLElement | null;

        if (!card) return;

        const category = card.querySelector<HTMLElement>('.card__category');
        const title = card.querySelector<HTMLElement>('.card__title');
        const image = card.querySelector<HTMLImageElement>('.card__image');
        const price = card.querySelector<HTMLElement>('.card__price');

        if (!category || !title || !image || !price) return;

        const categoryClass =
            categoryMap[product.category as keyof typeof categoryMap] ??
            categoryMap['другое'];

        category.className = `card__category ${categoryClass}`;
        category.textContent = product.category;

        title.textContent = product.title;
        image.src = `${CDN_URL}${product.image}`;
        image.alt = product.title;

        price.textContent = product.price !== null
            ? `${product.price} синапсов`
            : 'Бесценно';

        card.dataset.id = product.id;

        gallery.append(card);
    });
}

// Отображаем подробную информацию о товаре
function renderProductPreview(product: IProduct): void {
    const template = document.querySelector<HTMLTemplateElement>('#card-preview');

    if (!template || !modalContent) {
        console.error('Не найден шаблон карточки или содержимое модального окна');
        return;
    }

    const preview = template.content.firstElementChild?.cloneNode(true) as HTMLElement | null;

    if (!preview) return;

    const category = preview.querySelector<HTMLElement>('.card__category');
    const title = preview.querySelector<HTMLElement>('.card__title');
    const image = preview.querySelector<HTMLImageElement>('.card__image');
    const description = preview.querySelector<HTMLElement>('.card__text');
    const price = preview.querySelector<HTMLElement>('.card__price');
    const addButton = preview.querySelector<HTMLButtonElement>('.card__button');

    if (!category || !title || !image || !description || !price || !addButton) return;

    const categoryClass =
        categoryMap[product.category as keyof typeof categoryMap] ??
        categoryMap['другое'];

    category.className = `card__category ${categoryClass}`;
    category.textContent = product.category;

    title.textContent = product.title;
    image.src = `${CDN_URL}${product.image}`;
    image.alt = product.title;
    description.textContent = product.description;

    price.textContent = product.price !== null
        ? `${product.price} синапсов`
        : 'Бесценно';

    if (basket.hasItem(product.id)) {
        addButton.textContent = 'В корзине';
        addButton.disabled = true;
    } else {
        addButton.textContent = 'В корзину';
        addButton.disabled = product.price === null;

        addButton.addEventListener('click', () => {
            basket.addItem(product);
            updateBasketCounter();

            addButton.textContent = 'В корзине';
            addButton.disabled = true;
        });
    }

    modalContent.replaceChildren(preview);
    openModal();
}

// Отображаем корзину
function renderBasket(): void {
    const template = document.querySelector<HTMLTemplateElement>('#basket');
    const itemTemplate = document.querySelector<HTMLTemplateElement>('#card-basket');

    if (!template || !itemTemplate || !modalContent) {
        console.error('Не найдены шаблоны корзины');
        return;
    }

    const basketElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement | null;

    if (!basketElement) return;

    const basketList = basketElement.querySelector<HTMLElement>('.basket__list');
    const basketPrice = basketElement.querySelector<HTMLElement>('.basket__price');
    const orderButton = basketElement.querySelector<HTMLButtonElement>('.basket__button');

    if (!basketList || !basketPrice || !orderButton) return;

    const items = basket.getItems();

    items.forEach((product, index) => {
        const item = itemTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement | null;

        if (!item) return;

        const itemIndex = item.querySelector<HTMLElement>('.basket__item-index');
        const title = item.querySelector<HTMLElement>('.card__title');
        const price = item.querySelector<HTMLElement>('.card__price');
        const deleteButton = item.querySelector<HTMLButtonElement>('.basket__item-delete');

        if (!itemIndex || !title || !price || !deleteButton) return;

        itemIndex.textContent = String(index + 1);
        title.textContent = product.title;

        price.textContent = product.price !== null
            ? `${product.price} синапсов`
            : 'Бесценно';

        deleteButton.addEventListener('click', () => {
            basket.removeItem(product.id);
            updateBasketCounter();
            renderBasket();
        });

        basketList.append(item);
    });

    if (items.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        basketList.append(emptyMessage);
    }

    basketPrice.textContent = `${basket.getTotal()} синапсов`;
    orderButton.disabled = items.length === 0;

    orderButton.addEventListener('click', renderOrder);

    modalContent.replaceChildren(basketElement);
    openModal();
}

// Отображаем форму выбора оплаты и адреса
function renderOrder(): void {
    const template = document.querySelector<HTMLTemplateElement>('#order');

    if (!template || !modalContent) {
        console.error('Не найден шаблон оформления заказа');
        return;
    }

    const orderElement = template.content.firstElementChild?.cloneNode(true) as HTMLFormElement | null;

    if (!orderElement) return;

    const addressInput = orderElement.querySelector<HTMLInputElement>('input[name="address"]');
    const nextButton = orderElement.querySelector<HTMLButtonElement>('button[type="submit"]');
    const errors = orderElement.querySelector<HTMLElement>('.form__errors');
    const paymentButtons = orderElement.querySelectorAll<HTMLButtonElement>('.order__buttons button');

    if (!addressInput || !nextButton || !errors) return;

    let selectedPayment: TPayment | null = null;

    addressInput.required = true;

    function updateNextButton(): void {
        if (!nextButton || !addressInput) return;

        nextButton.disabled = !selectedPayment || !addressInput.value.trim();
    }

    paymentButtons.forEach((button) => {
        button.setAttribute('aria-pressed', 'false');

        button.addEventListener('click', () => {
            selectedPayment = button.name as TPayment;

            paymentButtons.forEach((paymentButton) => {
                const isSelected = paymentButton === button;

                paymentButton.setAttribute('aria-pressed', String(isSelected));
                paymentButton.classList.toggle('button_alt', !isSelected);
            });

            buyer.setBuyer({ payment: selectedPayment as TPayment });

            errors.textContent = '';
            updateNextButton();
        });
    });

    addressInput.addEventListener('input', () => {
        buyer.setBuyer({ address: addressInput.value });

        errors.textContent = '';
        updateNextButton();
    });

    orderElement.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!selectedPayment || !addressInput.value.trim()) {
            errors.textContent = 'Выберите способ оплаты и укажите адрес';
            updateNextButton();
            return;
        }

        buyer.setBuyer({
            payment: selectedPayment,
            address: addressInput.value.trim()
        });

        renderContacts();
    });

    modalContent.replaceChildren(orderElement);
    openModal();
}

// Отображаем форму контактных данных
function renderContacts(): void {
    const template = document.querySelector<HTMLTemplateElement>('#contacts');

    if (!template || !modalContent) {
        console.error('Не найден шаблон контактных данных');
        return;
    }

    const contactsElement = template.content.firstElementChild?.cloneNode(true) as HTMLFormElement | null;

    if (!contactsElement) return;

    const emailInput = contactsElement.querySelector<HTMLInputElement>('input[name="email"]');
    const phoneInput = contactsElement.querySelector<HTMLInputElement>('input[name="phone"]');
    const submitButton = contactsElement.querySelector<HTMLButtonElement>('button[type="submit"]');
    const errors = contactsElement.querySelector<HTMLElement>('.form__errors');

    if (!emailInput || !phoneInput || !submitButton || !errors) return;

    emailInput.type = 'email';
    emailInput.required = true;
    phoneInput.required = true;

    function updateSubmitButton(): void {
        if (!emailInput || !phoneInput || !submitButton) return;

        const emailValid = emailInput.validity.valid && emailInput.value.trim() !== '';
        const phoneValid = phoneInput.value.trim() !== '';

        submitButton.disabled = !emailValid || !phoneValid;
    }

    emailInput.addEventListener('input', () => {
        buyer.setBuyer({ email: emailInput.value.trim() });

        errors.textContent = '';
        updateSubmitButton();
    });

    phoneInput.addEventListener('input', () => {
        buyer.setBuyer({ phone: phoneInput.value.trim() });

        errors.textContent = '';
        updateSubmitButton();
    });

    contactsElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        updateSubmitButton();

        if (submitButton.disabled) {
            errors.textContent = 'Введите корректный email и телефон';
            return;
        }

        buyer.setBuyer({
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        });

        const validationErrors = buyer.validate();

        if (Object.keys(validationErrors).length > 0) {
            errors.textContent = Object.values(validationErrors).join('. ');
            return;
        }

        const order: IOrderRequest = {
            ...buyer.getBuyer(),
            total: basket.getTotal(),
            items: basket.getItems().map(item => item.id)
        };

        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
        errors.textContent = '';

        try {
            const response = await apiClient.createOrder(order);

            console.log('Заказ успешно оформлен:', response);

            basket.clear();
            buyer.clear();

            updateBasketCounter();

            renderSuccess(response.total);
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);

            errors.textContent = error instanceof Error
                ? error.message
                : String(error);

            submitButton.textContent = 'Оплатить';
            updateSubmitButton();
        }
    });

    modalContent.replaceChildren(contactsElement);
    openModal();
}

// Отображаем сообщение об успешном оформлении заказа
function renderSuccess(total: number): void {
    const template = document.querySelector<HTMLTemplateElement>('#success');

    if (!template || !modalContent) {
        console.error('Не найден шаблон успешного оформления заказа');
        return;
    }

    const successElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement | null;

    if (!successElement) return;

    const description = successElement.querySelector<HTMLElement>('.order-success__description');
    const closeButton = successElement.querySelector<HTMLButtonElement>('.order-success__close');

    if (!description || !closeButton) return;

    description.textContent = `Списано ${total} синапсов`;

    closeButton.addEventListener('click', () => {
        closeModal();
        modalContent.replaceChildren();
    });

    modalContent.replaceChildren(successElement);
    openModal();
}

// Обработка нажатий на карточки каталога
const gallery = document.querySelector<HTMLElement>('.gallery');

gallery?.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const card = target.closest<HTMLElement>('.gallery__item');

    if (!card || !card.dataset.id) return;

    const product = products.getProductById(card.dataset.id);

    if (!product) {
        console.error('Товар не найден');
        return;
    }

    products.setSelectedProduct(product);
    renderProductPreview(product);
});

// Открываем корзину
basketButton?.addEventListener('click', renderBasket);

// Закрываем модальное окно крестиком
modalClose?.addEventListener('click', closeModal);

// Закрываем окно при клике на затемнённый фон
modal?.addEventListener('click', (event: MouseEvent) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Закрываем окно клавишей Escape
document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Получаем каталог с сервера
async function loadProducts(): Promise<void> {
    console.log('--- ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА ---');

    try {
        const response = await apiClient.getProducts();

        products.setProducts(response.items);
        renderProducts(products.getProducts());

        console.log('Количество товаров на сервере:', response.total);
        console.log('Полученный каталог:', products.getProducts());
    } catch (error) {
        console.error('Ошибка при получении каталога:', error);
    }
}

loadProducts();
