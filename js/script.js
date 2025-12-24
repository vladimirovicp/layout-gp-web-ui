import { createSkeleton } from './create/skeleton.js';
import { loadMainStyles } from './styles/load-styles.js';
import { resizable } from './helpers/resizable.js'; 

loadMainStyles();
const container = document.querySelector('.gpui__container');
createSkeleton(container);
resizable('divider', 'leftPanel','.gpui__container');



