import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон при выборе папки в дереве
 * @returns {ElementCreator} - Элемент с сообщением о выборе папки
 */
export function renderFolderTemplate() {
    const folderTemplate = createElement('div', {
        className: 'gp__folder-template',
        children: [
            createElement('div', {
                className: 'folder-template__message',
                text: 'Нажата папка'
            })
        ]
    });

    return folderTemplate;
}
