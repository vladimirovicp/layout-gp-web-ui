export function createSkeleton(container) {

    const leftPanel = document.createElement('div');
    leftPanel.id = 'leftPanel';
    leftPanel.className = 'left-panel';
    container.appendChild(leftPanel);

    const divider = document.createElement('div');
    divider.id = 'divider';
    divider.className = 'divider';
    container.appendChild(divider);

    const rightPanel = document.createElement('div');
    rightPanel.id = 'rightPanel';
    rightPanel.className = 'right-panel';
    container.appendChild(rightPanel);

}