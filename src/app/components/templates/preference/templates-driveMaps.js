import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон driveMaps
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderDriveMapsTemplate() {
    const driveMapsTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон driveMaps в процессе реализации'
            })
        ]
    });

    return driveMapsTemplate;
}
