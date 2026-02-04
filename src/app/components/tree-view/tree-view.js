import { createElement } from '../../util/element-creator.js';
import { renderTreeViewList } from './tree-view-list.js';

/**
 * Рендерит контейнер дерева с содержимым из tree-view-list.js
 * @returns {ElementCreator} - Контейнер дерева
 */
export function renderTreeView() {
    const element = createElement('div', {
        className: 'tree-view',
        children: [renderTreeViewList()]
    });
    
    return element;
}
