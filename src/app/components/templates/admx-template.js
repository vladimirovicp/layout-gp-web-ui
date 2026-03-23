import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит рабочую область для политики из административных шаблонов (ADMX).
 * @returns {ElementCreator}
 */
export function renderAdmxTemplate() {
    const defaultTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон ADMX не реализован'
            })
        ]
    });

    return defaultTemplate;
}
