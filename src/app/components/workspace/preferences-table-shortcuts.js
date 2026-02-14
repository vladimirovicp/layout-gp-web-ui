import { createElement } from '../../util/element-creator.js';
import { getShortcutsFromLocalStorage } from '../../util/mainLocalStorage/shortcuts.js';

const ACTION_LABELS = { 0: 'Создать', 1: 'Заменить', 2: 'Обновить', 3: 'Удалить' };

/**
 * Создаёт строку таблицы ярлыков
 * @param {Object} row - Данные строки (SHORTCUT_PATH, order, ACTION, TARGET_PATH или name, action, value)
 * @param {boolean} [active] - Активная строка
 * @returns {ElementCreator}
 */
function createTableRow(row, active = false) {
    const name = row.SHORTCUT_PATH ?? row.name ?? '';
    const order = row.order ?? '';
    const actionText = row.ACTION != null
        ? (typeof row.ACTION === 'number' ? ACTION_LABELS[row.ACTION] : row.ACTION)
        : (row.action ?? '');
    const target = row.TARGET_PATH ?? row.value ?? '';
    return createElement('tr', {
        className: active ? 'active' : undefined,
        events: {
            click: (event) => {
                const tbody = event.currentTarget.closest('tbody');
                if (tbody) {
                    tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                }
                document.dispatchEvent(new CustomEvent('preferences-row-select', { detail: { index: row.order } }));
            }
        },
        children: [
            createElement('td', { text: String(name) }),
            createElement('td', { text: String(order) }),
            createElement('td', { text: String(actionText) }),
            createElement('td', { text: String(target) })
        ]
    });
}

/**
 * Рендерит таблицу ярлыков (горячих клавиш)
 * @param {Array<Object>} [rows] - Данные строк таблицы
 * @param {number} [activeIndex=0] - Индекс строки, которой задать класс active
 * @returns {ElementCreator} - Элемент таблицы
 */
export function renderPreferencesTableShortcuts(rows = [], activeIndex = 0) {
    const shortcuts = getShortcutsFromLocalStorage();
    const defaultRows = shortcuts.map((item, index) => ({
        SHORTCUT_PATH: item.SHORTCUT_PATH ?? '',
        order: index,
        ACTION: item.ACTION,
        TARGET_PATH: item.TARGET_PATH ?? ''
    }));

    const dataRows = rows.length > 0 ? rows : defaultRows;

    if (dataRows.length === 0) {
        return createElement('div', {
            className: 'preference__data-table',
            children: [
                createElement('div', {
                    className: 'preference__data-empty',
                    children: [
                        createElement('div', {
                            className: 'preference__data-message',
                            text: 'В настоящий момент политик не добавлено'
                        })
                    ]
                })
            ]
        });
    }

    const safeActiveIndex = Math.max(0, Math.min(activeIndex, dataRows.length - 1));
    const tbodyRows = dataRows.map((row, index) =>
        createTableRow(row, index === safeActiveIndex)
    );

    const table = createElement('table', {
        className: 'preference__table',
        children: [
            createElement('thead', {
                children: [
                    createElement('tr', {
                        children: [
                            createElement('th', { text: 'Имя' }),
                            createElement('th', { text: 'Очерёдность' }),
                            createElement('th', { text: 'Действие' }),
                            createElement('th', { text: 'Цель' }),
                        ]
                    })
                ]
            }),
            createElement('tbody', {
                children: tbodyRows
            })
        ]
    });

    document.dispatchEvent(new CustomEvent('preferences-row-select', { detail: { index: safeActiveIndex } }));

    return table;
}
