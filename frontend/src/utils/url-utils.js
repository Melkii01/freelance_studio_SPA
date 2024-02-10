export class UrlUtils {
    // Возвращение url страницы
    static getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
}
