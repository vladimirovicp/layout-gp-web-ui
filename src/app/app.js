import {renderHeader} from './components/header/header';
import {renderFooter} from './components/footer/footer';


const container = document.getElementById('gp__container');

if(container){
    const header = renderHeader(container);
    const footer = renderFooter(container);
    
    // Изменяем текст header на "header2" через 5 секунд
    setTimeout(() => {
        header.textContent = 'header2';
    }, 5000);
}


console.log('app');




