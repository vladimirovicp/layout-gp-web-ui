import { createElement } from './util/element-creator';
import {renderHeader} from './components/header/header';
import {renderMain} from './components/main/main';
import {renderFooter} from './components/footer/footer';
import { resizable } from './util/resizable.js';
import { t } from './locales/translations.js';
import { renderPreferencesTemplate } from './components/workspace/preferences-template.js';

/**
 * State для дерева: выбранный элемент и workspace
 */
const treeViewState = {
    selectedItem: null,
    workspace: null,

    setWorkspace(workspace) {
        this.workspace = workspace;
    },

    setSelectedItem(item, element) {
        this.selectedItem = { item, element };

        const template = item.template;

        console.log(template);

        if(template === 'preferences'){
            if (this.workspace) {
                // Очищаем workspace и добавляем шаблон preferences
                this.workspace.clear();
                const preferencesTemplate = renderPreferencesTemplate();
                this.workspace.append(preferencesTemplate);
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
    const { main, treeView, divider, workspace } = renderMain(container, treeViewState);
    const footer = renderFooter(container);



    // Инициализация resizable функционала после сборки компонентов
    const dividerElement = divider.getElement();
    const treeViewElement = treeView.getElement();
    const mainElement = main.getElement();
    
    resizable(dividerElement, treeViewElement, mainElement);
    
    // Изменяем текст header на "header2" через 5 секунд используя ElementCreator
    setTimeout(() => {
        header.setText('header2');
    }, 5000);


    // Пример вывода переводов

    console.log(t('policies.localGroupPolicy'));
}




