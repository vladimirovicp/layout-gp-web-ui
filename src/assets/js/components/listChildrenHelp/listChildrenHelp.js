export function listChildrenHelp() {
    const btn = document.querySelector('.gp__control-help .button');
    const panel = document.querySelector('.gp__list-children-help');

    const btnAdmx = document.querySelector('.gp__admx-help');

    if (!btn || !panel && !btnAdmx) return;

    if(panel){
        btn.addEventListener('click', () => {
            panel.classList.toggle('is-open');
            //btn.classList.toggle('active');
        });
    }

    if(btnAdmx){
        btn.addEventListener('click', () => {
            btnAdmx.classList.toggle('is-open');
            //btn.classList.toggle('active');
        });
    }

}
