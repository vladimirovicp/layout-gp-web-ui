import { resizable } from '../../helpers/resizable.js';

export function preference(){

    const workspace = document.querySelector('.workspace');
    if(workspace){
        const preference = workspace.querySelector('.gp__preference');
        if(preference){
            const divider = preference.querySelector('.preference__divider');

            if(divider){
                resizable('.preference__divider', '.preference__info', '.gp__preference');
            }
        } 
    }

    //Реакция клика правой кнопки на таблицу, делаем её активной

    if(workspace){
        const table = workspace.querySelector('.preference__table');

        if(table){
            table.addEventListener('click', function(event) {
                // Игнорируем клики не по строкам tbody
                const row = event.target.closest('tr');
                if (!row || !table.contains(row) || row.querySelector('th')) return;

                // Удаляем класс 'active' у всех строк
                table.querySelectorAll('tr.active').forEach(tr => tr.classList.remove('active'));

                // Добавляем класс 'active' к текущей строке
                row.classList.add('active');
            });
        }


        //модальное окно настроек
        const preferenceModal = workspace.querySelector('.preference__modal');

        if(preferenceModal){

            // скрытие модального окна
            const preference_ModalHeader = preferenceModal.querySelector('.preference__modal-header');
            const close = preference_ModalHeader.querySelector('.close');

            close.addEventListener('click', function(event) {
                preferenceModal.classList.remove('active');
            })


            const tabButtons = preferenceModal.querySelector('.tab-buttons');

            const preferenceTabButton = tabButtons.querySelectorAll('.preference__tab-button');

            const tabContents = preferenceModal.querySelectorAll('.tab-content');

            preferenceTabButton.forEach(tab => {
                tab.addEventListener('click', () => {
                    // если кликнули по уже активному — ничего не делаем
                    if (tab.classList.contains('active')) return;

                    // убираем active у всех
                    preferenceTabButton.forEach(btn => btn.classList.remove('active'));

                    tabContents.forEach(el => el.classList.remove('active'));

                    // добавляем active текущему
                    tab.classList.add('active');

                    const tabId = tab.dataset.tab;

                    

                    const activeContent = preferenceModal.querySelector(`#${tabId}`);

                    if (activeContent) {
                        activeContent.classList.add('active');
                    }                    
                });
            });



        }




    }







}