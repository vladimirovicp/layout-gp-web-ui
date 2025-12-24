export function loadMainStyles() {
    loadStyles('../css/reset.css');
    loadStyles('./css/style.css');
}

function loadStyles(href) {
  // Проверка, не загружен ли уже этот файл
  if (document.querySelector(`link[href="${href}"]`)) {
    return; // Уже подключён
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

