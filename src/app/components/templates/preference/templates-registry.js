import { createElement } from '../../../util/element-creator.js';

/**
 * Рендерит шаблон registry
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderRegistryTemplate() {
    const registryTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон registry в процессе реализации'
            })
        ]
    });

    return registryTemplate;
}
