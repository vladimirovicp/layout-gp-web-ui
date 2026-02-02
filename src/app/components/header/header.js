import { createElement } from '../../util/element-creator';

export function renderHeader(container) {
    const element = createElement('div', {
        className: 'gp__header',
        text: 'header'
    });
    container.appendChild(element.getElement());
    return element.getElement();
}