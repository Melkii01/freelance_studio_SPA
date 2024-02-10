import config from "../config/config";
import {OrdersService} from "../services/orders-service";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getOrders().then();
    }

    // Получение данных заказов
    async getOrders() {
        const response = await OrdersService.getOrders();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.loadOrderInfo(response.orders);
        this.loadCalendarInfo(response.orders);
    }

    // Показать данные по заказам
    loadOrderInfo(orders) {
        document.getElementById('count-orders').innerText = orders.length;
        document.getElementById('done-orders').innerText =
            orders.filter(order => order.status === config.orderStatuses.success).length;
        document.getElementById('in-progress-orders').innerText =
            orders.filter(order => [config.orderStatuses.new, config.orderStatuses.confirmed].includes(order.status)).length;
        document.getElementById('cancelled-orders').innerText =
            orders.filter(order => order.status === config.orderStatuses.canceled).length;
    }

    // Показать данные по календарю
    loadCalendarInfo(orders) {
        const preparedEvents = [];
        for (let i = 0; i < orders.length; i++) {
            let color = null;
            if (orders[i].status === config.orderStatuses.success) {
                color = 'gray';
            }

            if (orders[i].scheduledDate) {
                preparedEvents.push({
                    title: orders[i].freelancer.name + ' ' + orders[i].freelancer.lastName + ' выполняет заказ ' + orders[i].number,
                    start: new Date(orders[i].scheduledDate),
                    backgroundColor: color ? color : '#00c0ef',
                    borderColor: color ? color : '#00c0ef',
                    allDay: true
                })
            }

            if (orders[i].deadlineDate) {
                preparedEvents.push({
                    title: 'Дедлайн заказа ' + orders[i].number,
                    start: new Date(orders[i].deadlineDate),
                    backgroundColor: color ? color : '#f39c12',
                    borderColor: color ? color : '#f39c12',
                    allDay: true
                })
            }

            if (orders[i].completeDate) {
                preparedEvents.push({
                    title: 'Заказ ' + orders[i].number + ' выполнен фрилансером ' + orders[i].freelancer.name,
                    start: new Date(orders[i].completeDate),
                    backgroundColor: color ? color : '#00a65a',
                    borderColor: color ? color : '#00a65a',
                    allDay: true
                })
            }
        }

        (new FullCalendar.Calendar(document.getElementById('calendar'), {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            themeSystem: 'bootstrap',
            locale: 'ru',
            firstDay: 1,
            events: preparedEvents
        })).render();
    }
}
