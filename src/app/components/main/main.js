import { createElement } from '../../util/element-creator.js';
import { renderTreeView } from '../tree-view/tree-view.js';
import { renderDivider } from '../divider/divider.js';
import { renderWorkspace } from '../workspace/workspace.js';

export function renderMain(container) {
    const workspace = renderWorkspace();
    const treeView = renderTreeView(workspace);
    const divider = renderDivider();
    
    const main = createElement('div', {
        className: 'gp__main',
        children: [treeView, divider, workspace]
    });
    
    container.appendChild(main.getElement());
    return { main, treeView, divider, workspace };
}
