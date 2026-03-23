import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит рабочую область для политики «Скрипты» (Machine).
 * @returns {ElementCreator}
 */
export function renderScriptsTemplate() {
    const defaultTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон скрипта не реализован'
            })
        ]
    });

    return defaultTemplate;
}
