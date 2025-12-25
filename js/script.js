import { createSkeleton } from './create/skeleton.js';
import { loadMainStyles } from './styles/load-styles.js';
import { resizable } from './helpers/resizable.js'; 

import { loadAndProcessData } from './data/loadCategoriesBasealt.js';

loadMainStyles();
const container = document.querySelector('.gpui__container');
createSkeleton(container);
resizable('divider', 'leftPanel','.gpui__container');


// **********************************************************************************************************


const data = await loadAndProcessData();
const system = data.Machine.categories[1];

// console.log(system);

// console.log(typeof system)
// console.log(system.inherited)

const test = system.inherited;

// test.forEach((node, index) => {
//      console.log(node);
// });



function buildCategoryTree(categories, parentElement) {
  const ul = document.createElement('ul');

  categories.forEach(category => {
    const li = document.createElement('li');
    li.textContent = category.category;

    // Если у категории есть вложенные категории (inherited не пустой)
    if (category.inherited && category.inherited.length > 0) {
      // Рекурсивно строим дерево для вложенных категорий
      buildCategoryTree(category.inherited, li);
    }

    ul.appendChild(li);
  });

  parentElement.appendChild(ul);
}

// Находим элемент, куда будем добавлять дерево
//const container = document.getElementById('category-tree-container');

const leftPanel = document.querySelector('.left-panel');

// Строим дерево категорий
buildCategoryTree(test, leftPanel);



