import { createElement } from '../../../util/element-creator.js';

/**
 * Рендерит шаблон files
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderFilesTemplate() {
    const filesTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон files в процессе реализации'
            })
        ]
    });

    return filesTemplate;
}
