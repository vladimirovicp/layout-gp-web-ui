/**
 * Инициализация localStorage с данными ярлыков (shortcuts)
 * Структура данных соответствует полям формы из документации Shortcuts.md
 */

// Данные ярлыков для инициализации
const shortcutsData = [
    {
        "ACTION": 3,
        "PIDL": "",
        "SHORTCUT_PATH": "Mail",
        "TARGET_TYPE": 2,
        "TARGET_PATH": "/usr/bin/thunderbird",
        "LOCATION": 1,
        "ARGUMENTS": "",
        "START_IN": "",
        "SHORTCUT_KEY": "",
        "WINDOW": 0,
        "COMMENT": "Комментарий для Mail",
        "ICON_PATH": "/usr/share/icons/default/application.png",
        "ICON_INDEX": ""
    },
    {
        "ACTION": 0,
        "PIDL": "",
        "SHORTCUT_PATH": "Mail",
        "TARGET_TYPE": 2,
        "TARGET_PATH": "/usr/bin/thunderbird",
        "LOCATION": 2,
        "ARGUMENTS": "",
        "START_IN": "",
        "SHORTCUT_KEY": "",
        "WINDOW": 0,
        "COMMENT": "",
        "ICON_PATH": "/usr/share/icons/default/application.png",
        "ICON_INDEX": ""
    },
    {
        "ACTION": 2,
        "PIDL": "",
        "SHORTCUT_PATH": "Mail",
        "TARGET_TYPE": 3,
        "TARGET_PATH": "/usr/bin/thunderbird",
        "LOCATION": 9,
        "ARGUMENTS": "",
        "START_IN": "",
        "SHORTCUT_KEY": "",
        "WINDOW": 0,
        "COMMENT": "",
        "ICON_PATH": "/usr/share/icons/default/application.png",
        "ICON_INDEX": ""
    }
];

// Инициализация localStorage
function initShortcutsLocalStorage() {
    // Проверяем, существует ли уже данные в localStorage
    if (!localStorage.getItem('shortcuts')) {
        // Сохраняем данные в localStorage
        localStorage.setItem('shortcuts', JSON.stringify(shortcutsData));
        console.log('Shortcuts localStorage initialized with 3 entries');
    } else {
        console.log('Shortcuts localStorage already exists');
    }
}

// Инициализируем при загрузке модуля
initShortcutsLocalStorage();

// Экспортируем функцию для повторной инициализации (если нужно)
export function resetShortcutsLocalStorage() {
    localStorage.removeItem('shortcuts');
    initShortcutsLocalStorage();
}

// Экспортируем функцию для получения данных
export function getShortcutsFromLocalStorage() {
    const data = localStorage.getItem('shortcuts');
    return data ? JSON.parse(data) : [];
}

// Экспортируем функцию для сохранения данных
export function saveShortcutsToLocalStorage(shortcuts) {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}
