import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../services/freelancers-service";

export class FreelancersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Записываем id фрилансера
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        // Назначаем направление для ссылок
        document.getElementById('edit-link').href = '/freelancers/edit?id=' + id;
        document.getElementById('delete-link').href = '/freelancers/delete?id=' + id;

        this.getFreelancer(id).then();
    }

    // Получение данных фрилансера
    async getFreelancer(id) {
        const response = await FreelancersService.getFreelancer(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showFreelancer(response.freelancer);
    }

    // Заполнение форм по данному фрилансеру
    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        document.getElementById('name').innerText = freelancer.name + ' ' + freelancer.lastName;
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);
        document.getElementById('email').innerText = freelancer.email;
        document.getElementById('education').innerText = freelancer.education;
        document.getElementById('location').innerText = freelancer.location;
        document.getElementById('skills').innerText = freelancer.skills;
        document.getElementById('info').innerText = freelancer.info;
        if (freelancer.createdAt) {
            document.getElementById('created').innerText = new Date(freelancer.createdAt).toLocaleString('ru-RU');
        }
    }
}
