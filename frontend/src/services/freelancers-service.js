import {HttpUtils} from "../utils/http-utils";

// Оптимизация
export class FreelancersService {

    // По запросу фрилансеров
    static async getFreelancers() {
        const returnObject = {
            error: false,
            redirect: null,
            freelancers: null
        }
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect || result.error || !result.response
            || (result.response && (result.response.error || !result.response.freelancers))) {
            returnObject.error = 'Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        returnObject.freelancers = result.response.freelancers;
        return returnObject;
    }

    // По запросу фрилансера
    static async getFreelancer(id) {
        const returnObject = {
            error: false,
            redirect: null,
            freelancer: null
        }
        const result = await HttpUtils.request('/freelancers/' + id);

        if (result.redirect || result.error || !result.response
            || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        returnObject.freelancer = result.response;
        return returnObject;
    }

    // По созданию фрилансера
    static async createFreelancer(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        }

        const result = await HttpUtils.request('/freelancers', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении фрилансера. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    // По удалению фрилансера
    static async deleteFreelancer(id) {
        const returnObject = {
            error: false,
            redirect: null,
        }

        const result = await HttpUtils.request('/freelancers/' + id, 'DELETE');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении фрилансера. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        return returnObject;
    }

    // По редактировании фрилансера
    static async updateFreelancer(id, data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/freelancers/' + id,
            'PUT', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании фрилансера. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }

        return returnObject;
    }

}
