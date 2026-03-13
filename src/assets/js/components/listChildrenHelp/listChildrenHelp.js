export function listChildrenHelp() {
    const btn = document.querySelector('.gp__control-help .button');
    const panel = document.querySelector('.gp__list-children-help');

    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
        panel.classList.toggle('is-open');
        //btn.classList.toggle('active');
    });
}
