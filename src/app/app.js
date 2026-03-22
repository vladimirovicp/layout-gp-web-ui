import { renderHeader } from './components/header/header';
import { renderMain } from './components/main/main';
import { renderFooter } from './components/footer/footer';
import { resizable } from './util/resizable.js';
import { renderDefaultTemplate } from './components/templates/default-template.js';
import { renderFolderTemplate } from './components/templates/folder-template.js';
import { renderShortcutsTemplate } from './components/templates/preference/templates-shortcuts.js';
import { renderEnvironmentTemplate } from './components/templates/preference/templates-environment.js';
import { renderFoldersTemplate } from './components/templates/preference/templates-folders.js';
import { renderRegistryTemplate } from './components/templates/preference/templates-registry.js';
import { renderDriveMapsTemplate } from './components/templates/preference/templates-driveMaps.js';
import { renderNetworkSharesTemplate } from './components/templates/preference/templates-networkShares.js';
import { renderFilesTemplate } from './components/templates/preference/templates-files.js';
import { renderIniFilesTemplate } from './components/templates/preference/templates-iniFiles.js';
import { setFolderOpenedState, setTreeItemActive } from './components/tree-view/tree-view-list.js';
import { initShortcutsStorage } from './util/mainLocalStorage/shortcuts.js';

const treeViewState = {
    selectedItem: null,
    selectedPath: [],
    workspace: null,
    header: null,
    currentViewCleanup: null,
    treeData: [],
    treeItemElements: new WeakMap(),
    treeListItemElements: new WeakMap(),
    parentItems: new WeakMap(),

    setWorkspace(workspace) {
        this.workspace = workspace;
    },

    setTreeData(treeData) {
        this.treeData = Array.isArray(treeData)
            ? treeData
            : [];
    },

    setHeader(header) {
        this.header = header;
    },

    registerTreeNode(item, { treeItemElement = null, listItemElement = null, parentItem = null } = {}) {
        if (!item) {
            return;
        }

        if (treeItemElement instanceof Element) {
            this.treeItemElements.set(item, treeItemElement);
        }

        if (listItemElement instanceof Element) {
            this.treeListItemElements.set(item, listItemElement);
        }

        if (parentItem) {
            this.parentItems.set(item, parentItem);
            return;
        }

        this.parentItems.delete(item);
    },

    getPathToItem(item) {
        if (!item) {
            return [];
        }

        const path = [];
        let currentItem = item;

        while (currentItem) {
            path.unshift(currentItem);
            currentItem = this.parentItems.get(currentItem) ?? null;
        }

        return path;
    },

    setFolderOpened(item, opened) {
        if (item?.type !== 'folder') {
            return Boolean(item?.opened);
        }

        const listItemElement = this.treeListItemElements.get(item) ?? null;
        return setFolderOpenedState(listItemElement, item, opened);
    },

    toggleFolder(item) {
        if (item?.type !== 'folder' || !Array.isArray(item.children) || item.children.length === 0) {
            return Boolean(item?.opened);
        }

        return this.setFolderOpened(item, !item.opened);
    },

    openPathToItem(item) {
        const path = this.getPathToItem(item);

        path.slice(0, -1).forEach((pathItem) => {
            if (pathItem?.type === 'folder') {
                this.setFolderOpened(pathItem, true);
            }
        });

        return path;
    },

    activateTreeItem(item, treeItemElement = null) {
        const nextTreeItemElement = treeItemElement ?? this.treeItemElements.get(item) ?? null;

        if (!nextTreeItemElement) {
            return null;
        }

        const treeContainer = nextTreeItemElement.closest('.tree-view') ?? document;
        return setTreeItemActive(nextTreeItemElement, treeContainer);
    },

    cleanupCurrentView() {
        if (typeof this.currentViewCleanup === 'function') {
            this.currentViewCleanup();
        }

        this.currentViewCleanup = null;
    },

    setCurrentView(view) {
        this.currentViewCleanup = typeof view?.cleanup === 'function'
            ? view.cleanup
            : null;
    },

    renderSelectedItem(item, element = null) {
        this.cleanupCurrentView();

        if (this.workspace) {
            this.workspace.clear();
        }

        this.setCurrentView(null);
        this.selectedPath = this.getPathToItem(item);
        this.selectedItem = { item, element };

        if (item?.type === 'folder') {
            if (this.workspace) {
                const templateResult = renderFolderTemplate({
                    children: item.children ?? [],
                    onItemClick: (childItem) => {
                        this.navigateToNode(childItem, {
                            openPath: true,
                            openCurrentFolder: childItem?.type === 'folder' ? true : undefined,
                        });
                    },
                });
                this.workspace.append(templateResult);
                this.setCurrentView(templateResult);
            }
            return;
        }

        if (item?.type !== 'file') {
            return;
        }

        if (item.template !== 'preferences') {
            if (this.workspace) {
                const templateResult = renderDefaultTemplate();
                this.workspace.append(templateResult);
                this.setCurrentView(templateResult);
            }
            return;
        }

        const headerClass = item.header?.class;
        if (headerClass !== 'Machine') {
            if (this.workspace) {
                const templateResult = renderDefaultTemplate();
                this.workspace.append(templateResult);
                this.setCurrentView(templateResult);
            }
            return;
        }

        const preferenceTemplateMap = {
            shortcuts: renderShortcutsTemplate,
            environment: renderEnvironmentTemplate,
            folders: renderFoldersTemplate,
            registry: renderRegistryTemplate,
            driveMaps: renderDriveMapsTemplate,
            networkShares: renderNetworkSharesTemplate,
            files: renderFilesTemplate,
            iniFiles: renderIniFilesTemplate,
        };

        const renderTemplate = preferenceTemplateMap[item.name] || renderDefaultTemplate;

        if (this.workspace) {
            const templateResult = renderTemplate({ header: this.header });
            this.workspace.append(templateResult);
            this.setCurrentView(templateResult);
        }
    },

    navigateToNode(item, { treeItemElement = null, openPath = true, openCurrentFolder = undefined } = {}) {
        if (!item) {
            return;
        }

        if (openPath) {
            this.openPathToItem(item);
        }

        if (item.type === 'folder' && openCurrentFolder !== undefined) {
            this.setFolderOpened(item, openCurrentFolder);
        }

        const activeTreeItemElement = this.activateTreeItem(item, treeItemElement);
        this.renderSelectedItem(item, activeTreeItemElement);
    },

    initializeSelection() {
        if (this.selectedItem?.item) {
            return;
        }

        const firstRootItem = this.treeData[0] ?? null;

        if (!firstRootItem) {
            return;
        }

        this.navigateToNode(firstRootItem, {
            openPath: true,
            openCurrentFolder: firstRootItem.type === 'folder' ? true : undefined,
        });
    }
};

initShortcutsStorage();

const container = document.getElementById('gp__container');

if (container) {
    const header = renderHeader(container);
    treeViewState.setHeader(header);

    const { main, treeView, divider } = renderMain(container, treeViewState);
    renderFooter(container);

    const dividerElement = divider.getElement();
    const treeViewElement = treeView.getElement();
    const mainElement = main.getElement();

    resizable(dividerElement, treeViewElement, mainElement);
    treeViewState.initializeSelection();
}
