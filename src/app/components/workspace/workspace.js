import { createElement } from '../../util/element-creator.js';

export function renderWorkspace() {
    const element = createElement('div', {
        className: 'workspace'
    });
    
    return element; // Возвращаем экземпляр ElementCreator для возможности использования его методов
}
