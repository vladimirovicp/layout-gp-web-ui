import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит рабочую область для политики из административных шаблонов (ADMX).
 * @returns {ElementCreator}
 */
export function renderAdmxTemplate() {
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
                                        text: 'Разрешения для /bin/su'
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
                className: 'gp__admx-help',
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
                                text: '8 Платформа ALT как минимум'
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
                                children: [
                                    'Эта политика определяет разрешения для Xorg (/usr/bin/Xorg)',
                                    createElement('br'),
                                    'Не настроено — любому пользователю разрешено запускать /usr/bin/Xorg',
                                    createElement('br'),
                                    'Любой пользователь — любому пользователю разрешено запускать /usr/bin/Xorg',
                                    createElement('br'),
                                    'Группа xgrp — пользователям группы «xgrp» разрешено запускать /usr/bin/Xorg',
                                    createElement('br'),
                                    'Только root — только суперпользователь (root) может запускать /usr/bin/Xorg'
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });

    return admxTemplate;
}