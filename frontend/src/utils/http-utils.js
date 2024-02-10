import config from "../config/config";
import {AuthUtils} from "./auth-utils";

export class HttpUtils {

    //Отправка запросов
    static async request(url, method = 'GET', useAuth = true, body = null) {

        // Начальная настройка
        const result = {
            error: false,
            response: null
        }

        // Параметры отправки
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }

        // При использовании авторизационного токена
        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['authorization'] = token;
            }
        }

        // При отправке тела запроса
        if (body) {
            params.body = JSON.stringify(body);
        }

        // Проверка на ошибки, а также их присвоение
        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;

            if (useAuth && response.status === 401) {
                if (!token) {
                    // токена нет
                    result.redirect = '/login';
                } else {
                    // токен устарел/невалидный (надо обновить)
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //  Смогли обновить токен, и запрос делаем снова
                        return this.request(url, method, useAuth, body);
                    } else {
                        // Не смогли обновить токен
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}
