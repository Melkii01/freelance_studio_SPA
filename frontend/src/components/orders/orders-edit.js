import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Записываем id заказа
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        // Отправка по клику
        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));

        // Поиск элементов
        this.findElements();

        // Валидационные условия
        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement}
        ];

        this.init(id).then();
    }

    // Поиск элементов
    findElements() {
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
    }

    // Запускаем сценарий, чтобы было по порядку, делаем асинхронные в синхронные функции
    async init(id) {
        const orderData = await this.getOrder(id);
        if (orderData) {
            this.showOrder(orderData);

            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id);
            }
        }
    }

    // Получение данных заказа
    async getOrder(id) {
        const response = await OrdersService.getOrder(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.orderOriginalData = response.order;
        return response.order;
    }

    // Получение данных фрилансеров
    async getFreelancers(currentFreelancerId) {
        const response = await FreelancersService.getFreelancers();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = response.freelancers[i].id;
            option.innerText = response.freelancers[i].name + ' ' + response.freelancers[i].lastName;
            if (currentFreelancerId === response.freelancers[i].id) {
                option.selected = true;
            }
            this.freelancerSelectElement.appendChild(option);
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        })
    }

    // Показать заказ на странице
    showOrder(order) {
        const breadcrumbsElement = document.getElementById('breadcrumbs-order');
        breadcrumbsElement.href = '/orders/view?id=' + order.id;
        breadcrumbsElement.innerText = order.number;

        this.amountInputElement.value = order.amount;
        this.descriptionInputElement.value = order.description;

        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value === order.status) {
                this.statusSelectElement.selectedIndex = i;
            }
        }

        // Общие опции календаря
        const calendarOptions = {
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false,
        };
        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;
        // Календарь выполнения
        const calendarScheduled = $('#calendarScheduled');
        calendarScheduled.datetimepicker(Object.assign({}, calendarOptions, {date: order.scheduledDate}));
        calendarScheduled.on('change.datetimepicker', (e) => {
            this.scheduledDate = e.date;
        });
        // Календарь дедлайна
        const calendarDeadline = $('#calendarDeadline');
        calendarDeadline.datetimepicker(Object.assign({}, calendarOptions, {date: order.deadlineDate}));
        calendarDeadline.on('change.datetimepicker', (e) => {
            this.deadlineDate = e.date;
        });
        // Календарь выполнения
        const calendarComplete = $('#calendarComplete');
        calendarComplete.datetimepicker(Object.assign({}, calendarOptions, {
            date: order.completeDate, buttons: {
                showClear: true
            }
        }));
        calendarComplete.on('change.datetimepicker', (e) => {
            if (e.date) {
                this.completeDate = e.date;
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        })
    }

    // Отправить измененные данные в заказе
    async updateOrder(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            let changeData = {};
            if (parseInt(this.amountInputElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changeData.amount = parseInt(this.amountInputElement.value);
            }
            if (this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changeData.description = this.descriptionInputElement.value;
            }
            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changeData.status = this.statusSelectElement.value;
            }
            if (this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changeData.freelancer = this.freelancerSelectElement.value;
            }

            if (this.scheduledDate) {
                changeData.scheduledDate = this.scheduledDate.toISOString();
            }
            if (this.completeDate || this.completeDate === false) {
                changeData.completeDate = this.completeDate ? this.completeDate.toISOString() : null;
            }
            if (this.deadlineDate) {
                changeData.deadlineDate = this.deadlineDate.toISOString();
            }

            if (Object.keys(changeData).length > 0) {

                const response = await OrdersService.updateOrder(this.orderOriginalData.id,changeData);
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/orders/view?id=' + this.orderOriginalData.id);
            }
        }

    }
}
