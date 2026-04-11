import { createElement } from '../../util/element-creator.js';
import { renderTreeViewList } from './tree-view-list.js';
import { loadTreeViewList } from './tree-view-list-data.js';

const TREE_VIEW_MESSAGES = {
    loading: 'Loading policies...',
    error: 'Unable to load policies.',
};

function renderTreeViewStatus(type = 'loading') {
    const isError = type === 'error';
    const children = [];

    if (!isError) {
        children.push(createElement('span', {
            className: 'tree-view__status-spinner',
            attrs: {
                'aria-hidden': 'true',
            },
        }));
    }

    children.push(createElement('span', {
        className: 'tree-view__status-text',
        text: isError
            ? TREE_VIEW_MESSAGES.error
            : TREE_VIEW_MESSAGES.loading,
    }));

    return createElement('div', {
        className: ['tree-view__status', isError ? 'tree-view__status--error' : 'tree-view__status--loading'],
        attrs: {
            role: isError ? 'alert' : 'status',
            'aria-live': isError ? 'assertive' : 'polite',
        },
        children,
    });
}

async function initializeTreeView(element, workspace = null, treeViewState = null) {
    if (workspace && treeViewState) {
        treeViewState.setWorkspace(workspace);
        treeViewState.setTreeData([]);
    }

    element.clear();
    element.append(renderTreeViewStatus('loading'));

    try {
        const treeData = await loadTreeViewList();

        element.clear();
        element.append(renderTreeViewList(treeData, workspace, treeViewState));
        treeViewState?.initializeSelection?.();
    } catch (error) {
        console.error('[tree-view] Failed to load policy-en.json.', error);

        if (workspace) {
            workspace.clear();
        }

        if (treeViewState) {
            treeViewState.setTreeData([]);
            treeViewState.syncHelpButtonState?.();
            treeViewState.syncHelpBlockState?.();
        }

        element.clear();
        element.append(renderTreeViewStatus('error'));
    }
}

/**
 * Рендерит контейнер дерева с содержимым из tree-view-list.js
 * @param {ElementCreator} workspace - Элемент workspace для отображения выбранного элемента
 * @param {Object} treeViewState - State дерева (selectedItem, workspace, setWorkspace, setSelectedItem)
 * @returns {ElementCreator} - Контейнер дерева
 */
export function renderTreeView(workspace = null, treeViewState = null) {
    const element = createElement('div', {
        className: 'tree-view'
    });

    void initializeTreeView(element, workspace, treeViewState);

    return element;
}
