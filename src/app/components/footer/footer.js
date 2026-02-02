export function renderFooter(container) {
    const element = createElement('div', {
        className: 'gp__footer',
        text: 'footer'
    });
    container.appendChild(element.getElement());
    return element.getElement();
}