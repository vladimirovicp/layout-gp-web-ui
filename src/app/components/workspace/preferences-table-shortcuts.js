import { createElement } from '../../util/element-creator.js';

/**
 * Создаёт строку таблицы ярлыков
 * @param {Object} row - Данные строки
 * @param {string} row.name - Имя
 * @param {string|number} row.order - Очередность
 * @param {string} row.action - Действие
 * @param {string|number} row.value - Значение
 * @param {string} row.user - Пользователь
 * @param {boolean} [row.active] - Активная строка
 * @returns {ElementCreator}
 */
function createTableRow(row, active = false) {
    return createElement('tr', {
        className: active ? 'active' : undefined,
        children: [
            createElement('td', { text: row.name ?? '' }),
            createElement('td', { text: String(row.order ?? '') }),
            createElement('td', { text: row.action ?? '' }),
            createElement('td', { text: String(row.value ?? '') })
        ]
    });
}

/**
 * Рендерит таблицу ярлыков (горячих клавиш)
 * @param {Array<Object>} [rows] - Данные строк таблицы
 * @returns {ElementCreator} - Элемент таблицы
 */
export function renderPreferencesTableShortcuts(rows = []) {
    const defaultRows = [
        { name: 'admin', order: 1, action: 'Создать', value: 100 },
        { name: 'admin', order: 1, action: 'Создать', value: 100 },
        { name: 'admin', order: 1, action: 'Создать', value: 100 },
        { name: 'admin', order: 1, action: 'Создать', value: 100 },
        { name: 'admin', order: 1, action: 'Создать', value: 100}
    ];

    const dataRows = rows.length > 0 ? rows : defaultRows;
    const tbodyRows = dataRows.map((row, index) =>
        createTableRow(row, index === 0)
    );

    return createElement('table', {
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
}
