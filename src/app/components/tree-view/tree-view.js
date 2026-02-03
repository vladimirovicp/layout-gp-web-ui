import { createElement } from '../../util/element-creator.js';

export function renderTreeView() {
    const element = createElement('div', {
        className: 'tree-view'
    });
    
    //container.appendChild(element.getElement());
    return element; // Возвращаем экземпляр ElementCreator для возможности использования его методов
}
