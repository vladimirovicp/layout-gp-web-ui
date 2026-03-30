import { createElement } from '../../util/element-creator.js';

function addManagedEventListener(cleanups, target, eventName, handler, options) {
    if (!target || typeof target.addEventListener !== 'function' || typeof handler !== 'function') {
        return;
    }

    target.addEventListener(eventName, handler, options);
    cleanups.push(() => target.removeEventListener(eventName, handler, options));
}

function formatExplainText(explainText = '') {
    return explainText
        .split(/\r?\n/)
        .flatMap((line, index, lines) => (index < lines.length - 1 ? [line, createElement('br')] : [line]));
}

function resolvePolicyPath({ entryKey = '', metadata = {}, policyHeader = {} } = {}) {
    if (entryKey.startsWith('\\')) {
        const headerKey = policyHeader?.key ?? '';
        const valueName = metadata?.valueName ?? '';

        if (headerKey && valueName) {
            return `${headerKey}\\${valueName}`;
        }

        if (valueName) {
            return valueName;
        }
    }

    return entryKey;
}

function normalizePolicyEntries(policyData = {}, policyHeader = {}) {
    const controlEntries = [];
    let policyValueEntry = null;

    Object.entries(policyData).forEach(([entryKey, entryValue]) => {
        if (entryKey === 'displayName' || entryKey === 'header') {
            return;
        }

        const metadata = entryValue?.metadata;

        if (!metadata) {
            return;
        }

        const normalizedEntry = {
            entryKey,
            metadata,
            policyPath: resolvePolicyPath({ entryKey, metadata, policyHeader }),
        };

        if (metadata.type === 'policyValue') {
            if (!policyValueEntry) {
                policyValueEntry = normalizedEntry;
            }
            return;
        }

        controlEntries.push(normalizedEntry);
    });

    return { controlEntries, policyValueEntry };
}

function getEnumDefaultValue(items = {}, defaultItem) {
    const itemKeys = Object.keys(items);

    if (itemKeys.length === 0) {
        return '';
    }

    if (defaultItem !== undefined && defaultItem !== null) {
        const normalizedDefault = String(defaultItem);
        if (Object.prototype.hasOwnProperty.call(items, normalizedDefault)) {
            return normalizedDefault;
        }
    }

    return itemKeys[0];
}

function createCommonControlAttrs({ metadata = {}, policyPath = '', type = '', isDisabled = true } = {}) {
    return {
        name: metadata.id ?? metadata.valueName ?? 'admx-control',
        disabled: isDisabled ? 'disabled' : null,
        'data-policy-path': policyPath,
        'data-policy-type': type,
    };
}

function renderUnsupportedControl() {
    return createElement('div', {
        className: 'field__element',
        text: 'В разработке'
    });
}

function renderEnumControl({ metadata = {}, policyPath = '', isDisabled = true } = {}) {
    const items = metadata.items ?? {};
    const selectedValue = getEnumDefaultValue(items, metadata.defaultItem);
    const optionEntries = Object.entries(items);

    return createElement('div', {
        className: 'field__element',
        children: [
            createElement('select', {
                attrs: createCommonControlAttrs({
                    metadata,
                    policyPath,
                    type: 'enum',
                    isDisabled
                }),
                children: optionEntries.map(([value, label]) => createElement('option', {
                    attrs: {
                        value,
                        selected: value === selectedValue ? 'selected' : null
                    },
                    text: label
                }))
            })
        ]
    });
}

function renderBooleanControl({ metadata = {}, policyPath = '', isDisabled = true } = {}) {
    return createElement('div', {
        className: 'field__element',
        children: [
            createElement('input', {
                attrs: {
                    ...createCommonControlAttrs({
                        metadata,
                        policyPath,
                        type: 'boolean',
                        isDisabled
                    }),
                    type: 'checkbox'
                }
            })
        ]
    });
}

function renderDecimalControl({ metadata = {}, policyPath = '', isDisabled = true } = {}) {
    return createElement('div', {
        className: 'field__element',
        children: [
            createElement('input', {
                attrs: {
                    ...createCommonControlAttrs({
                        metadata,
                        policyPath,
                        type: 'decimal',
                        isDisabled
                    }),
                    type: 'number',
                    min: metadata.minValue ?? null,
                    max: metadata.maxValue ?? null,
                    value: metadata.defaultValue ?? null
                }
            })
        ]
    });
}

function renderTextControl({ metadata = {}, policyPath = '', isDisabled = true } = {}) {
    return createElement('div', {
        className: 'field__element',
        children: [
            createElement('input', {
                attrs: {
                    ...createCommonControlAttrs({
                        metadata,
                        policyPath,
                        type: 'text',
                        isDisabled
                    }),
                    type: 'text'
                }
            })
        ]
    });
}

