


function gpWebUi(json){
    console.log('gp-web-ui');

    //console.log(json);

    //renderPage();


    // loadStyles('./css/reset.css');
    loadStyles('./js/plugins/gp-web-ui/css/style.css');

    renderPage();

    resizable('divider', 'leftPanel','.gpui__container');
    resizable('suv_divider', 'subLeftPanel','.right-panel__container');
}



function renderPage(){
    console.log('renderPage');

    const container = document.querySelector('.gpui__container');


    console.log(container);

    container.innerHTML = `<div id="leftPanel" class="left-panel">left</div><div class="divider" id="divider"></div><div class="right-panel"><div class="policy_name">Политика:</div><div class="right-panel__container"><div id="subLeftPanel" class="sub_left-panel">Состояние политики<ul class="policy_status"><li><label><input type="radio" name="option" value="1"> Не сконфигурировано</label></li><li><label><input type="radio" name="option" value="2"> Включено</label></li><li><label><input type="radio" name="option" value="3"> Отключено</label></li></ul></div><div class="sub_divider" id="suv_divider"></div><div class="sub_right-panel"><div class="supported-on"><div class="title supported-on__title">Поддерживается на:</div><div class="supported-on__box"><div class="supported-on__info">Поддерживается Microsoft Windows 7 и более поздние версии Поддерживается Microsoft Windows 7 и более поздние версии Поддерживается Microsoft Windows 7 и более поздние версии</div></div></div><div class="comment"><div class="comment__box"><label class="comment__label" for="comment">Комментарий</label><textarea class="comment__textarea" name="comment" rows="5">
                                Прародителем текста-рыбы является известный "Lorem Ipsum" — латинский текст, ноги которого растут аж из 45 года до нашей эры. Сервисов по созданию случайного текста на основе Lorem Ipsum великое множество, однако все они имеют один существенный недостаток: их "рыба текст" подходит лишь для англоязычных ресурсов/проектов. Мы же, фактически, предлагаем Lorem Ipsum на русском языке — вы можете использовать полученный здесь контент абсолютно бесплатно и в любых целях, не запрещённых законодательством. Однако в случае, если сгенерированный здесь текст используется в коммерческом или публичном проекте, ссылка на наш сервис обязательна.
                            </textarea></div></div><div class="help"><div class="title help__title">Помощь:</div><div class="help__box"><div class="help__info">Прародителем текста-рыбы является известный "Lorem Ipsum" — латинский текст, ноги которого растут аж из 45 года до нашей эры. Сервисов по созданию случайного текста на основе Lorem Ipsum великое множество, однако все они имеют один существенный недостаток: их "рыба текст" подходит лишь для англоязычных ресурсов/проектов. Мы же, фактически, предлагаем Lorem Ipsum на русском языке — вы можете использовать полученный здесь контент абсолютно бесплатно и в любых целях, не запрещённых законодательством. Однако в случае, если сгенерированный здесь текст используется в коммерческом или публичном проекте, ссылка на наш сервис обязательна. Прародителем текста-рыбы является известный "Lorem Ipsum" — латинский текст, ноги которого растут аж из 45 года до нашей эры. Сервисов по созданию случайного текста на основе Lorem Ipsum великое множество, однако все они имеют один существенный недостаток: их "рыба текст" подходит лишь для англоязычных ресурсов/проектов. Мы же, фактически, предлагаем Lorem Ipsum на русском языке — вы можете использовать полученный здесь контент абсолютно бесплатно и в любых целях, не запрещённых законодательством. Однако в случае, если сгенерированный здесь текст используется в коммерческом или публичном проекте, ссылка на наш сервис обязательна.</div></div></div></div></div></div>`;


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

function resizable(dividerID,firstPanelID,containerClass){
  const divider = document.getElementById(dividerID);
  const leftPanel = document.getElementById(firstPanelID);
  const container = document.querySelector(containerClass);

  let isResizing = false;
  let startX;
  let startWidth;

  divider.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = leftPanel.offsetWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const newWidth = startWidth + (e.clientX - startX);
    const minWidth = 50; // Минимальная ширина левой панели
    const maxWidth = container.offsetWidth - 50; // Максимальная ширина (с учётом правой панели)

    if (newWidth > minWidth && newWidth < maxWidth) {
      leftPanel.style.width = `${newWidth}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}


// loadStyles('./css/reset.css');
// loadStyles('./css/style.css');

// renderPage();

// resizable('divider', 'leftPanel','.gpui__container');
// resizable('suv_divider', 'subLeftPanel','.right-panel__container');