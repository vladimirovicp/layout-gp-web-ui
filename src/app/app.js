import { createElement } from './util/element-creator';
import {renderHeader} from './components/header/header';
import {renderMain} from './components/main/main';
import {renderFooter} from './components/footer/footer';


const container = document.getElementById('gp__container');

if(container){
    const header = renderHeader(container);
    const main = renderMain(container);
    const footer = renderFooter(container);
    
    // Изменяем текст header на "header2" через 5 секунд используя ElementCreator
    setTimeout(() => {
        header.setText('header2');
    }, 5000);
}




