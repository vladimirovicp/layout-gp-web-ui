import { resizable } from './helpers/resizable.js';
import { treeView} from './components/treeView/treeView.js'


resizable('.divider', '.tree-view', '.gp__main');

treeView();
