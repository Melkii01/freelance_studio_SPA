import {HttpUtils} from "../utils/http-utils";

// Оптимизация
export class OrdersService {

    // По запросу заказов
    static async getOrders() {
        const returnObject = {
            error: false,
            redirect: null,
            orders: null
        }
        const result = await HttpUtils.request('/orders');

        if (result.redirect || result.error || !result.response
            || (result.response && (result.response.error || !result.response.orders))) {
            returnObject.error = 'Возникла ошибка при запросе заказов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        returnObject.orders = result.response.orders;
        return returnObject;
    }

    // По запросу заказа
    static async getOrder(id) {
        const returnObject = {
            error: false,
            redirect: null,
            order: null
        }
        const result = await HttpUtils.request('/orders/' + id);

        if (result.redirect || result.error || !result.response
            || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе заказа. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        returnObject.order = result.response;
        return returnObject;
    }

    // По созданию заказа
    static async createOrder(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        }

        const result = await HttpUtils.request('/orders', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении заказа. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    // По удалению заказа
    static async deleteOrder(id) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = await HttpUtils.request('/orders/' + id, 'DELETE');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении заказа. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        return returnObject;
    }

    // По редактировании заказа
    static async updateOrder(id, data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/orders/' + id,
            'PUT', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании заказа. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        return returnObject;
    }

}
