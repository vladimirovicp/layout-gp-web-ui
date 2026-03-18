import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон networkShares
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderNetworkSharesTemplate() {
    const networkSharesTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон networkShares в процессе реализации'
            })
        ]
    });

    return networkSharesTemplate;
}
