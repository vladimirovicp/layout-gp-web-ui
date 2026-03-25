import { createElement } from '../../util/element-creator.js';

function formatExplainText(explainText = '') {
    return explainText
        .split(/\r?\n/)
        .flatMap((line, index, lines) => (index < lines.length - 1 ? [line, createElement('br')] : [line]));
}

/**
 * Рендерит рабочую область для политики из административных шаблонов (ADMX).
 * @returns {ElementCreator}
 */
export function renderAdmxTemplate({ isHelpOpen = false, item = {} } = {}) {
    const policyHeader = item.policyData?.header ?? {};

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
                            createElement('div', {
                                className: 'gp__admx-item',
                                children: [
                                    createElement('div', {
                                        className: 'gp__admx-description',
                                        text: 'Кому разрешено выполнять:'
                                    }),
                                    createElement('div', {
                                        className: 'gp__admx-options',
                                        children: [
                                            createElement('div', {
                                                className: 'field__element',
                                                children: [
                                                    createElement('select', {
                                                        attrs: {
                                                            name: 'select'
                                                        },
                                                        children: [
                                                            createElement('option', {
                                                                attrs: {
                                                                    value: 'value1',
                                                                    selected: 'selected'
                                                                },
                                                                text: 'Создать'
                                                            }),
                                                            createElement('option', {
                                                                attrs: {
                                                                    value: 'value2'
                                                                },
                                                                text: 'Заменить'
                                                            }),
                                                            createElement('option', {
                                                                attrs: {
                                                                    value: 'value3'
                                                                },
                                                                text: 'Обновить'
                                                            }),
                                                            createElement('option', {
                                                                attrs: {
                                                                    value: 'value3'
                                                                },
                                                                text: 'Удалить'
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            createElement('div', {
                                className: 'gp__admx-item',
                                children: [
                                    createElement('div', {
                                        className: 'gp__admx-label',
                                        text: 'Количество минут до истечения которого после активации хранителя экрана, экран будет заблокирован'
                                    })
                                ]
                            }),
                            createElement('div', {
                                className: 'gp__admx-item',
                                children: [
                                    createElement('div', {
                                        className: 'gp__admx-description',
                                        text: 'Блокировать:'
                                    }),
                                    createElement('div', {
                                        className: 'gp__admx-options',
                                        children: [
                                            createElement('div', {
                                                className: 'field__element',
                                                children: [
                                                    createElement('input', {
                                                        attrs: {
                                                            type: 'checkbox',
                                                            name: 'path'
                                                        }
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            createElement('div', {
                                className: 'gp__admx-item',
                                children: [
                                    createElement('div', {
                                        className: 'gp__admx-description',
                                        text: 'Время в минутах'
                                    }),
                                    createElement('div', {
                                        className: 'gp__admx-options',
                                        children: [
                                            createElement('div', {
                                                className: 'field__element',
                                                children: [
                                                    createElement('input', {
                                                        attrs: {
                                                            type: 'number',
                                                            name: 'number',
                                                            min: '1'
                                                        }
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
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

    return admxTemplate;
}
