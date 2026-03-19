import { createElement } from './util/element-creator';
import {renderHeader} from './components/header/header';
import {renderMain} from './components/main/main';
import {renderFooter} from './components/footer/footer';
import { resizable } from './util/resizable.js';
import { t } from './locales/translations.js';
import { renderPreferencesShortcutsTemplate } from './components/templates/preference/shortcuts/preferences-template-shortcuts.js';
import { handleDeletePreference } from './components/templates/preference/delete-preference.js';
import { openModalForEdit } from './components/templates/preference/edit-preference.js';
import { setModalCreateMode, resetModalFormToDefaults } from './components/templates/preference/create-preference.js';
import { renderDefaultTemplate } from './components/templates/default-template.js';
import { renderShortcutsTemplate } from './components/templates/preference/templates-shortcuts.js';
import { renderEnvironmentTemplate } from './components/templates/preference/templates-environment.js';
import { renderFoldersTemplate } from './components/templates/preference/templates-folders.js';
import { renderRegistryTemplate } from './components/templates/preference/templates-registry.js';
import { renderDriveMapsTemplate } from './components/templates/preference/templates-driveMaps.js';
import { renderNetworkSharesTemplate } from './components/templates/preference/templates-networkShares.js';
import { renderFilesTemplate } from './components/templates/preference/templates-files.js';
import { renderIniFilesTemplate } from './components/templates/preference/templates-iniFiles.js';
import './util/mainLocalStorage/shortcuts.js';

/**
 * State для дерева: выбранный элемент и workspace
 */
const treeViewState = {
    selectedItem: null,
    workspace: null,
    header: null,
    btnCreateHandler: null,

    setWorkspace(workspace) {
        this.workspace = workspace;
    },

    setHeader(header) {
        this.header = header;
    },

    setSelectedItem(item, element) {
        // Удаляем предыдущий обработчик событий, если он существует
        if (this.btnCreateHandler && this.header) {
            const btnCreate = this.header.getElement().querySelector('.preferences__btn-create');
            if (btnCreate) {
                btnCreate.removeEventListener('click', this.btnCreateHandler);
            }
            this.btnCreateHandler = null;
        }

        this.selectedItem = { item, element };


        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        //console.log('item', item);
        // console.log('element', element);
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


        const type = item.type;

        //console.log('type', type);

        

        if(type === 'folder'){

        }

        if(type === 'file'){
            const template = item.template;

            if(template === 'preferences'){

                const headerClass = item.header.class;

                if (headerClass === 'Machine'){
                    const namePreference = item.name;

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

                        const renderTemplate = preferenceTemplateMap[namePreference] || renderDefaultTemplate;

                    if (this.workspace) {
                        this.workspace.clear();
                        const templateResult = renderTemplate({ header: this.header });
                        this.workspace.append(templateResult);
                    }
                }
            }

        }

    }
};

const container = document.getElementById('gp__container');

if(container){
    const header = renderHeader(container);
    treeViewState.setHeader(header);
    const { main, treeView, divider, workspace } = renderMain(container, treeViewState);
    //const footer = renderFooter(container);
    renderFooter(container)



    // Инициализация resizable функционала после сборки компонентов
    const dividerElement = divider.getElement();
    const treeViewElement = treeView.getElement();
    const mainElement = main.getElement();
    
    resizable(dividerElement, treeViewElement, mainElement);
}




