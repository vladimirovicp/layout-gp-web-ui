import { createElement } from '../../util/element-creator.js';

/**
 * Рендерит шаблон настроек ярлыка (горячей клавиши)
 * @returns {ElementCreator} - Элемент с шаблоном настроек ярлыка
 */
export function renderPreferencesShortcutsTemplate() {
    const container = createElement('div', {
        className: 'preferences-shortcuts',
        children: [
            // Действие
            createElement('div', {
                className: ['field', 'select'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Действие:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('select', {
                                attrs: {
                                    name: 'action'
                                },
                                children: [
                                    createElement('option', {
                                        attrs: {
                                            value: 'create',
                                            selected: 'selected'
                                        },
                                        text: 'Создать'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'replace'
                                        },
                                        text: 'Заменить'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'update'
                                        },
                                        text: 'Обновить'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'delete'
                                        },
                                        text: 'Удалить'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),

            // Линия
            createElement('div', {
                className: 'field__line'
            }),

            // Название
            createElement('div', {
                className: ['field', 'field__input', 'field__input--path'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Название:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'text',
                                    placeholder: '/home/user'
                                }
                            })
                        ]
                    })
                ]
            }),

            // Тип цели
            createElement('div', {
                className: ['field', 'select'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Тип цели:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('select', {
                                attrs: {
                                    name: 'targetType'
                                },
                                children: [
                                    createElement('option', {
                                        attrs: {
                                            value: 'filesystem',
                                            selected: 'selected'
                                        },
                                        text: 'Объект файловой системы'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'url'
                                        },
                                        text: 'URL-адрес'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'shellObject'
                                        },
                                        text: 'Объект оболочки'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),

            // Место нахождения
            createElement('div', {
                className: ['field', 'select'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Место нахождения:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('select', {
                                attrs: {
                                    name: 'location'
                                },
                                children: [
                                    createElement('option', {
                                        attrs: {
                                            value: 'path',
                                            selected: 'selected'
                                        },
                                        text: '[Укажите полный путь]'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'desktop'
                                        },
                                        text: 'Рабочий стол'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'startMenu'
                                        },
                                        text: 'Стартовое меню'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'programs'
                                        },
                                        text: 'Программы'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'startup'
                                        },
                                        text: 'Запуск'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'favorites'
                                        },
                                        text: 'Избранное'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'links'
                                        },
                                        text: 'Ссылки'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'sendTo'
                                        },
                                        text: 'Отправить'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'recent'
                                        },
                                        text: 'Недавние'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'quickLaunch'
                                        },
                                        text: 'Панель быстрого запуска'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'networkPlaces'
                                        },
                                        text: 'Мои места в Сети'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'commonDesktop'
                                        },
                                        text: 'Общий Рабочий стол'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'commonStartMenu'
                                        },
                                        text: 'Общее Стартовое меню'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'commonPrograms'
                                        },
                                        text: 'Общие Программы'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'commonStartup'
                                        },
                                        text: 'Общий Запуск'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'commonFavorites'
                                        },
                                        text: 'Общие Избранное'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),

            // Линия
            createElement('div', {
                className: 'field__line'
            }),

            // Целевой путь
            createElement('div', {
                className: ['field', 'field__input', 'field__input--path'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Целевой путь:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'text',
                                    placeholder: '/home/user'
                                }
                            })
                        ]
                    })
                ]
            }),

            // Аргументы
            createElement('div', {
                className: ['field', 'field__input'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Аргументы:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'text'
                                }
                            })
                        ]
                    })
                ]
            }),

            // Линия
            createElement('div', {
                className: 'field__line'
            }),

            // Путь к файлу значка
            createElement('div', {
                className: ['field', 'field__input', 'field__input--path'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Путь к файлу значка:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'text'
                                }
                            })
                        ]
                    })
                ]
            }),

            // Индекс значка
            createElement('div', {
                className: ['field', 'select'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Индекс значка:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'number',
                                    disabled: 'disabled',
                                    value: '0'
                                }
                            })
                        ]
                    })
                ]
            }),

            // Линия
            createElement('div', {
                className: 'field__line'
            }),

            // Начинать
            createElement('div', {
                className: ['field', 'field__input', 'field__input--path'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Начинать:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'text'
                                }
                            })
                        ]
                    })
                ]
            }),

            // Быстрая клавиша
            createElement('div', {
                className: ['field', 'field__input', 'field__input--hotkey'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Быстрая клавиша:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('input', {
                                attrs: {
                                    type: 'text',
                                    placeholder: 'Введи комбинацию клавиш'
                                }
                            })
                        ]
                    })
                ]
            }),

            // Запуск
            createElement('div', {
                className: ['field', 'select'],
                children: [
                    createElement('div', {
                        className: 'field__label',
                        text: 'Запуск:'
                    }),
                    createElement('div', {
                        className: 'field__element',
                        children: [
                            createElement('select', {
                                attrs: {
                                    name: 'runMode'
                                },
                                children: [
                                    createElement('option', {
                                        attrs: {
                                            value: 'normal',
                                            selected: 'selected'
                                        },
                                        text: 'Обычное окно'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'minimized'
                                        },
                                        text: 'Свёрнутое'
                                    }),
                                    createElement('option', {
                                        attrs: {
                                            value: 'maximized'
                                        },
                                        text: 'Увеличенное'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),

            // Комментарий
            createElement('div', {
                className: ['field', 'field__comment'],
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
                                    name: 'comment'
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

