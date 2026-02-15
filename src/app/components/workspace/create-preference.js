import { getShortcutsFromLocalStorage, saveShortcutsToLocalStorage } from '../../util/mainLocalStorage/shortcuts.js';

/** Поля ярлыков, которые в localStorage хранятся как number */
const SHORTCUT_NUMBER_KEYS = ['ACTION', 'TARGET_TYPE', 'LOCATION', 'WINDOW', 'ICON_INDEX'];

/**
 * Получает значение из элемента поля (input, select, textarea, checkbox).
 * @param {HTMLElement} fieldEl - контейнер поля с data-name
 * @returns {string|number|boolean} - значение поля
 */
function getFieldValue(fieldEl) {
    const element = fieldEl.querySelector('.field__element input, .field__element select, .field__element textarea');
    if (!element) return '';

    const tagName = element.tagName.toLowerCase();
    const type = (element.type || '').toLowerCase();

    if (tagName === 'select') {
        return element.value;
    }
    if (tagName === 'input' && (type === 'checkbox' || type === 'radio')) {
        return element.checked;
    }
    if (tagName === 'input' && type === 'number') {
        const v = element.value;
        return v === '' ? '' : Number(v);
    }
    return element.value;
}

/**
 * Собирает данные из вкладки #tab-basic: обходит элементы с data-name,
 * определяет ключ записи и берёт выбранное/введённое значение.
 * @param {HTMLElement} tabBasicEl - элемент #tab-basic
 * @returns {Record<string, string|number|boolean>} - объект { dataName: value }
 */
export function collectPreferencesFromTabBasic(tabBasicEl) {
    if (!tabBasicEl) return {};

    const data = {};
    const fields = tabBasicEl.querySelectorAll('[data-name]');

    fields.forEach((fieldEl) => {
        const name = fieldEl.getAttribute('data-name');
        if (!name) return;
        // Пропускаем декоративные элементы (например field__line)
        const valueEl = fieldEl.querySelector('.field__element input, .field__element select, .field__element textarea');
        if (!valueEl) return;
        data[name] = getFieldValue(fieldEl);
    });

    return data;
}

/**
 * Устанавливает режим модалки «создание» (data-preferences-mode="create").
 * Вызывать при открытии модалки по кнопке создания.
 * @param {HTMLElement} modalEl - элемент .preference__modal
 */
export function setModalCreateMode(modalEl) {
    if (!modalEl) return;
    modalEl.setAttribute('data-preferences-mode', 'create');
}

/**
 * Определяет ключ localStorage по модалке (data-preferences-name) и сохраняет
 * собранные данные в localStorage. Для "shortcuts" обновляет/добавляет элемент в массив.
 * @param {HTMLElement} modalEl - элемент .preference__modal
 */
export function savePreferencesFromModal(modalEl) {
    if (!modalEl) return;

    const storageKey = modalEl.getAttribute('data-preferences-name');
    if (!storageKey) return;

    const tabBasic = modalEl.querySelector('#tab-basic');
    const collected = collectPreferencesFromTabBasic(tabBasic);
    if (Object.keys(collected).length === 0) return;

    if (storageKey === 'shortcuts') {
        const normalized = { ...collected };
        SHORTCUT_NUMBER_KEYS.forEach((key) => {
            if (key in normalized && normalized[key] !== '') {
                const n = Number(normalized[key]);
                normalized[key] = Number.isNaN(n) ? normalized[key] : n;
            }
        });
        // TARGET_TYPE: 0 (FILESYSTEM), 1 (URL), 2 (SHELL) — всегда число
        if ('TARGET_TYPE' in normalized) {
            const v = Number(normalized.TARGET_TYPE);
            normalized.TARGET_TYPE = Number.isNaN(v) ? 0 : Math.max(0, Math.min(2, Math.floor(v)));
        }
        const list = getShortcutsFromLocalStorage();
        const indexAttr = modalEl.getAttribute('data-preferences-index');
        const index = indexAttr !== null && indexAttr !== '' ? parseInt(indexAttr, 10) : -1;
        if (index >= 0 && index < list.length) {
            list[index] = { ...list[index], ...normalized };
        } else {
            list.push(normalized);
        }
        saveShortcutsToLocalStorage(list);
    } else {
        localStorage.setItem(storageKey, JSON.stringify(collected));
    }
}
