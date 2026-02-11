import { createElement } from './util/element-creator';
import {renderHeader} from './components/header/header';
import {renderMain} from './components/main/main';
import {renderFooter} from './components/footer/footer';
import { resizable } from './util/resizable.js';
import { t } from './locales/translations.js';
import { renderPreferencesTemplate } from './components/workspace/preferences-template.js';
import { renderPreferencesShortcutsTemplate } from './components/workspace/preferences-template-shortcuts.js';
import { renderDefaultTemplate } from './components/tree-view/default-template.js';

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

        const template = item.template;

        //console.log(template);

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
                    const btnCreate = this.header.getElement().querySelector('.preferences__btn-create');
                    if (btnCreate) {
                        btnCreate.classList.add('active');
                        btnCreate.setAttribute('data-preferences-name', namePreference);
                        
                        // Добавляем обработчик события для кнопки
                        this.btnCreateHandler = (e) => {
                            if (btnCreate.classList.contains('active')) {
                                const preferencesName = btnCreate.getAttribute('data-preferences-name');
                                //console.log(preferencesName);

                                // Если выбрано "shortcuts", заполняем вкладку tab-basic шаблоном ярлыков
                                if (preferencesName === 'shortcuts') {
                                    const tabBasicElement = document.getElementById('tab-basic');

                                    if (tabBasicElement) {
                                        // Очищаем содержимое вкладки
                                        tabBasicElement.innerHTML = '';

                                        // Рендерим шаблон настроек ярлыка и добавляем его в tab-basic
                                        const shortcutsTemplate = renderPreferencesShortcutsTemplate();

                                        if (shortcutsTemplate && typeof shortcutsTemplate.getElement === 'function') {

                                            // Диалог настроек -> Основные настройки Добавляем шаблон "значоки"(shortcuts)
                                            tabBasicElement.appendChild(shortcutsTemplate.getElement());
                                        }
                                    }
                                }

                                // Добавляем класс active к модальному окну preference__modal в workspace
                                if (this.workspace) {
                                    const preferenceModal = this.workspace.getElement().querySelector('.preference__modal');
                                    if (preferenceModal) {
                                        preferenceModal.classList.add('active');
                                    }
                                }

                            }
                        };
                        btnCreate.addEventListener('click', this.btnCreateHandler);
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
            // Убираем класс active у header и кнопки preferences__btn-create
            if (this.header) {
                this.header.removeClass('active');
                const btnCreate = this.header.getElement().querySelector('.preferences__btn-create');
                if (btnCreate) {
                    btnCreate.classList.remove('active');
                }
            }
        }


        // if (this.workspace) {
        //     const titleElement = element.querySelector('.tree-item__title');
        //     if (titleElement) {
        //         const titleText = titleElement.textContent || titleElement.innerText;
        //         this.workspace.setText(titleText);
        //     }
        // }
    }
};

const container = document.getElementById('gp__container');

if(container){
    const header = renderHeader(container);
    treeViewState.setHeader(header);
    const { main, treeView, divider, workspace } = renderMain(container, treeViewState);
    const footer = renderFooter(container);



    // Инициализация resizable функционала после сборки компонентов
    const dividerElement = divider.getElement();
    const treeViewElement = treeView.getElement();
    const mainElement = main.getElement();
    
    resizable(dividerElement, treeViewElement, mainElement);
    
    // Изменяем текст header на "header2" через 5 секунд используя ElementCreator
    // setTimeout(() => {
    //     header.setText('header2');
    // }, 5000);


    // Пример вывода переводов

    console.log(t('policies.localGroupPolicy'));
}




