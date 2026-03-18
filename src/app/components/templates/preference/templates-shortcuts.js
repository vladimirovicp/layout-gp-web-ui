import { createElement } from '../../../util/element-creator.js';

/**
 * Рендерит шаблон shortcuts
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderShortcutsTemplate() {
    const shortcutsTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон shortcuts в процессе реализации'
            })
        ]
    });

    return shortcutsTemplate;
}
