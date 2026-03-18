import { createElement } from './util/element-creator';
import {renderHeader} from './components/header/header';
import {renderMain} from './components/main/main';
import {renderFooter} from './components/footer/footer';
import { resizable } from './util/resizable.js';
import { t } from './locales/translations.js';
import { renderPreferencesTemplate } from './components/workspace/preferences-template.js';
import { renderPreferencesShortcutsTemplate } from './components/workspace/preferences-template-shortcuts.js';
import { handleDeletePreference } from './components/workspace/delete-preference.js';
import { openModalForEdit } from './components/workspace/edit-preference.js';
import { setModalCreateMode, resetModalFormToDefaults } from './components/workspace/create-preference.js';
import { renderDefaultTemplate } from './components/templates/default-template.js';
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

        console.log('item', item);
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

                    //shortcuts, 
                    //environment,
                    //folders,
                    //registry,
                    //driveMaps,
                    //networkShares,
                    //files,
                    //iniFiles,

                    
                    //console.log('namePreference', namePreference);
                }
                

                

                
            }

        }

        //const template = item.template;

/*
        
        if(template === 'preferences'){

            const namePreference = item.name;

            if(namePreference){
                if (this.workspace) {
                    // Очищаем workspace и добавляем шаблон preferences
                    this.workspace.clear();
                    const preferencesTemplate = renderPreferencesTemplate();
                    this.workspace.append(preferencesTemplate);
                }
                // Добавляем класс active к header и кнопке preferences__btn-create
                if (this.header) {
                    this.header.addClass('active');
                    const headerEl = this.header.getElement();
                    const btnCreate = headerEl.querySelector('.preferences__btn-create');
                    const btnEdit = headerEl.querySelector('.preferences__btn-edit');
                    const btnDelete = headerEl.querySelector('.preferences__btn-delete');

                    // Устанавливаем data-preferences-name и data-preferences-index для всех кнопок preferences (как для btn-create)
                    [btnCreate, btnEdit, btnDelete].forEach((btn) => {
                        if (btn) {
                            btn.setAttribute('data-preferences-name', namePreference);
                            //btn.removeAttribute('data-preferences-index');
                            if (btn !== btnCreate) btn.classList.remove('active'); // edit/delete active только при выборе строки
                        }
                    });

                    if (btnCreate) {
                        btnCreate.classList.add('active');
                        
                        // Добавляем обработчик события для кнопки
                        this.btnCreateHandler = (e) => {
                            if (btnCreate.classList.contains('active') && this.workspace) {
                                const preferenceModal = this.workspace.getElement().querySelector('.preference__modal');
                                if (preferenceModal) {
                                    const name = btnCreate.getAttribute('data-preferences-name');
                                    if (name != null) preferenceModal.setAttribute('data-preferences-name', name);
                                    resetModalFormToDefaults(preferenceModal);
                                    preferenceModal.removeAttribute('data-preferences-index');
                                    setModalCreateMode(preferenceModal);
                                    preferenceModal.classList.add('active');
                                }
                            }
                        };
                        btnCreate.addEventListener('click', this.btnCreateHandler);
                    }

                    if (btnEdit){
                        btnEdit.classList.add('active');

                    }

                    if (btnDelete){
                        btnDelete.classList.add('active');
                    }
                }
            }


        } else{
            if (this.workspace) {
                // Очищаем workspace и добавляем шаблон по умолчанию
                this.workspace.clear();
                const defaultTemplate = renderDefaultTemplate();
                this.workspace.append(defaultTemplate);
            }
            // Убираем класс active у header и кнопок preferences
            if (this.header) {
                this.header.removeClass('active');
                const headerEl = this.header.getElement();
                ['.preferences__btn-create', '.preferences__btn-edit', '.preferences__btn-delete'].forEach((sel) => {
                    const btn = headerEl.querySelector(sel);
                    if (btn) {
                        btn.classList.remove('active');
                        btn.removeAttribute('data-preferences-name');
                        btn.removeAttribute('data-preferences-index');
                    }
                });
            }
        }
*/

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

    document.addEventListener('preferences-row-select', (e) => {
        const headerEl = header.getElement();
        const btnCreate = headerEl.querySelector('.preferences__btn-create');
        const btnDelete = headerEl.querySelector('.preferences__btn-delete');
        const btnEdit = headerEl.querySelector('.preferences__btn-edit');
        const index = e.detail.index;
        const name = btnCreate?.getAttribute('data-preferences-name');
        // data-preferences-index и data-preferences-name для всех кнопок — как для btn-create
        [btnCreate, btnEdit, btnDelete].forEach((btn) => {
            if (btn) {
                btn.setAttribute('data-preferences-index', String(index));
                if (name != null) btn.setAttribute('data-preferences-name', name);
            }
        });
        if (btnDelete) btnDelete.classList.add('active');
        if (btnEdit) btnEdit.classList.add('active');
    });

    const btnDelete = header.getElement().querySelector('.preferences__btn-delete');
    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            if (btnDelete.classList.contains('active')) {
                handleDeletePreference(btnDelete, workspace);
            }
        });
    }

    const btnEdit = header.getElement().querySelector('.preferences__btn-edit');
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            if (btnEdit.classList.contains('active') && workspace) {
                const preferenceModal = workspace.getElement().querySelector('.preference__modal');
                if (preferenceModal) {
                    const name = btnEdit.getAttribute('data-preferences-name');

                    const tabBasicElement = document.getElementById('tab-basic');
                    if (tabBasicElement) {
                        tabBasicElement.innerHTML = '';
                        if (name === 'shortcuts') {
                            const shortcutsTemplate = renderPreferencesShortcutsTemplate();

                            console.log(shortcutsTemplate);


                            if (shortcutsTemplate && typeof shortcutsTemplate.getElement === 'function') {
                                tabBasicElement.appendChild(shortcutsTemplate.getElement());
                            }
                        }
                    }

                    openModalForEdit(btnEdit, preferenceModal);
                }
            }
        });
    }

    // Изменяем текст header на "header2" через 5 секунд используя ElementCreator
    // setTimeout(() => {
    //     header.setText('header2');
    // }, 5000);


    // Пример вывода переводов

    console.log(t('policies.localGroupPolicy'));
}




