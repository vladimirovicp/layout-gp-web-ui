import { createElement } from '../../util/element-creator.js';

export function renderFooter(container) {
    const element = createElement('div', {
        className: 'gp__footer',
    });
    container.appendChild(element.getElement());
    return element.getElement();
}