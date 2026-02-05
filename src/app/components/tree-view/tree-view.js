import { createElement } from '../../util/element-creator.js';
import { renderTreeViewList } from './tree-view-list.js';

/**
 * Рендерит контейнер дерева с содержимым из tree-view-list.js
 * @param {ElementCreator} workspace - Элемент workspace для отображения выбранного элемента
 * @returns {ElementCreator} - Контейнер дерева
 */
export function renderTreeView(workspace = null) {
    const element = createElement('div', {
        className: 'tree-view',
        children: [renderTreeViewList(undefined, workspace)]
    });
    
    return element;
}
