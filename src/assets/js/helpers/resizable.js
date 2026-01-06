export function resizable(dividerClass,firstPanelClass,containerClass){

  const divider = document.querySelector(dividerClass);
  const panel = document.querySelector(firstPanelClass);
  const container = document.querySelector(containerClass);

  let isResizing = false;
  let startX;
  let startWidth;

  divider.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = panel.offsetWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const newWidth = startWidth + (e.clientX - startX);
    const minWidth = 50; // Минимальная ширина левой панели
    const maxWidth = container.offsetWidth - 50; // Максимальная ширина (с учётом правой панели)

    if (newWidth > minWidth && newWidth < maxWidth) {
      panel.style.width = `${newWidth}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}