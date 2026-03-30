import { renderHeader } from './components/header/header';
import { renderMain } from './components/main/main';
import { renderFooter } from './components/footer/footer';
import { resizable } from './util/resizable.js';
import { renderDefaultTemplate } from './components/templates/default-template.js';
import { renderScriptsTemplate } from './components/templates/scripts-template.js';
import { renderAdmxTemplate } from './components/templates/admx-template.js';
import { renderFolderTemplate, renderHelpBlock } from './components/templates/folder-template.js';
import { renderShortcutsTemplate } from './components/templates/preference/templates-shortcuts.js';
import { renderEnvironmentTemplate } from './components/templates/preference/templates-environment.js';
import { renderFoldersTemplate } from './components/templates/preference/templates-folders.js';
import { renderRegistryTemplate } from './components/templates/preference/templates-registry.js';
import { renderDriveMapsTemplate } from './components/templates/preference/templates-driveMaps.js';
import { renderNetworkSharesTemplate } from './components/templates/preference/templates-networkShares.js';
import { renderFilesTemplate } from './components/templates/preference/templates-files.js';
import { renderIniFilesTemplate } from './components/templates/preference/templates-iniFiles.js';
import { setFolderOpenedState, setTreeItemActive } from './components/tree-view/tree-view-list.js';
import { createElement } from './util/element-creator.js';
import { initShortcutsStorage } from './util/mainLocalStorage/shortcuts.js';
import { initAdmxStorage } from './util/mainLocalStorage/admx.js';

const treeViewState = {
    selectedItem: null,
    selectedPath: [],
    workspace: null,
    header: null,
    isHelpOpen: false,
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

    initHelpControls() {
        const btnInformation = this.header?.getElement?.()
            ?.querySelector('.gp__control-help .btn-information');

        if (!btnInformation) {
            return;
        }

        btnInformation.addEventListener('click', () => {
            this.toggleHelp();
        });

        this.syncHelpButtonState();
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

    isFolderItemSelected() {
        return this.selectedItem?.item?.type === 'folder';
    },

    isAdmxItemSelected() {
        return this.selectedItem?.item?.type === 'file'
            && this.selectedItem?.item?.template === 'admx';
    },

    isHelpToggleAvailable() {
        return this.isFolderItemSelected() || this.isAdmxItemSelected();
    },

    getCurrentHelpSourceItem() {
        if (this.isFolderItemSelected()) {
            return this.selectedItem?.item ?? null;
        }

        return [...this.selectedPath]
            .reverse()
            .find((pathItem) => pathItem?.type === 'folder') ?? null;
    },

    buildViewWithPersistentHelp(view) {
        if (!this.isHelpOpen) {
            return view;
        }

        const helpSourceItem = this.getCurrentHelpSourceItem();
        const helpBlock = renderHelpBlock({
            help: helpSourceItem?.help,
            isOpen: this.isHelpOpen,
        });

        if (!helpBlock) {
            return view;
        }

        return createElement('div', {
            className: 'gp__list-children-wrapper',
            children: [view, helpBlock],
        });
    },

    syncHelpButtonState() {
        const btnInformation = this.header?.getElement?.()
            ?.querySelector('.gp__control-help .btn-information');

        if (!btnInformation) {
            return;
        }

        btnInformation.classList.toggle('active', this.isHelpToggleAvailable());
    },

    syncHelpBlockState() {
        const workspaceEl = this.workspace?.getElement?.();
        const helpBlocks = workspaceEl?.querySelectorAll('.gp__list-children-help, .gp__admx-help');

        if (!helpBlocks || helpBlocks.length === 0) {
            return;
        }

        helpBlocks.forEach((helpBlock) => {
            helpBlock.classList.toggle('is-open', this.isHelpOpen);
        });
    },

    setHelpOpen(opened) {
        this.isHelpOpen = Boolean(opened);
        this.syncHelpBlockState();
        return this.isHelpOpen;
    },

    toggleHelp() {
        if (!this.isHelpToggleAvailable()) {
            return this.isHelpOpen;
        }

        return this.setHelpOpen(!this.isHelpOpen);
    },

    renderSelectedItem(item, element = null) {
        this.cleanupCurrentView();

        if (this.workspace) {
            this.workspace.clear();
        }

        this.setCurrentView(null);
        this.selectedPath = this.getPathToItem(item);
        this.selectedItem = { item, element };
        let templateResult = null;
        let renderedWorkspaceView = null;

        console.log('item)',item);

        if (item?.type === 'folder') {
            templateResult = renderFolderTemplate({
                children: item.children ?? [],
                help: item.help,
                isHelpOpen: this.isHelpOpen,
                onItemClick: (childItem) => {
                    this.navigateToNode(childItem, {
                        openPath: true,
                        openCurrentFolder: childItem?.type === 'folder' ? true : undefined,
                    });
                },
            });
            renderedWorkspaceView = templateResult;
        } else if (item?.type === 'file') {
            if (item.template === 'scripts') {
                const headerClass = item.header?.class;

                if (headerClass === 'Machine') {
                    templateResult = renderScriptsTemplate();
                } else {
                    templateResult = renderDefaultTemplate();
                }
            } else if (item.template === 'admx') {
                templateResult = renderAdmxTemplate({
                    isHelpOpen: this.isHelpOpen,
                    item,
                    admxTreePath: item?.admxTreePath,
                });
            } else if (item.template !== 'preferences') {
                templateResult = renderDefaultTemplate();
            } else {
                const headerClass = item.header?.class;

                if (headerClass !== 'Machine') {
                    templateResult = renderDefaultTemplate();
                } else {
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
                    templateResult = renderTemplate({ header: this.header });
                }
            }

            renderedWorkspaceView = templateResult;
        }

        if (this.workspace && renderedWorkspaceView) {
            this.workspace.append(renderedWorkspaceView);
            this.setCurrentView(templateResult);
        }

        this.syncHelpButtonState();
        this.syncHelpBlockState();
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

// Запуск инициализации localStorage
initShortcutsStorage();
initAdmxStorage();
//end Запуск инициализации localStorage

const container = document.getElementById('gp__container');

if (container) {
    const header = renderHeader(container);
    treeViewState.setHeader(header);
    treeViewState.initHelpControls();

    const { main, treeView, divider } = renderMain(container, treeViewState);
    renderFooter(container);

    const dividerElement = divider.getElement();
    const treeViewElement = treeView.getElement();
    const mainElement = main.getElement();

    resizable(dividerElement, treeViewElement, mainElement);
    treeViewState.initializeSelection();
}
