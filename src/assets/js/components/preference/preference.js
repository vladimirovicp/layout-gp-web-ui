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



}