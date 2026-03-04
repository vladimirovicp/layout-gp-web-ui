

export function treeView(){
    console.log('tree-view');

    const tree = document.querySelector('.tree-view');
    if(!tree){
        return;
    }

    const treeItems = tree.querySelectorAll('.tree-item');

    treeItems.forEach((item) => {
        
        item.addEventListener('click', () => {
            const title = item.querySelector('.tree-item__title');
            if(title){
                console.log(title.textContent);
            }

            const parent = item.parentElement;
            if (parent) {

                if(parent.classList.contains('folder')){
                    const isOpened = parent.classList.contains('opened');
                    parent.classList.toggle('opened', !isOpened);
                    parent.classList.toggle('closed', isOpened);
                } else if(parent.classList.contains('file')){

                    console.log(item);

                } else{
                    console.log('Error treeView');
                }


            } 

            

            //const folder = item.closest('.view.folder');

            //console.log(folder);

            // if(folder){
            //     const isOpened = folder.classList.contains('opened');
            //     folder.classList.toggle('opened', !isOpened);
            //     folder.classList.toggle('closed', isOpened);
            // } else{
            //     console.log('file');
            // }
        });
    });

}