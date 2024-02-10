import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../services/freelancers-service";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Записываем id фрилансера
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        // Отправка по клику
        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));
        bsCustomFileInput.init();

        // Поиск элементов
        this.findElements();

        // Валидационные условия
        this.validations = [
            {element: this.nameInputElement},
            {element: this.lastNameInputElement},
            {element: this.educationInputElement},
            {element: this.locationInputElement},
            {element: this.skillsInputElement},
            {element: this.infoInputElement},
            {element: this.emailInputElement, options: {pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/}}
        ];

        this.getFreelancer(id).then();
    }

    // Поиск элементов
    findElements(){
        this.nameInputElement = document.getElementById('nameInput');
        this.lastNameInputElement = document.getElementById('lastNameInput');
        this.emailInputElement = document.getElementById('emailInput');
        this.educationInputElement = document.getElementById('educationInput');
        this.locationInputElement = document.getElementById('locationInput');
        this.skillsInputElement = document.getElementById('skillsInput');
        this.infoInputElement = document.getElementById('infoInput');
        this.avatarInputElement = document.getElementById('avatarInput');
        this.levelSelectElement = document.getElementById('levelSelect');
    }

    // Получение данных фрилансера
    async getFreelancer(id) {
        const response = await FreelancersService.getFreelancer(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.freelancerOriginalData = response.freelancer;
        this.showFreelancer(response.freelancer);
    }

    // Заполнение форм по данному фрилансеру
    showFreelancer(freelancer) {
        const breadcrumbsElement = document.getElementById('breadcrumbs-freelancer');
        breadcrumbsElement.href = '/freelancers/view?id=' + freelancer.id;
        breadcrumbsElement.innerText = freelancer.name + ' ' + freelancer.lastName;

        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);

        this.nameInputElement.value = freelancer.name;
        this.lastNameInputElement.value = freelancer.lastName;
        this.emailInputElement.value = freelancer.email;
        this.educationInputElement.value = freelancer.education;
        this.locationInputElement.value = freelancer.location;
        this.skillsInputElement.value = freelancer.skills;
        this.infoInputElement.value = freelancer.info;

        for (let i = 0; i < this.levelSelectElement.options.length; i++) {
            if (this.levelSelectElement.options[i].value === freelancer.level) {
                this.levelSelectElement.selectedIndex = i;
            }
        }
    }

    // Отправка новых данных фрилансера
    async updateFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            let changeData = {};
            if (this.nameInputElement.value !== this.freelancerOriginalData.name) {
                changeData.name = this.nameInputElement.value;
            }
            if (this.lastNameInputElement.value !== this.freelancerOriginalData.lastName) {
                changeData.lastName = this.lastNameInputElement.value;
            }
            if (this.emailInputElement.value !== this.freelancerOriginalData.email) {
                changeData.email = this.emailInputElement.value;
            }
            if (this.educationInputElement.value !== this.freelancerOriginalData.education) {
                changeData.education = this.educationInputElement.value;
            }
            if (this.locationInputElement.value !== this.freelancerOriginalData.location) {
                changeData.location = this.locationInputElement.value;
            }
            if (this.skillsInputElement.value !== this.freelancerOriginalData.skills) {
                changeData.skills = this.skillsInputElement.value;
            }
            if (this.infoInputElement.value !== this.freelancerOriginalData.info) {
                changeData.info = this.infoInputElement.value;
            }
            if (this.levelSelectElement.value !== this.freelancerOriginalData.level) {
                changeData.level = this.levelSelectElement.value;
            }
            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                changeData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            if (Object.keys(changeData).length > 0) {

                const response = await FreelancersService.updateFreelancer(this.freelancerOriginalData.id,changeData);
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/freelancers/view?id=' + this.freelancerOriginalData.id);
            }
        }
    }
}
