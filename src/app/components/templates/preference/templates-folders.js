import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон folders
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderFoldersTemplate() {
    const foldersTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон folders в процессе реализации'
            })
        ]
    });

    return foldersTemplate;
}
