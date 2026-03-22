import { createElement } from '../../../util/element-creator.js';

/**
 * Рендерит шаблон iniFiles
 * @returns {ElementCreator} - Элемент с сообщением о том, что шаблон в процессе реализации
 */
export function renderIniFilesTemplate() {
    const iniFilesTemplate = createElement('div', {
        className: 'gp__default-template',
        children: [
            createElement('div', {
                className: 'default-template__message',
                text: 'Шаблон iniFiles в процессе реализации'
            })
        ]
    });

    return iniFilesTemplate;
}
