export function scripts(){

    const workspace = document.querySelector('.workspace');
    if(workspace){
        const scriptsModal = workspace.querySelector('.scripts__modal');

        if(scriptsModal){

            // скрытие модального окна
            const scripts_ModalHeader = scriptsModal.querySelector('.scripts__modal-header');
            const close = scripts_ModalHeader.querySelector('.close');

            close.addEventListener('click', function(event) {
                scriptsModal.classList.remove('active');
            })

            const tabButtons = scriptsModal.querySelector('.tab-buttons');

            const scriptsTabButton = tabButtons.querySelectorAll('.scripts__tab-button');

            const tabContents = scriptsModal.querySelectorAll('.tab-content');

            scriptsTabButton.forEach(tab => {
                tab.addEventListener('click', () => {
                    // если кликнули по уже активному — ничего не делаем
                    if (tab.classList.contains('active')) return;

                    // убираем active у всех
                    scriptsTabButton.forEach(btn => btn.classList.remove('active'));

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

        }
    }
}
