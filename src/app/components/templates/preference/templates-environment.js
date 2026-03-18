import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон environment
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderEnvironmentTemplate() {
    const environmentTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон environment в процессе реализации'
            })
        ]
    });

    return environmentTemplate;
}
