import { createElement } from './util/element-creator';
import {renderHeader} from './components/header/header';
import {renderMain} from './components/main/main';
import {renderFooter} from './components/footer/footer';
import { resizable } from './util/resizable.js';



const container = document.getElementById('gp__container');

if(container){
    const header = renderHeader(container);
    const { main, treeView, divider, workspace } = renderMain(container);
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
}




