import { createElement } from '../../../util/element-creator.js';
import { resizable } from '../../../util/resizable.js';
import { renderPreferencesCommonTemplate } from '../../workspace/preferences-template-common.js';
import { savePreferencesFromModal, resetModalFormToDefaults } from './create-preference.js';




function initHeaderButtons(header) {
    const headerEl = header?.getElement();
    const control = headerEl?.querySelector('.gp__control');
    const btnCreate = control?.querySelector('.preferences__btn-create');
    const btnEdit = control?.querySelector('.preferences__btn-edit');
    const btnDelete = control?.querySelector('.preferences__btn-delete');

    if (btnCreate && !btnCreate.classList.contains('active')) {
        btnCreate.classList.add('active');
    }
    if (btnEdit) btnEdit.classList.remove('active');
    if (btnDelete) btnDelete.classList.remove('active');

    const controlAdmx = headerEl?.querySelector('.gp__control-admx');
    const btnApply = controlAdmx?.querySelector('.admx__btn-apply');
    const btnCancel = controlAdmx?.querySelector('.admx__btn-cancel');
    if (btnApply) btnApply.classList.remove('active');
    if (btnCancel) btnCancel.classList.remove('active');

    const controlHelp = headerEl?.querySelector('.gp__control-help');
    const btnInformation = controlHelp?.querySelector('.btn-information');
    if (btnInformation) btnInformation.classList.remove('active');

    return { btnCreate, btnEdit, btnDelete, btnApply, btnCancel, btnInformation };
}

/**
 * Рендерит шаблон preferences для workspace
 * @returns {ElementCreator} - Элемент с шаблоном preferences
 */
export function renderPreferencesTemplate({ renderTable, getDataFromStorage, header } = {}) {
    const { btnCreate, btnEdit, btnDelete, btnApply, btnCancel, btnInformation } = initHeaderButtons(header);

    const list = getDataFromStorage ? getDataFromStorage() : [];
    if (list.length > 0) {
        if (btnEdit) btnEdit.classList.add('active');
        if (btnDelete) btnDelete.classList.add('active');
    }

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
                    renderTable ? renderTable() : null
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
                                                    resetModalFormToDefaults(modal);
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
                                        text: 'Отмена',
                                        events: {
                                            click: (event) => {
                                                const modal = event.target.closest('.preference__modal');
                                                if (modal) {
                                                    resetModalFormToDefaults(modal);
                                                    modal.classList.remove('active');
                                                }
                                            }
                                        }
                                    }),
                                    createElement('div', {
                                        className: ['btn', 'btn-ok'],
                                        text: 'Ок',
                                        events: {
                                            click: (event) => {
                                                const modal = event.target.closest('.preference__modal');
                                                if (!modal) return;
                                                const mode = modal.getAttribute('data-preferences-mode');
                                    if (mode === 'create' || mode === 'edit') {
                                    savePreferencesFromModal(modal);
                                    if (renderTable && getDataFromStorage) {
                                        const preferenceRoot = modal.closest('.gp__preference');
                                        const tableContainer = preferenceRoot?.querySelector('.preference__data-table');
                                        if (tableContainer) {
                                            const indexAttr = modal.getAttribute('data-preferences-index');
                                            const list = getDataFromStorage();
                                            const activeIndex = (indexAttr !== null && indexAttr !== '')
                                                ? Math.min(parseInt(indexAttr, 10), list.length - 1)
                                                : list.length - 1;
                                            tableContainer.innerHTML = '';
                                            tableContainer.appendChild(renderTable([], activeIndex).getElement());
                                        }
                                    }
                                    modal.classList.remove('active');
                                                }
                                            }
                                        }
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

    // Инициализация resizable для preference__divider после добавления в DOM
    const dividerElement = rootEl.querySelector('.preference__divider');
    const infoElement = rootEl.querySelector('.preference__info');
    const containerElement = rootEl;
    requestAnimationFrame(() => {
        if (dividerElement && infoElement && containerElement) {
            resizable(dividerElement, infoElement, containerElement, { minWidth: 100 });
        }
    });

    return preference;
}
