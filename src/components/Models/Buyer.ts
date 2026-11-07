
import { IBuyer } from '../../types';

export class Buyer {
    private buyer: IBuyer = {
        payment: 'card',
        email: '',
        phone: '',
        address: ''
    };

    /** Сохранить данные покупателя */
    setBuyer(data: Partial<IBuyer>): void {
        this.buyer = {
            ...this.buyer,
            ...data
        };
    }

    /** Получить данные покупателя */
    getBuyer(): IBuyer {
        return this.buyer;
    }

    /** Очистить данные покупателя */
    clear(): void {
        this.buyer = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }

    /** Проверить заполнение данных покупателя */
    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.buyer.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.buyer.email.trim()) {
            errors.email = 'Не указан email';
        }

        if (!this.buyer.phone.trim()) {
            errors.phone = 'Не указан телефон';
        }

        if (!this.buyer.address.trim()) {
            errors.address = 'Не указан адрес';
        }

        return errors;
    }
}
