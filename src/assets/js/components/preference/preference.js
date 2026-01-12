import { resizable } from '../../helpers/resizable.js';

export function preference(){

    console.log('preference');

    const workspace = document.querySelector('.workspace');
    if(workspace){
        const preference = workspace.querySelector('.gp__preference');
        if(preference){
            const divider = preference.querySelector('.preference__divider');

            if(divider){
                resizable('.preference__divider', '.preference__info', '.gp__preference');
            }
        }

        
    }

}