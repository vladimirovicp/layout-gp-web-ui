import { resizable } from './helpers/resizable.js';
import { treeView} from './components/treeView/treeView.js'
import { preference } from './components/preference/preference.js'
import { listChildrenHelp } from './components/listChildrenHelp/listChildrenHelp.js'
import { scripts } from './components/scripts/scripts.js'


resizable('.divider', '.tree-view', '.gp__main');

treeView();

preference();

listChildrenHelp();

scripts();



