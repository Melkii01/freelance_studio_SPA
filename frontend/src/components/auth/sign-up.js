import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Перенаправление если есть авторизованный токен
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        // Поиск элементов
        this.findElements();

        // Валидационные условия
        this.validations = [
            {element: this.nameElement, options: {pattern: /^[A-ЯЁ][а-яё]+\s[A-ЯЁ][а-яё]+(\s[A-ЯЁ][а-яё]+)?$/}},
            {element: this.emailElement, options: {pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
            {element: this.agreeElement, options: {checked: true}}
        ];

        // Отправка по клику
        document.getElementById('registration').addEventListener('click', this.signUp.bind(this))
    }

    // Поиск элементов
    findElements() {
        this.nameElement = document.getElementById('name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.agreeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');
    }

    // Отправка данных для регистрации
    async signUp() {
        this.commonErrorElement.style.display = 'none';
        // Переназначаем переменные
        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const signupResult = await AuthService.signUp({
                name: this.nameElement.value.split(' ')[0],
                lastName: this.nameElement.value.split(' ')[1],
                email: this.emailElement.value,
                password: this.passwordElement.value,
            });
            if (signupResult) {
                AuthUtils.setAuthInfo(signupResult.accessToken, signupResult.refreshToken, {
                    id: signupResult.id,
                    name: signupResult.name
                })

                return this.openNewRoute('/');
            }
            this.commonErrorElement.style.display = 'block';
        }
    }
}