function renderControlByType({ metadata = {}, policyPath = '', isDisabled = true } = {}) {
    const type = metadata?.type;

    switch (type) {
        case 'enum':
            return renderEnumControl({ metadata, policyPath, isDisabled });
        case 'boolean':
            return renderBooleanControl({ metadata, policyPath, isDisabled });
        case 'decimal':
            return renderDecimalControl({ metadata, policyPath, isDisabled });
        case 'text':
            return renderTextControl({ metadata, policyPath, isDisabled });
        case 'list':
            return renderUnsupportedControl();
        default:
            return renderUnsupportedControl();
    }
}

function renderAdmxControlRow({ metadata = {}, policyPath = '', isDisabled = true } = {}) {
    return createElement('div', {
        className: 'gp__admx-item',
        children: [
            createElement('div', {
                className: 'gp__admx-description',
                text: metadata.label ?? ''
            }),
            createElement('div', {
                className: 'gp__admx-options',
                children: [
                    renderControlByType({ metadata, policyPath, isDisabled })
                ]
            })
        ]
    });
}

function setControlsDisabledState(rootElement, shouldDisable) {
    if (!rootElement) {
        return;
    }

    const controls = rootElement.querySelectorAll('.gp__admx-options input, .gp__admx-options select, .gp__admx-options textarea');

    controls.forEach((control) => {
        control.disabled = shouldDisable;
    });
}

function syncControlsWithPolicyState(rootElement) {
    if (!rootElement) {
        return;
    }

    const currentState = rootElement.querySelector('input[name="admx-state"]:checked')?.value ?? 'not-configured';
    setControlsDisabledState(rootElement, currentState !== 'enabled');
}

/**
 * Рендерит рабочую область для политики из административных шаблонов (ADMX).
 * @returns {ElementCreator}
 */
