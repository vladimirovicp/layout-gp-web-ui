import { renderPreferencesTemplate } from './preferences-view-template.js';
import { renderPreferencesTableShortcuts } from './shortcuts/preferences-table-shortcuts.js';
import { getShortcutsFromLocalStorage } from '../../../util/mainLocalStorage/shortcuts.js';

/**
 * Рендерит шаблон shortcuts
 * @returns {ElementCreator} - Элемент с шаблоном preferences для shortcuts
 */
export function renderShortcutsTemplate({ header } = {}) {
    return renderPreferencesTemplate({
        renderTable: renderPreferencesTableShortcuts,
        getDataFromStorage: getShortcutsFromLocalStorage,
        header,
    });
}
