export function renderHeader(container) {
    const element = createElement('div', {
        className: 'gp__header',
        text: 'header'
    });
    container.appendChild(element.getElement());
    return element; // Возвращаем экземпляр ElementCreator для возможности использования его методов
}