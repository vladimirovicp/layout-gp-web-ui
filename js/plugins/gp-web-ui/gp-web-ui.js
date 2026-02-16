function gpWebUi(json){
    console.log('gp-web-ui');

    //loadStyles('./js/plugins/gp-web-ui/css/style.css');
    loadStyles('./js/plugins/gp-web-ui/css/style1.css');

    // loadStyles('./js/plugins/gp-web-ui/assets/index-CyWLe1-A.css');
    // loadStyles('./js/plugins/gp-web-ui/assets/index-DpE3cm7D.css');

    renderPage();
}



function renderPage(){
    console.log('renderPage');

      const script = document.createElement("script");
      script.src = "./js/plugins/gp-web-ui/start.js";
      script.type = "text/javascript";
      script.onload = () => {
        console.log("Файл test.js загружен");
      };
      document.body.appendChild(script);
    

}

function loadStyles(href) {
  // Проверка, не загружен ли уже этот файл
  if (document.querySelector(`link[href="${href}"]`)) {
    return; // Уже подключён
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}