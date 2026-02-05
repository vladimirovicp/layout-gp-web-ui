import { createElement } from '../../util/element-creator.js';
import { renderTreeViewList } from './tree-view-list.js';

/**
 * Рендерит контейнер дерева с содержимым из tree-view-list.js
 * @param {ElementCreator} workspace - Элемент workspace для отображения выбранного элемента
 * @param {Object} treeViewState - State дерева (selectedItem, workspace, setWorkspace, setSelectedItem)
 * @returns {ElementCreator} - Контейнер дерева
 */
export function renderTreeView(workspace = null, treeViewState = null) {
    const element = createElement('div', {
        className: 'tree-view',
        children: [renderTreeViewList(undefined, workspace, treeViewState)]
    });
    
    return element;
}
