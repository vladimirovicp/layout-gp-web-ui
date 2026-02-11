import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит общий шаблон настроек (чекбоксы и комментарий)
 * @returns {ElementCreator} - Элемент с шаблоном общих настроек
 */
export function renderPreferencesCommonTemplate() {
    const container = createElement('div', {
        className: 'preferences-common',
        children: [
            // checkbox 1
            createElement('div', {
                className: ['field', 'field__checkbox'],
                children: [
                    createElement('label', {
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'checkbox',
                                    name: 'option1'
                                }
                            }),
                            createElement('span', {
                                className: 'field__label-checkbox',
                                text: 'Остановить обработку элементов при ошибке'
                            })
                        ]
                    })
                ]
            }),
            // checkbox 2
            createElement('div', {
                className: ['field', 'field__checkbox'],
                children: [
                    createElement('label', {
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'checkbox',
                                    name: 'option2'
                                }
                            }),
                            createElement('span', {
                                className: 'field__label-checkbox',
                                text: 'Выполнять в контексте безопасности текущего пользователя (опция пользовательских политик)'
                            })
                        ]
                    })
                ]
            }),
            // checkbox 3
            createElement('div', {
                className: ['field', 'field__checkbox'],
                children: [
                    createElement('label', {
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'checkbox',
                                    name: 'option3'
                                }
                            }),
                            createElement('span', {
                                className: 'field__label-checkbox',
                                text: 'Удалить элемент, если больше не применим'
                            })
                        ]
                    })
                ]
            }),
            // checkbox 4 (disabled)
            createElement('div', {
                className: ['field', 'field__checkbox'],
                children: [
                    createElement('label', {
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'checkbox',
                                    name: 'option4',
                                    disabled: 'disabled'
                                }
                            }),
                            createElement('span', {
                                className: 'field__label-checkbox',
                                text: 'Применить только один раз'
                            })
                        ]
                    })
                ]
            }),
            // checkbox 5 (disabled)
            createElement('div', {
                className: ['field', 'field__checkbox'],
                children: [
                    createElement('label', {
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'checkbox',
                                    name: 'option5',
                                    disabled: 'disabled'
                                }
                            }),
                            createElement('span', {
                                className: 'field__label-checkbox',
                                text: 'Выбор элементов'
                            })
                        ]
                    })
                ]
            }),
            // textarea "Комментарий"
            createElement('div', {
                className: ['field', 'field__description'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Комментарий:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('textarea', {
                                attrs: {
                                    name: 'description'
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    });

    return container;
}

