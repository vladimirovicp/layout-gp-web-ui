import { t } from '../../locales/translations.js';
import { createElement } from '../../util/element-creator.js';

export const treeViewList = [
    {
        title: t('policies.localGroupPolicy'),
        type: 'folder',
        opened: true,
        icon: null,
        children: [
            {
                title: 'Компьютер',
                type: 'folder',
                opened: true,
                icon: 'ico-computer',
                children: [
                    {
                        title: 'Администранивные шаблоны',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        children: [
                            {
                                title: 'Система Alt',
                                type: 'folder',
                                opened: false,
                                icon: 'ico-folder',
                                children: [
                                    {
                                        title: 'Безопасность',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    },
                                    {
                                        title: 'Виртуализация',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    },
                                    {
                                        title: 'Графическая подсистема',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    },
                                    {
                                        title: '...',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Настройки',
                        type: 'folder',
                        opened: true,
                        icon: 'ico-folder',
                        children: [
                            {
                                title: 'Настройки системы',
                                type: 'folder',
                                opened: true,
                                icon: 'ico-folder',
                                children: [
                                    {
                                        title: 'Значки',
                                        type: 'file',
                                        icon: 'ico-file'
                                    },
                                    {
                                        title: 'Окружение',
                                        type: 'file',
                                        icon: 'ico-file'
                                    },
                                    {
                                        title: 'Папки',
                                        type: 'file',
                                        icon: 'ico-file'
                                    },
                                    {
                                        title: 'Реестр',
                                        type: 'file',
                                        icon: 'ico-file'
                                    },
                                    {
                                        title: 'Сетевые диски',
                                        type: 'file',
                                        icon: 'ico-file'
                                    },
                                    {
                                        title: 'Сетевые папки',
                                        type: 'file',
                                        icon: 'ico-file'
                                    },
                                    {
                                        title: 'Файлы',
                                        type: 'file',
                                        icon: 'ico-file'
                                    },
                                    {
                                        title: 'Ini файлы',
                                        type: 'file',
                                        icon: 'ico-file'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Настройки системы',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        children: [
                            {
                                title: 'Скрипты',
                                type: 'folder',
                                opened: false,
                                icon: 'ico-folder'
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Пользователь',
                type: 'folder',
                opened: true,
                icon: 'ico-user',
                children: [
                    {
                        title: 'Администранивные шаблоны',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder'
                    },
                    {
                        title: 'Настройки',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder'
                    },
                    {
                        title: 'Настройки системы',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder'
                    }
                ]
            }
        ]
    }
];

/**
 * Рекурсивно создает элемент дерева из данных
 * @param {Object} item - Элемент дерева
 * @returns {ElementCreator} - Созданный элемент li
 */
function renderTreeItem(item) {
    const classes = ['view'];
    
    if (item.type === 'folder') {
        classes.push('folder');
        classes.push(item.opened ? 'opened' : 'closed');
    } else {
        classes.push('file');
    }
    
    const treeItem = createElement('span', {
        className: 'tree-item',
        children: []
    });
    
    // Добавляем icon-switcher для папок
    if (item.type === 'folder') {
        treeItem.append(createElement('span', {
            className: 'icon-switcher'
        }));
    }
    
    // Добавляем иконку, если она есть
    if (item.icon) {
        treeItem.append(createElement('span', {
            className: ['icon', item.icon]
        }));
    }
    
    // Добавляем заголовок
    treeItem.append(createElement('span', {
        className: 'tree-item__title',
        text: item.title
    }));
    
    const listItem = createElement('li', {
        className: classes,
        children: [treeItem]
    });
    
    // Если есть дочерние элементы, создаем вложенный список
    if (item.children && item.children.length > 0) {
        const nestedList = renderTreeList(item.children);
        listItem.append(nestedList);
        
        // Скрываем вложенный список, если папка закрыта
        if (item.type === 'folder' && !item.opened) {
            nestedList.setStyle({ display: 'none' });
        }
        
        // Добавляем обработчик клика для переключения открыто/закрыто
        if (item.type === 'folder') {
            treeItem.on('click', (e) => {
                e.stopPropagation();
                toggleFolder(listItem, item);
            });
        }
    }
    
    return listItem;
}

/**
 * Создает список элементов дерева
 * @param {Array} items - Массив элементов дерева
 * @returns {ElementCreator} - Созданный элемент ul
 */
function renderTreeList(items) {
    const list = createElement('ul', {
        className: 'tree-view__list',
        children: items.map(item => renderTreeItem(item))
    });
    
    return list;
}

/**
 * Переключает состояние папки (открыта/закрыта)
 * @param {ElementCreator} listItem - Элемент li папки
 * @param {Object} item - Данные элемента
 */
function toggleFolder(listItem, item) {
    const element = listItem.getElement();
    const nestedList = element.querySelector('ul.tree-view__list');
    
    if (!nestedList) return;
    
    const isOpened = element.classList.contains('opened');
    
    if (isOpened) {
        element.classList.remove('opened');
        element.classList.add('closed');
        nestedList.style.display = 'none';
        item.opened = false;
    } else {
        element.classList.remove('closed');
        element.classList.add('opened');
        nestedList.style.display = '';
        item.opened = true;
    }
}

/**
 * Рендерит дерево из данных treeViewList
 * @param {Array} data - Данные дерева (по умолчанию treeViewList)
 * @returns {ElementCreator} - Корневой элемент ul
 */
export function renderTreeViewList(data = treeViewList) {
    return renderTreeList(data);
}
