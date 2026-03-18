import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон по умолчанию, когда шаблон не определен
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон не определен
 */
export function renderDefaultTemplate() {
    const defaultTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон не определен'
            })
        ]
    });

    return defaultTemplate;
}