export function renderAdmxTemplate({ isHelpOpen = false, item = {}, admxTreePath = null, header = null } = {}) {
    const effectiveAdmxTreePath = admxTreePath ?? item?.admxTreePath ?? null;
    
    console.log('admxTreePath', effectiveAdmxTreePath);

    const headerEl = header?.getElement?.();
    const btnApply = headerEl?.querySelector('.admx__btn-apply') ?? null;
    const btnCancel = headerEl?.querySelector('.admx__btn-cancel') ?? null;
    const cleanups = [];
    let hasAdmxStateChanged = false;

    const policyData = item.policyData ?? {};
    const policyHeader = policyData.header ?? {};
    const { controlEntries, policyValueEntry } = normalizePolicyEntries(policyData, policyHeader);
    const controlRows = controlEntries.map(({ metadata, policyPath }) => renderAdmxControlRow({
        metadata,
        policyPath,
        isDisabled: true
    }));

    const admxTemplate = createElement('div', {
        className: 'gp__admx-wrapper',
        children: [
            createElement('div', {
                className: 'gp__admx',
                children: [
                    createElement('div', {
                        className: 'gp__admx-settings',
                        children: [
                            createElement('div', {
                                className: 'title',
                                children: [
                                    'Политика: ',
                                    createElement('span', {
                                        className: 'title__name',
                                        text: policyHeader.displayName ?? ''
                                    })
                                ]
                            }),
                            createElement('div', {
                                className: 'gp__admx-state-policy-title',
                                text: 'Состояние политики:'
                            }),
                            createElement('div', {
                                className: 'gp__admx-state-policy',
                                attrs: {
                                    'data-policy-path': policyValueEntry?.policyPath ?? null,
                                    'data-enabled-value': policyValueEntry?.metadata?.enabledValue ?? null,
                                    'data-disabled-value': policyValueEntry?.metadata?.disabledValue ?? null,
                                },
                                children: [
                                    createElement('label', {
                                        className: 'gp__admx-radio',
                                        children: [
                                            createElement('input', {
                                                attrs: {
                                                    type: 'radio',
                                                    name: 'admx-state',
                                                    value: 'not-configured',
                                                    checked: 'checked'
                                                }
                                            }),
                                            createElement('span', {
                                                text: 'Не сконфигурировано'
                                            })
                                        ]
                                    }),
                                    createElement('label', {
                                        className: 'gp__admx-radio',
                                        children: [
                                            createElement('input', {
                                                attrs: {
                                                    type: 'radio',
                                                    name: 'admx-state',
                                                    value: 'enabled'
                                                }
                                            }),
                                            createElement('span', {
                                                text: 'Включено'
                                            })
                                        ]
                                    }),
                                    createElement('label', {
                                        className: 'gp__admx-radio',
                                        children: [
                                            createElement('input', {
                                                attrs: {
                                                    type: 'radio',
                                                    name: 'admx-state',
                                                    value: 'disabled'
                                                }
                                            }),
                                            createElement('span', {
                                                text: 'Отключено'
                                            })
                                        ]
                                    })
                                ]
                            }),
                            createElement('div', {
                                className: 'field__line'
                            })
                        ]
                    }),
                    createElement('div', {
                        className: 'gp__admx-info',
                        children: [
                            createElement('div', {
                                className: 'gp__admx-item',
                                children: [
                                    createElement('div', {
                                        className: 'gp__admx-description',
                                        text: 'Описание'
                                    }),
                                    createElement('div', {
                                        className: 'gp__admx-options',
                                        text: 'Опции'
                                    })
                                ]
                            }),
                            ...controlRows
                        ]
                    })
                ]
            }),
            createElement('div', {
                className: ['gp__admx-help', isHelpOpen ? 'is-open' : null],
                children: [
                    createElement('div', {
                        className: 'gp__admx-supported',
                        children: [
                            createElement('div', {
                                className: 'title',
                                text: 'Поддерживается на:'
                            }),
                            createElement('div', {
                                className: 'gp__admx-content',
                                text: policyHeader.supportedOn ?? ''
                            })
                        ]
                    }),
                    createElement('div', {
                        className: 'gp__admx-comment',
                        children: [
                            createElement('div', {
                                className: 'title',
                                text: 'Комментарий:'
                            }),
                            createElement('textarea', {
                                attrs: {
                                    name: 'comment'
                                }
                            })
                        ]
                    }),
                    createElement('div', {
                        className: 'gp__admx-text-help',
                        children: [
                            createElement('div', {
                                className: 'title',
                                text: 'Помощь:'
                            }),
                            createElement('div', {
                                className: 'gp__admx-content',
                                children: formatExplainText(policyHeader.explainText)
                            })
                        ]
                    })
                ]
            })
        ]
    });

    const admxTemplateElement = admxTemplate.getElement();
    const statePolicyElement = admxTemplateElement.querySelector('.gp__admx-state-policy');

    const initialAdmxState = admxTemplateElement.querySelector('input[name="admx-state"]:checked')?.value ?? 'not-configured';

    const setHeaderAdmxButtonsActive = (active) => {
        if (btnApply) btnApply.classList.toggle('active', active);
        if (btnCancel) btnCancel.classList.toggle('active', active);
    };

    setHeaderAdmxButtonsActive(false);

    const handleStatePolicyChange = (event) => {
        const targetElement = event.target;

        if (!(targetElement instanceof HTMLInputElement)) {
            return;
        }

        if (targetElement.name !== 'admx-state') {
            return;
        }

        if (!hasAdmxStateChanged) {
            hasAdmxStateChanged = true;
            setHeaderAdmxButtonsActive(true);
        }

        syncControlsWithPolicyState(admxTemplateElement);
    };

    addManagedEventListener(cleanups, statePolicyElement, 'change', handleStatePolicyChange);

    syncControlsWithPolicyState(admxTemplateElement);

    const handleCancel = () => {
        if (!btnCancel?.classList.contains('active')) {
            return;
        }

        const radioToSelect = admxTemplateElement.querySelector(`input[name="admx-state"][value="${CSS.escape(initialAdmxState)}"]`);
        if (radioToSelect instanceof HTMLInputElement) {
            radioToSelect.checked = true;
        }

        syncControlsWithPolicyState(admxTemplateElement);

        hasAdmxStateChanged = false;
        setHeaderAdmxButtonsActive(false);
    };

    const handleApply = () => {

        //кликаем по кнопке Применить (apply)


        //const admxMetadata = item.policyData.header.key + '\\\\' + item.title;
        
        const admxKey = item.policyData.header.key;
        const admxPath = item.admxTreePath + '/' + item.title;

        const policyData = item.policyData;

        //const admxMetadata= []

        console.log('click on apply');
        //console.log('admxMetadata', admxMetadata);
        console.log('admxPath', admxPath);


        if (!btnApply?.classList.contains('active')) {

            
            return;
        }

        // NOTE: actual persistence of ADMX state is not implemented yet.
        hasAdmxStateChanged = false;
        setHeaderAdmxButtonsActive(false);
    };

    addManagedEventListener(cleanups, btnCancel, 'click', handleCancel);
    addManagedEventListener(cleanups, btnApply, 'click', handleApply);

    let cleanedUp = false;
    admxTemplate.cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;

        while (cleanups.length > 0) {
            const cleanup = cleanups.pop();
            if (typeof cleanup === 'function') {
                cleanup();
            }
        }

        setHeaderAdmxButtonsActive(false);
    };

    return admxTemplate;
}
