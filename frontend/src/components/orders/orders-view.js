import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OrdersService} from "../../services/orders-service";

export class OrdersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Записываем id фрилансера
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        // Назначаем направление для ссылок
        document.getElementById('edit-link').href = '/orders/edit?id=' + id;
        document.getElementById('delete-link').href = '/orders/delete?id=' + id;

        this.getOrder(id).then();
    }

    // Получение данных заказов
    async getOrder(id) {
        const response = await OrdersService.getOrder(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showOrder(response.order);
    }

    // Заполнение форм по данному заказу
    showOrder(order) {
        const statusInfo = CommonUtils.getStatusInfo(order.status);
        document.getElementById('order-status').classList.add('bg-' + statusInfo.color);
        document.getElementById('order-status-icon').classList.add('fa-' + statusInfo.icon);
        document.getElementById('order-status-value').innerText = statusInfo.name;

        if (order.scheduledDate) {
            document.getElementById('scheduled').innerText = new Date(order.scheduledDate).toLocaleDateString('ru-RU');
        }

        document.getElementById('complete').innerText =
            (order.completeDate) ? (new Date(order.completeDate).toLocaleDateString('ru-RU'))
                : '(Заказ не выполнен)';

        if (order.deadlineDate) {
            document.getElementById('deadline').innerText = new Date(order.deadlineDate).toLocaleDateString('ru-RU');
        }

        if (order.freelancer.avatar) {
            document.getElementById('freelancer-avatar').src = config.host + order.freelancer.avatar;
        }
        document.getElementById('freelancer-name').innerHTML =
            '<a href="/freelancers/view?id=' + order.freelancer.id + '">'
            + order.freelancer.name + ' ' + order.freelancer.lastName + '</a>';
        document.getElementById('number').innerText = order.number;
        document.getElementById('description').innerText = order.description;
        document.getElementById('owner').innerText = order.owner.name + ' ' + order.owner.lastName;
        document.getElementById('amount').innerText = order.amount;
        document.getElementById('created').innerText =
            (order.createdAt) ? (new Date(order.createdAt).toLocaleString('ru-RU')) : '';
    }
}













