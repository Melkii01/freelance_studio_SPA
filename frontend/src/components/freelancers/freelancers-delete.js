import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../services/freelancers-service";

export class FreelancersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Записываем id фрилансера
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteFreelancer(id).then();
    }

    // Отправка данных для удаления фрилансера
    async deleteFreelancer(id) {

        const response = await FreelancersService.deleteFreelancer(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/freelancers');
    }

}
