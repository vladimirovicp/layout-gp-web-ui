import { createElement } from '../../util/element-creator.js';

export function renderDivider() {
    const dividerLine = createElement('div', {
        className: 'divider__line'
    });
    
    const element = createElement('div', {
        className: 'divider',
        children: [dividerLine]
    });
    
    return element; // Возвращаем экземпляр ElementCreator для возможности использования его методов
}
