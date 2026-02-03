export function resizable(divider, panel, container, options = {}) {
    const minWidth = options.minWidth || 50;
    const maxWidth = options.maxWidth || container.offsetWidth - 50;
  
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
      const calculatedMaxWidth = maxWidth === container.offsetWidth - 50 
        ? container.offsetWidth - 50 
        : maxWidth;
  
      if (newWidth >= minWidth && newWidth <= calculatedMaxWidth) {
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