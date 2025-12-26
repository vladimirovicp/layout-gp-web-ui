import { createSkeleton } from './create/skeleton.js';
import { loadMainStyles } from './styles/load-styles.js';
import { resizable } from './helpers/resizable.js'; 

import { loadAndProcessData } from './data/loadCategoriesBasealt.js';

loadMainStyles();
const container = document.querySelector('.gpui__container');
createSkeleton(container);
resizable('divider', 'leftPanel','.gpui__container');


// **********************************************************************************************************


const dataFull = await loadAndProcessData();
const dataSystem = dataFull.Machine.categories[1];

// console.log(system);

// console.log(typeof system)
// console.log(system.inherited)

const data = dataSystem.inherited;

console.log(data);

// test.forEach((node, index) => {
//      console.log(node);
// });



function buildCategoryTree(categories, parentUl) {
  // parentUl — это уже <ul>, в который мы добавляем <li>

  categories.forEach(category => {
    const li = document.createElement('li');
    li.classList.add('closed');

    const spanFolder = document.createElement('span');
    spanFolder.classList.add('folder');
    li.appendChild(spanFolder);

    const span = document.createElement('span');
    span.textContent = category.category;
    li.appendChild(span);

    // Создаём внутренний <ul> только если есть дети (inherited или policies)
    let childUl = null;

    // 1. Обрабатываем вложенные категории
    if (category.inherited && category.inherited.length > 0) {
      childUl = document.createElement('ul');
      childUl.classList.add('test1'); // или любой нужный класс
      li.appendChild(childUl);
      // Рекурсивно заполняем childUl (он уже <ul>)
      buildCategoryTree(category.inherited, childUl);
    }

    // 2. Добавляем политики в тот же childUl (или создаём, если только политики)
    if (category.policies && category.policies.length > 0) {
      if (!childUl) {
        childUl = document.createElement('ul');
        li.appendChild(childUl);
      }
      category.policies.forEach(polic => {
        const policyLi = document.createElement('li');
        policyLi.textContent = polic.displayName;
        policyLi.classList.add('policy');
        childUl.appendChild(policyLi);
      });
    }

    // Добавляем <li> в родительский <ul>
    parentUl.appendChild(li);
  });
}

// Находим элемент, куда будем добавлять дерево
//const container = document.getElementById('category-tree-container');

const leftPanel = document.querySelector('.left-panel');
const dataTree = document.createElement('div');
dataTree.classList.add('dataTree');
const tree = document.createElement('div');



tree.classList.add('tree');
const rootUl = document.createElement('ul');
tree.appendChild(rootUl);

dataTree.appendChild(tree);

leftPanel.appendChild(dataTree);

// Строим дерево категорий
buildCategoryTree(data, rootUl);




document.addEventListener('click', function (e) {
    // Находим ближайший <li> внутри .dataTree > .tree
    const li = e.target.closest('.dataTree > .tree li');
    if (!li) return;

    // Находим прямой дочерний <ul>
    const childUl = li.querySelector(':scope > ul');
    if (!childUl) return; // если нет детей — ничего не делаем

    // Переключаем состояние
    li.classList.toggle('opened');

    // Опционально: управлять классом 'closed' (не обязательно, если используешь только .opened)
    // li.classList.toggle('closed', !li.classList.contains('opened'));

    e.stopPropagation();
});



