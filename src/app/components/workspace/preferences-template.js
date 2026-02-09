import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон preferences для workspace
 * @returns {ElementCreator} - Элемент с шаблоном preferences
 */
export function renderPreferencesTemplate() {
    const preference = createElement('div', {
        className: 'gp__preference',
        children: [
            // preference__info
            createElement('div', {
                className: 'preference__info',
                children: [
                    // preference__settings
                    createElement('div', {
                        className: 'preference__settings',
                        children: [
                            createElement('div', {
                                className: 'preference__settings-title',
                                text: 'Настройки:'
                            }),
                            createElement('div', {
                                className: 'preference__settings-data'
                            })
                        ]
                    }),
                    // preference__description
                    createElement('div', {
                        className: 'preference__description',
                        children: [
                            createElement('div', {
                                className: 'preference__description-title',
                                text: 'Описание:'
                            }),
                            createElement('div', {
                                className: ['preference__description-data', 'disable']
                            })
                        ]
                    })
                ]
            }),
            // preference__divider
            createElement('div', {
                className: 'preference__divider',
                children: [
                    createElement('div', {
                        className: 'divider__line'
                    })
                ]
            }),
            // preference__data-table
            createElement('div', {
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
            })
        ]
    });

    return preference;
}
