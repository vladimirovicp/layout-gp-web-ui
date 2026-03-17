import { createElement } from '../../util/element-creator.js';
import { treeViewList } from './tree-view-list-data.js';

export { treeViewList };

/**
 * Рекурсивно создает элемент дерева из данных
 * @param {Object} item - Элемент дерева
 * @param {Object} treeViewState - State дерева (передаётся из App)
 * @returns {ElementCreator} - Созданный элемент li
 */
function renderTreeItem(item, treeViewState) {
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
        const nestedList = renderTreeList(item.children, treeViewState);
        listItem.append(nestedList);
        
        // Скрываем вложенный список, если папка закрыта
        if (item.type === 'folder' && !item.opened) {
            nestedList.setStyle({ display: 'none' });
        }
    }
    
    // Добавляем обработчик клика на все элементы дерева
    treeItem.on('click', (e) => {
        e.stopPropagation();
        const clickedElement = e.currentTarget;
        
        // Выводим в консоль элемент, по которому был клик
        //console.log('Клик по элементу:', clickedElement);
        
        // Удаляем класс active у всех элементов tree-item
        const allTreeItems = document.querySelectorAll('.tree-item');
        allTreeItems.forEach(treeItemEl => {
            treeItemEl.classList.remove('active');
        });
        
        // Добавляем класс active к кликнутому элементу
        clickedElement.classList.add('active');
        
        // Для папок переключаем состояние открыто/закрыто
        if (item.type === 'folder' && item.children && item.children.length > 0) {
            toggleFolder(listItem, item);
        }
        
        // Обновляем состояние выбранного элемента (state из App)
        if (treeViewState) {
            treeViewState.setSelectedItem(item, clickedElement);
        }
    });
    
    return listItem;
}

/**
 * Создает список элементов дерева
 * @param {Array} items - Массив элементов дерева
 * @param {Object} treeViewState - State дерева (передаётся из App)
 * @returns {ElementCreator} - Созданный элемент ul
 */
function renderTreeList(items, treeViewState) {
    const list = createElement('ul', {
        className: 'tree-view__list',
        children: items.map(item => renderTreeItem(item, treeViewState))
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
        //nestedList.style.display = 'none';
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
 * @param {ElementCreator} workspace - Элемент workspace для отображения выбранного элемента
 * @param {Object} treeViewState - State дерева (передаётся из App)
 * @returns {ElementCreator} - Корневой элемент ul
 */
export function renderTreeViewList(data = treeViewList, workspace = null, treeViewState = null) {
    if (workspace && treeViewState) {
        treeViewState.setWorkspace(workspace);
    }
    return renderTreeList(data, treeViewState);
}
