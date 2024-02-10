import {ValidationUtils} from "../../utils/validation-utils";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Отправка по клику
        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

        // Общие опции календаря
        const calendarOptions = {
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false
        }
        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;
        // Календарь выполнения
        const calendarScheduled = $('#calendarScheduled');
        calendarScheduled.datetimepicker(calendarOptions);
        calendarScheduled.on('change.datetimepicker', (e) => {
            this.scheduledDate = e.date;
        });
        // Календарь дедлайна
        const calendarDeadline = $('#calendarDeadline');
        calendarDeadline.datetimepicker(calendarOptions);
        calendarDeadline.on('change.datetimepicker', (e) => {
            this.deadlineDate = e.date;
        });
        // Календарь исполнения
        calendarOptions.buttons = {
            showClear: true
        };
        const calendarComplete = $('#calendarComplete');
        calendarComplete.datetimepicker(calendarOptions);
        calendarComplete.on('change.datetimepicker', (e) => {
            this.completeDate = e.date;
        });


        // Поиск элементов
        this.findElements();

        // Валидационные условия
        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.scheduledDate}},
            {element: this.deadlineCardElement, options: {checkProperty: this.deadlineDate}}
        ];

        this.getFreelancers().then();
    }

    // Поиск элементов
    findElements() {
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.scheduledCardElement = document.getElementById('scheduledCard');
        this.deadlineCardElement = document.getElementById('deadlineCard');
    }

    // Получение данных фрилансеров
    async getFreelancers() {
        const response = await FreelancersService.getFreelancers();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = response.freelancers[i].id;
            option.innerText = response.freelancers[i].name + ' ' + response.freelancers[i].lastName;
            this.freelancerSelectElement.appendChild(option);
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        })
    }

    // Отправка данных для создания заказа
    async saveOrder(e) {
        e.preventDefault();
        // Переназначаем свойство переменных
        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.scheduledCardElement) {
                this.validations[i].options.checkProperty = this.scheduledDate;
            }
            if (this.validations[i].element === this.deadlineCardElement) {
                this.validations[i].options.checkProperty = this.deadlineDate;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value)
            };

            if (this.completeDate) {
                createData.completeDate = this.completeDate.toISOString();
            }

            const response = await OrdersService.createOrder(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/orders/view?id=' + response.id);
        }
    }


}
