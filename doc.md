# Документация исправлений проекта gp-web-ui

## Введение

Данный документ содержит результаты аудита проекта **gp-web-ui** — веб-интерфейса для управления групповыми политиками (Group Policy). В документе перечислены все обнаруженные ошибки, опечатки и рекомендации по улучшению кода.

**Стек технологий:** Vite 7, SASS/SCSS, vanilla JS (ES modules)

---

## Структура проекта

```
layout-gp-web-ui_layout/
├── package.json              # gp-web-ui, Vite 7, SASS
├── vite.config.js
├── src/
│   ├── index.html, index.js
│   ├── assets/
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   ├── components/
│   │   │   │   ├── treeView/treeView.js
│   │   │   │   └── preference/preference.js
│   │   │   └── helpers/resizable.js
│   │   ├── styles/ (SCSS)
│   │   ├── fonts/, img/
│   └── pages/
│       ├── list/, tree/, test/
│       └── preference/
│           ├── index.html
│           ├── drive-maps.html
│           ├── environment.html
│           ├── files.html
│           ├── folders.html
│           ├── registry.html
│           ├── shares.html
│           ├── shortcuts.html
│           ├── ini-files.html
│           └── common-display.html
```

---

## 1. Опечатки в тексте

### 1.1 «Администранивные» → «Административные»

**Тип:** Опечатка в видимом тексте интерфейса  
**Приоритет:** Высокий (видна пользователю)

**Описание:** Пропущена буква «т» в слове «Административные» — написано «Администранивные».

**Затронутые файлы:**

| Файл | Строки |
|------|--------|
| `src/index.html` | 34, 169 |
| `src/pages/tree/index.html` | 33, 168 |
| `src/pages/preference/index.html` | 40, 175 |
| `src/pages/preference/drive-maps.html` | 34, 169 |
| `src/pages/preference/environment.html` | 34, 169 |
| `src/pages/preference/files.html` | 34, 169 |
| `src/pages/preference/folders.html` | 34, 169 |
| `src/pages/preference/registry.html` | 34, 169 |
| `src/pages/preference/shares.html` | 34, 169 |
| `src/pages/preference/shortcuts.html` | 34, 169 |
| `src/pages/preference/ini-files.html` | 34, 169 |
| `src/pages/preference/common-display.html` | 34, 169 |

**Исправление:**

```html
<!-- Было -->
<span class="tree-item__title">Администранивные шаблоны</span>

<!-- Стало -->
<span class="tree-item__title">Административные шаблоны</span>
```

---

### 1.2 `btn-oк` (кириллическая «к») → `btn-ok` (латинская «k»)

**Тип:** Ошибка CSS-класса (смешение кириллицы и латиницы)  
**Приоритет:** Высокий (CSS-стили не применяются к кнопке)

**Описание:** В HTML-атрибуте `class` используется кириллическая буква «к» (`btn-oк`), а CSS-стили написаны для класса `.btn-ok` с латинской «k». Из-за этого кнопка «Ок» не получает нужные стили.

**Затронутые файлы:**

| Файл | Строка |
|------|--------|
| `src/index.html` | 412 |
| `src/pages/preference/drive-maps.html` | 490 |
| `src/pages/preference/environment.html` | 447 |
| `src/pages/preference/files.html` | 438 |
| `src/pages/preference/folders.html` | 450 |
| `src/pages/preference/registry.html` | 446 |
| `src/pages/preference/shares.html` | 473 |
| `src/pages/preference/shortcuts.html` | 491 |
| `src/pages/preference/ini-files.html` | 412 |
| `src/pages/preference/common-display.html` | 497 |

**Исправление:**

```html
<!-- Было (кириллическая «к») -->
<div class="btn btn-oк">Ок</div>

<!-- Стало (латинская «k») -->
<div class="btn btn-ok">Ок</div>
```

---

### 1.3 `treeViev` → `treeView` в сообщении об ошибке

**Тип:** Опечатка в строке кода  
**Приоритет:** Низкий (не влияет на работу, только на читаемость логов)

**Файл:** `src/assets/js/components/treeView/treeView.js`, строка 33

**Описание:** В ветке `else` обработчика клика выводится сообщение об ошибке с опечаткой `treeViev` (вместо `treeView`).

**Исправление:**

```javascript
// Было
console.log('Error treeViev');

// Стало
console.log('Error treeView');
```

---

## 2. Ошибки HTML-разметки

### 2.1 Лишний закрывающий тег `</span>` перед `<ul>`

**Тип:** Невалидная HTML-разметка  
**Приоритет:** Высокий (нарушение структуры DOM, браузер автоматически исправляет, что может давать неожиданные результаты)

**Описание:** В блоке «Настройки системы» внутри `<li class="view folder opened">` присутствует лишний закрывающий `</span>` перед открывающим тегом `<ul class="tree-view__list">`. Это нарушает корректную вложенность тегов.

**Текущая (неверная) разметка:**
```html
<li class="view folder opened">
    <span class="tree-item">
        <span class="icon-switcher"></span>
        <span class="icon ico-folder"></span>
        <span class="tree-item__title">Настройки системы</span>
    </span>
</span>                              <!-- лишний закрывающий тег -->
<ul class="tree-view__list">
```

