export function renderMain(container) {
    const element = createElement('div', {
        className: 'gp__main'
    });
    container.appendChild(element.getElement());
    return element; // Возвращаем экземпляр ElementCreator для возможности использования его методов
}
