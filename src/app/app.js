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
import { initShortcutsStorage } from './util/mainLocalStorage/shortcuts.js';

const treeViewState = {
    selectedItem: null,
    workspace: null,
    header: null,
    currentViewCleanup: null,

    setWorkspace(workspace) {
        this.workspace = workspace;
    },

    setHeader(header) {
        this.header = header;
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

    setSelectedItem(item, element) {
        this.cleanupCurrentView();

        if (this.workspace) {
            this.workspace.clear();
        }

        this.setCurrentView(null);
        this.selectedItem = { item, element };

        if (item?.type === 'folder') {
            if (this.workspace) {
                const templateResult = renderFolderTemplate({
                    children: item.children ?? [],
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
}
