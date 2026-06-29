export function scripts() {

    const workspace = document.querySelector('.workspace');
    if (!workspace) return;

    const gpScripts = workspace.querySelector('.gp__scripts');
    const scriptsModal = workspace.querySelector('.scripts__modal');

    if (!gpScripts || !scriptsModal) return;

    // Открытие модального окна по клику на «Запуск» / «Завершение работы»
    const openButtons = gpScripts.querySelectorAll('.btn-startup, .btn-shutdown');
    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scriptsModal.classList.add('active');
        });
    });

    // Скрытие модального окна
    const close = scriptsModal.querySelector('.scripts__modal-header .close');
    if (close) {
        close.addEventListener('click', () => {
            scriptsModal.classList.remove('active');
        });
    }

    // Переключение табов
    const tabButtons = scriptsModal.querySelectorAll('.scripts__tab-button');
    const tabContents = scriptsModal.querySelectorAll('.tab-content');

    tabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            // если кликнули по уже активному — ничего не делаем
            if (tab.classList.contains('active')) return;

            // убираем active у всех
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(el => el.classList.remove('active'));

            // добавляем active текущему
            tab.classList.add('active');

            const tabId = tab.dataset.tab;
            const activeContent = scriptsModal.querySelector(`#${tabId}`);

            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // Инициализация таблиц сценариев: выделение строк и перемещение вверх/вниз
    const windows = scriptsModal.querySelectorAll('.script__windows');
    windows.forEach(initScriptsTable);
}

function initScriptsTable(scriptWindows) {
    const dataBlock = scriptWindows.querySelector('.script__data');
    const tbody = dataBlock ? dataBlock.querySelector('tbody') : null;
    const btnUp = scriptWindows.querySelector('.btn-up');
    const btnDown = scriptWindows.querySelector('.btn-down');

    if (!dataBlock || !tbody || !btnUp || !btnDown) return;

    const getRows = () => Array.from(tbody.querySelectorAll('tr'));
    const getSelected = () => tbody.querySelector('tr.selected');

    // Управление состоянием кнопок .btn-up / .btn-down
    function updateButtonsState() {
        const rows = getRows();
        const selected = getSelected();

        // Менее двух значений или ничего не выделено — обе кнопки не активны
        if (rows.length < 2 || !selected) {
            btnUp.classList.add('disabled');
            btnDown.classList.add('disabled');
            return;
        }

        const index = rows.indexOf(selected);

        // Можно поднять выше, если ячейка не первая
        btnUp.classList.toggle('disabled', index === 0);
        // Можно опустить ниже, если ячейка не последняя
        btnDown.classList.toggle('disabled', index === rows.length - 1);
    }

    // Выделение строки по клику
    dataBlock.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        // Игнорируем клики вне tbody (заголовок и т.п.)
        if (!row || !tbody.contains(row)) return;

        tbody.querySelectorAll('tr.selected').forEach(tr => tr.classList.remove('selected'));
        row.classList.add('selected');
        updateButtonsState();
    });

    // Перемещение выделенной строки вверх
    btnUp.addEventListener('click', () => {
        if (btnUp.classList.contains('disabled')) return;
        const selected = getSelected();
        if (!selected) return;

        const prev = selected.previousElementSibling;
        if (prev) {
            tbody.insertBefore(selected, prev);
            updateButtonsState();
        }
    });

    // Перемещение выделенной строки вниз
    btnDown.addEventListener('click', () => {
        if (btnDown.classList.contains('disabled')) return;
        const selected = getSelected();
        if (!selected) return;

        const next = selected.nextElementSibling;
        if (next) {
            tbody.insertBefore(next, selected);
            updateButtonsState();
        }
    });

    updateButtonsState();
}
