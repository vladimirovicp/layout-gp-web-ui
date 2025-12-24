export function resizable(dividerID,firstPanelID,containerClass){
  const divider = document.getElementById(dividerID);
  const leftPanel = document.getElementById(firstPanelID);
  const container = document.querySelector(containerClass);

  let isResizing = false;
  let startX;
  let startWidth;

  divider.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = leftPanel.offsetWidth;
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
      leftPanel.style.width = `${newWidth}px`;
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