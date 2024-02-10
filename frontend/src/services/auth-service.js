import {HttpUtils} from "../utils/http-utils";

// Оптимизация
export class AuthService {
    // При авторизации
    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response &&
            (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
            return false;
        }

        return result.response;
    }

    // При регистрации
    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response &&
            (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
            return false;
        }

        return result.response;
    }

    // При выходе
    static async logOut(data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}
