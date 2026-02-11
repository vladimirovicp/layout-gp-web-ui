import { createElement } from '../../util/element-creator.js';
import { renderPreferencesCommonTemplate } from './preferences-template-common.js';

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
            }),
            createElement('div', {
                className: 'preference__modal',
                children: [
                    createElement('div', {
                        className: 'preference__modal-wrapper',
                        children: [
                            createElement('div', {
                                className: 'preference__modal-header',
                                children: [
                                    createElement('div', {
                                        className: 'title',
                                        text: 'Диалог настроек'
                                    }),
                                    createElement('div', {
                                        className: 'close',
                                        events: {
                                            click: (event) => {
                                                const modal = event.target.closest('.preference__modal');
                                                if (modal) {
                                                    modal.classList.remove('active');
                                                }
                                            }
                                        }
                                    })
                                ]
                            }),
                            createElement('div', {
                                className: 'preference__modal-content',
                                children: [
                                    createElement('div', {
                                        className: 'preference__modal-tabs',
                                        children: [
                                            createElement('div', {
                                                className: 'tab-buttons',
                                                children: [
                                                    createElement('div', {
                                                        className: ['preference__tab-button', 'active'],
                                                        attrs: {
                                                            'data-tab': 'tab-basic'
                                                        },
                                                        text: 'Основные настройки'
                                                    }),
                                                    createElement('div', {
                                                        className: ['preference__tab-button'],
                                                        attrs: {
                                                            'data-tab': 'tab-general'
                                                        },
                                                        text: 'Общие'
                                                    })
                                                ]
                                            }),
                                            createElement('div', {
                                                id: 'tab-basic',
                                                className: ['tab-content', 'active']
                                            }),
                                            createElement('div', {
                                                id: 'tab-general',
                                                className: ['tab-content'],
                                                children: [
                                                    renderPreferencesCommonTemplate()
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            createElement('div', {
                                className: 'preference__modal-footer',
                                children: [
                                    createElement('div', {
                                        className: ['btn', 'btn-cancel'],
                                        text: 'Отмена'
                                    }),
                                    createElement('div', {
                                        className: ['btn', 'btn-oк'],
                                        text: 'Ок'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });

    // Настройка переключения вкладок "Основные настройки" и "Общие"
    const rootEl = preference.getElement();

    const basicTabButton = rootEl.querySelector('.preference__tab-button[data-tab="tab-basic"]');
    const generalTabButton = rootEl.querySelector('.preference__tab-button[data-tab="tab-general"]');
    const basicTabContent = rootEl.querySelector('#tab-basic');
    const generalTabContent = rootEl.querySelector('#tab-general');

    if (basicTabButton && generalTabButton && basicTabContent && generalTabContent) {
        basicTabButton.addEventListener('click', () => {
            if (!basicTabButton.classList.contains('active')) {
                basicTabButton.classList.add('active');
                basicTabContent.classList.add('active');

                generalTabButton.classList.remove('active');
                generalTabContent.classList.remove('active');
            }
        });

        generalTabButton.addEventListener('click', () => {
            if (!generalTabButton.classList.contains('active')) {
                generalTabButton.classList.add('active');
                generalTabContent.classList.add('active');

                basicTabButton.classList.remove('active');
                basicTabContent.classList.remove('active');
            }
        });
    }

    return preference;
}