**Правильная разметка:**
```html
<li class="view folder opened">
    <span class="tree-item">
        <span class="icon-switcher"></span>
        <span class="icon ico-folder"></span>
        <span class="tree-item__title">Настройки системы</span>
    </span>
    <ul class="tree-view__list">
```

**Затронутые файлы (в каждом по 2–3 вхождения):**

| Файл | Строки (лишний `</span>`) |
|------|--------------------------|
| `src/index.html` | 85, 145 |
| `src/pages/tree/index.html` | 84, 144 |
| `src/pages/preference/index.html` | 91, 151 |
| `src/pages/preference/drive-maps.html` | 85, 145 |
| `src/pages/preference/environment.html` | 85, 145 |
| `src/pages/preference/files.html` | 85, 145 |
| `src/pages/preference/folders.html` | 85, 145 |
| `src/pages/preference/registry.html` | 85, 145 |
| `src/pages/preference/shares.html` | 85, 145 |
| `src/pages/preference/shortcuts.html` | 85, 145 |
| `src/pages/preference/ini-files.html` | 85, 145 |
| `src/pages/preference/common-display.html` | 85, 145 |

---

## 3. Конфигурация Vite

### 3.1 Неверное имя опции `minifyCSS`

**Тип:** Ошибка конфигурации  
**Приоритет:** Средний (опция игнорируется, сборка работает, но без ожидаемой минификации CSS)

**Файл:** `vite.config.js`, строка 12

**Описание:** В объекте `build` используется несуществующая опция `minifyCSS`, тогда как правильное название в Vite — `cssMinify`. Помимо этого, строкой выше уже задана `cssMinify: true`, поэтому возникает дублирование с конфликтующими значениями: `true` и `'lightningcss'`.

**Текущая конфигурация:**
```javascript
build: {
    minify: true,
    cssMinify: true,       // первое значение — boolean
    minifyCSS: 'lightningcss',  // неверное имя опции, игнорируется
    ...
}
```

**Исправление:** Убрать `cssMinify: true` и дать правильное имя опции:
```javascript
build: {
    minify: true,
    cssMinify: 'lightningcss',  // правильное имя
    ...
}
```

---

## 4. Рекомендации по коду

### 4.1 `resizable.js` — отсутствие проверок на `null`

**Тип:** Потенциальная ошибка времени выполнения  
**Приоритет:** Средний (падение при отсутствии DOM-элементов)

**Файл:** `src/assets/js/helpers/resizable.js`

**Описание:** Функция `resizable` получает DOM-элементы через `document.querySelector`, но не проверяет результат перед использованием. Если хотя бы один из селекторов не найдёт элемент (например, при вызове на странице без нужных компонентов), код выбросит `TypeError: Cannot read properties of null`.

**Текущий код (строки 3–5):**
```javascript
const divider = document.querySelector(dividerClass);
const panel = document.querySelector(firstPanelClass);
const container = document.querySelector(containerClass);

// далее сразу используются без проверки:
divider.addEventListener('mousedown', ...);
```

**Рекомендация:** Добавить проверку сразу после получения элементов:
```javascript
const divider = document.querySelector(dividerClass);
const panel = document.querySelector(firstPanelClass);
const container = document.querySelector(containerClass);

if (!divider || !panel || !container) return;
```

---

### 4.2 `preference.js` — возможный `null` у элемента `.close`

**Тип:** Потенциальная ошибка времени выполнения  
**Приоритет:** Средний (падение при отсутствии элемента)

**Файл:** `src/assets/js/components/preference/preference.js`, строки 43–47

**Описание:** Элемент `.close` ищется через `querySelector`, но перед вызовом `addEventListener` не проверяется на `null`. Если кнопка закрытия отсутствует в DOM, код выбросит `TypeError`.

**Текущий код:**
```javascript
const close = preference_ModalHeader.querySelector('.close');

close.addEventListener('click', function(event) {  // падёт если close === null
    preferenceModal.classList.remove('active');
})
```

**Рекомендация:** Добавить проверку:
```javascript
const close = preference_ModalHeader.querySelector('.close');

if (close) {
    close.addEventListener('click', function(event) {
        preferenceModal.classList.remove('active');
    });
}
```

---

## 5. Сводная таблица проблем

| # | Проблема | Тип | Файлов | Приоритет |
|---|----------|-----|--------|-----------|
| 1.1 | «Администранивные» → «Административные» | Опечатка в UI | 12 | Высокий |
| 1.2 | `btn-oк` (кириллица) → `btn-ok` (латиница) | Ошибка CSS-класса | 10 | Высокий |
| 2.1 | Лишний `</span>` перед `<ul>` | Невалидный HTML | 12 | Высокий |
| 3.1 | `minifyCSS` → `cssMinify` в Vite config | Ошибка конфигурации | 1 | Средний |
| 4.1 | Отсутствие null-проверок в `resizable.js` | Защитный код | 1 | Средний |
| 4.2 | Отсутствие null-проверки для `.close` | Защитный код | 1 | Средний |
| 1.3 | `treeViev` → `treeView` в console.log | Опечатка в коде | 1 | Низкий |
