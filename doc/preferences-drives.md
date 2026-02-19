# Документация модуля Preferences — Сетевые диски (Drive Maps)

## Обзор

Модуль `preferences/drives` реализует поддержку политик управления **сетевыми дисками** (Drive Maps) в рамках подсистемы групповых политик GPUI. Он позволяет создавать, заменять, обновлять и удалять подключения сетевых дисков, а также управлять их видимостью в системе.

В дереве политик модуль расположен по пути:

```
[Групповая политика]
└── Компьютер / Пользователь
    └── Настройки (Preferences)
        └── Настройки Windows
            └── Сетевые диски (Drive Maps)
```

### Технологии

- **Qt Widgets** — построение пользовательского интерфейса
- **ModelView Framework** — работа с моделями данных
- **QDataWidgetMapper** — привязка данных модели к виджетам формы
- **QButtonGroup** — группировка взаимоисключающих радиокнопок
- **XML-схема** (`DriveMaps`) — сериализация/десериализация политик

---

## Структура модуля

```
src/plugins/preferences/drives/
├── drivesitem.h / .cpp               — модель данных одного сетевого диска
├── drivescontaineritem.h / .cpp      — контейнер (строка таблицы политик)
├── driveswidget.h / .cpp             — виджет формы редактирования
├── driveswidgetslots.cpp             — слоты сигналов формы
├── driveswidget.ui                   — описание формы (Qt Designer)
├── drivesmodelbuilder.h / .cpp       — конвертация XML-схемы ↔ модель
├── drivespreferencereader.h / .cpp   — чтение политик из файла
├── drivespreferencewriter.h / .cpp   — запись политик в файл
└── i18n/
    ├── drives_translation_en.ts      — переводы (английский)
    └── drives_translation_ru.ts      — переводы (русский)
```

---

## Форма редактирования (DrivesWidget)

Форма `driveswidget.ui` открывается при создании или редактировании политики сетевого диска. Она разделена на несколько логических блоков.

### Схема формы

```
┌─────────────────────────────────────────────────────────────┐
│  Action: [ Create ▼ ]                                       │
│ ─────────────────────────────────────────────────────────── │
│  ┌─ locationFrame ──────────────────────────────────────┐   │
│  │  Location: [________________________________] [...]   │   │
│  │  Reconnect: ☐          Label as: [__________]        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─ DriveLetter ───────────────────────────────────────┐    │
│  │  ● Existing:                  [ A: ▼ ]              │    │
│  │  ○ Use first available, starting at:                │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─ Hide/Show this drive ─┐  ┌─ Hide/Show all drive ──┐    │
│  │  ● No change           │  │  ● No change           │    │
│  │  ○ Hide this drive     │  │  ○ Hide all drive      │    │
│  │  ○ Show this drive     │  │  ○ Show all drive      │    │
│  └────────────────────────┘  └────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Элементы управления формы

| Виджет | Имя в коде | Тип | Свойство модели | Описание |
|--------|-----------|-----|-----------------|----------|
| Выпадающий список | `actionComboBox` | `QComboBox` | `ACTION` (индекс 0) | Действие над сетевым диском |
| Поле ввода | `pathLineEdit` | `ShortcutLineEdit` | `PATH` (индекс 1) | UNC-путь к сетевому ресурсу (например, `\\server\share`) |
| Кнопка | `pathToolButton` | `QToolButton` | — | Открыть диалог выбора папки (`...`) |
| Чекбокс | `reconnectCheckBox` | `QCheckBox` | `PERSISTENT` (индекс 2) | Восстанавливать подключение при входе в систему |
| Поле ввода | `labelLineEdit` | `ShortcutLineEdit` | `LABEL` (индекс 3) | Метка (отображаемое имя) диска |
| Группа букв диска | `driveLetterGroupBox` | `QGroupBox` | — | «DriveLetter» / «Имя диска» |
| Радиокнопка | `driveRadioButton` | `QRadioButton` | `USE_LETTER` (индекс 7) | Использовать конкретную букву диска |
| Радиокнопка | `firstAvailableRadioButton` | `QRadioButton` | `USE_EXISTING` (индекс 10) | Использовать первую доступную букву |
| Выпадающий список | `driveComboBox` | `QComboBox` | `LETTER` (индекс 4) | Буква диска (A: — Z:), по умолчанию A: |
| Группа | `thisGroupBox` | `QGroupBox` | — | «Hide/Show this drive» / «Скрыть/Показать диск» |
| Радиокнопка | `noChangeThisRadioButton` | `QRadioButton` | `THIS_DRIVE` = 0 | Без изменений (по умолчанию) |
| Радиокнопка | `hideThisRadioButton` | `QRadioButton` | `THIS_DRIVE` = 1 | Скрыть этот диск |
| Радиокнопка | `showThisRadioButton` | `QRadioButton` | `THIS_DRIVE` = 2 | Показать этот диск |
| Группа | `groupBox_5` | `QGroupBox` | — | «Hide/Show all drive» / «Скрыть/Показать все диски» |
| Радиокнопка | `noChangeAllRadioButton` | `QRadioButton` | `ALL_DRIVES` = 0 | Без изменений (по умолчанию) |
| Радиокнопка | `hideAllRadioButton` | `QRadioButton` | `ALL_DRIVES` = 1 | Скрыть все диски |
| Радиокнопка | `showAllRadioButton` | `QRadioButton` | `ALL_DRIVES` = 2 | Показать все диски |

---

### Поле «Action» — допустимые значения

| Индекс | Значение (EN) | Значение (RU) | Константа в коде |
|--------|--------------|---------------|-----------------|
| 0 | Create | Создать | `CREATE__MODE` |
| 1 | Replace | Заменить | `REPLACE_MODE` |
| 2 | Update | Обновить | `UPDATE__MODE` |
| 3 | Delete | Удалить | `DELETE__MODE` |

---

### Поведение формы в зависимости от Action

#### Блок «Location» (`locationFrame`)

| Action | Состояние |
|--------|-----------|
| Create | Активен |
| Replace | Активен |
| Update | Активен |
| **Delete** | **Отключён** |

#### Блок «Hide/Show this drive» (`thisGroupBox`)

| Action | Поле Location пустое | Состояние |
|--------|---------------------|-----------|
| Create | Да | Отключён |
| Create / Replace | Нет | Активен |
| Update | Любое | Активен |
| **Delete** | Любое | **Отключён** |

#### Блок «DriveLetter» (`driveLetterGroupBox`)

| Action | Поле Location пустое | Состояние |
|--------|---------------------|-----------|
| Create / Replace | Да | **Отключён** |
| Create / Replace | Нет | Активен |
| Update / Delete | Любое | Активен |

#### Динамический текст радиокнопок при смене Action

Текст кнопки `driveRadioButton` и `firstAvailableRadioButton` меняется динамически:

| Action | Location | Текст `driveRadioButton` (EN/RU) | Текст `firstAvailableRadioButton` (EN/RU) |
|--------|----------|----------------------------------|------------------------------------------|
| Create | Любое | «Use:» / «Использовать:» | «Use first available, starting at:» / «Первый доступный, начиная с:» |
| Replace | Любое | «Use:» / «Использовать:» | «Use first available, starting at:» / «Первый доступный, начиная с:» |
| Update | Пустое | «Existing:» / «Существующий:» | «Use first available, starting at:» / «Первый доступный, начиная с:» |
| Update | Не пустое | «Use:» / «Использовать:» | «Use first available, starting at:» / «Первый доступный, начиная с:» |
| **Delete** | Любое | «Delete:» / «Удалить:» | «Delete all, starting at:» / «Удалить, начиная с:» |

---

### Группы радиокнопок (QButtonGroup)

Кнопки «Hide/Show this drive» и «Hide/Show all drive» **не привязаны к маппером напрямую** — их значения сохраняются вручную в методе `submit()`:

```cpp
void DrivesWidget::submit()
{
    if (mapper && validate()) {
        mapper->submit();
        m_item->setProperty<int>(DrivesItem::THIS_DRIVE, ui->thisButtonGroup->checkedId());
        m_item->setProperty<int>(DrivesItem::ALL_DRIVES, ui->allButtonGroup->checkedId());
        emit dataChanged();
    }
}
```

Идентификаторы кнопок в группах задаются при инициализации:

| Группа | Кнопка | ID |
|--------|--------|-----|
| `thisButtonGroup` | `noChangeThisRadioButton` | 0 |
| `thisButtonGroup` | `hideThisRadioButton` | 1 |
| `thisButtonGroup` | `showThisRadioButton` | 2 |
| `allButtonGroup` | `noChangeAllRadioButton` | 0 |
| `allButtonGroup` | `hideAllRadioButton` | 1 |
| `allButtonGroup` | `showAllRadioButton` | 2 |

---

### Валидация формы

Метод `validate()` проверяет одно поле:

| Поле | Условие | Сообщение (EN) | Сообщение (RU) |
|------|---------|----------------|----------------|
| `pathLineEdit` | Не должно быть пустым | `"Please enter location."` | `"Пожалуйста, введите путь."` |

---

## Модель данных

### DrivesItem

Класс `DrivesItem` (наследник `ModelView::CompoundItem`) представляет данные одной политики сетевого диска.

#### Свойства

| Свойство | Строка-ключ | Тип данных | Значение по умолчанию | Описание |
|----------|-------------|------------|----------------------|----------|
| `ACTION` | `"action"` | `int` | `0` (Create) | Действие: 0=Create, 1=Replace, 2=Update, 3=Delete |
| `PATH` | `"path"` | `std::string` | `""` | UNC-путь к сетевому ресурсу |
| `PERSISTENT` | `"persistent"` | `bool` | `false` | Восстанавливать подключение при входе (Reconnect) |
| `LABEL` | `"label"` | `std::string` | `""` | Метка диска (Label as) |
| `LETTER` | `"letter"` | `std::string` | `""` | Буква диска (A: — Z:) |
| `USER_NAME` | `"userName"` | `std::string` | `""` | Имя пользователя для подключения |
| `CPASSWORD` | `"cpassword"` | `std::string` | `""` | Зашифрованный пароль для подключения |
| `USE_LETTER` | `"useLetter"` | `bool` | `true` | Использовать конкретную букву диска |
| `THIS_DRIVE` | `"thisDrive"` | `int` | `0` | Видимость текущего диска: 0=Без изм., 1=Скрыть, 2=Показать |
| `ALL_DRIVES` | `"allDrives"` | `int` | `0` | Видимость всех дисков: 0=Без изм., 1=Скрыть, 2=Показать |
| `USE_EXISTING` | `"useExisting"` | `bool` | `false` | Использовать первую доступную букву (`= !USE_LETTER`) |

#### Привязка к виджетам (QDataWidgetMapper)

| Индекс | Свойство модели | Виджет |
|--------|-----------------|--------|
| 0 | `ACTION` | `actionComboBox` (свойство `currentIndex`) |
| 1 | `PATH` | `pathLineEdit` |
| 2 | `PERSISTENT` | `reconnectCheckBox` |
| 3 | `LABEL` | `labelLineEdit` |
| 4 | `LETTER` | `driveComboBox` |
| 7 | `USE_LETTER` | `driveRadioButton` |
| 10 | `USE_EXISTING` | `firstAvailableRadioButton` |

> Свойства `THIS_DRIVE` (индекс 8) и `ALL_DRIVES` (индекс 9) не привязаны через маппер — они устанавливаются напрямую в `submit()` через `setProperty`.

Настройки маппера:
- **Submit Policy**: `QDataWidgetMapper::ManualSubmit`
- **Orientation**: `Qt::Vertical`
- **Delegate**: `ModelView::ViewModelDelegate`

---

### DrivesContainerItem

Класс `DrivesContainerItem` является строкой таблицы в списке политик сетевых дисков. Содержит отображаемые свойства и вложенные объекты `CommonItem` и `DrivesItem`.

#### Свойства контейнера (видимые столбцы таблицы)

| Свойство | Строка-ключ | Тип | Описание |
|----------|-------------|-----|----------|
| `NAME` | `"name"` | `std::string` | UNC-путь (дублирует PATH, используется как имя) |
| `ORDER` | `"order"` | `int` | Порядковый номер применения |
| `ACTION` | `"action"` | `std::string` | Действие в текстовом виде |
| `PATH` | `"path"` | `std::string` | UNC-путь к сетевому ресурсу |
| `PERSISTENT` | `"persistent"` | `std::string` | «Да» / «Нет» — признак переподключения |

#### Вложенные объекты (скрытые)

| Ключ | Тип | Описание |
|------|-----|----------|
| `"common"` | `CommonItem` | Общие параметры политики (вкладка «Общие») |
| `"drives"` | `DrivesItem` | Данные сетевого диска |

Изменения в `DrivesItem` по свойствам `ACTION`, `PATH`, `PERSISTENT` автоматически синхронизируются с отображаемыми свойствами контейнера через `setupListeners()`. При изменении `PATH` поле `NAME` также обновляется тем же значением.

---

## Чтение и запись политик

### DrivesPreferenceReader

Класс `DrivesPreferenceReader` (наследник `BasePreferenceReader`) отвечает за загрузку политик сетевых дисков из XML-файла.

### DrivesPreferenceWriter

Класс `DrivesPreferenceWriter` (наследник `BasePreferenceWriter`) отвечает за сохранение политик в XML-файл.

### DrivesModelBuilder

Класс `DrivesModelBuilder` выполняет конвертацию между XML-схемой (`DriveMaps`) и внутренней моделью данных (`PreferencesModel`):

```cpp
// XML → модель
std::unique_ptr<PreferencesModel> model = builder.schemaToModel(driveMaps);

// модель → XML
std::unique_ptr<DriveMaps> schema = builder.modelToSchema(model);
```

---

## Интернационализация (i18n)

Модуль поддерживает переводы через файлы:
- `i18n/drives_translation_en.ts` — английский
- `i18n/drives_translation_ru.ts` — русский

### Таблица переводов UI-элементов

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Form | Форма |
| Action: | Действие: |
| Create | Создать |
| Replace | Заменить |
| Update | Обновить |
| Delete | Удалить |
| Location: | Путь: |
| Reconnect: | Переподключиться: |
| Label as: | Название: |
| DriveLetter | Имя диска |
| Existing: | Существующий: |
| Use first available, starting at: | Первый доступный, начиная с: |
| Delete all, starting at: | Удалить, начиная с: |
| Hide/Show this drive | Скрыть/Показать диск |
| No change | Без изменений |
| Hide this drive | Скрыть диск |
| Show this drive | Показать диск |
| Hide/Show all drive | Скрыть/Показать все диски |
| Hide all drive | Скрыть все диски |
| Show all drive | Показать все диски |
| Use: | Использовать: |
| Delete: | Удалить: |
| General | Основные настройки |

### Таблица переводов свойств модели

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Name | Имя |
| Order | Очерёдность |
| Action | Действие |
| Path | Путь |
| Reconnect | Переподключиться |
| Yes | Да |
| No | Нет |

### Переводы сообщений валидации

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Please enter location. | Пожалуйста, введите путь. |

---

## Архитектура

### Иерархия классов

```
QWidget
└── BasePreferenceWidget
    └── DrivesWidget

ModelView::CompoundItem
├── DrivesItem
└── DrivesContainerItem
        ├── CommonItem      (вложен, скрыт)
        └── DrivesItem      (вложен, скрыт)

BaseModelBuilder
└── DrivesModelBuilder

BasePreferenceReader
└── DrivesPreferenceReader

BasePreferenceWriter
└── DrivesPreferenceWriter
```

### Взаимодействие компонентов

```
XML-файл политик
      │
      ▼
DrivesPreferenceReader
      │  createModel()
      ▼
PreferencesModel
      │
      ▼
DrivesModelBuilder::schemaToModel()
      │
      ▼
DrivesContainerItem[]    ← таблица политик
      │
      ├── DrivesItem      ← данные одного сетевого диска
      └── CommonItem      ← общие параметры

      │  редактирование
      ▼
DrivesWidget (форма)
      │  QDataWidgetMapper
      └── actionComboBox, pathLineEdit, reconnectCheckBox,
          labelLineEdit, driveComboBox, driveRadioButton,
          firstAvailableRadioButton

      │  + ручная запись через submit()
      └── thisButtonGroup (THIS_DRIVE), allButtonGroup (ALL_DRIVES)

      │  сохранение
      ▼
DrivesPreferenceWriter → XML-файл политик
```

---

## Примеры использования

### Создание политики подключения сетевого диска

```cpp
// Подключить \\server\share как диск Z: с переподключением
auto item = std::make_unique<preferences::DrivesItem>();
item->setProperty(preferences::DrivesItem::ACTION, 0);         // Create
item->setProperty(preferences::DrivesItem::PATH,
                  std::string("\\\\server\\share"));
item->setProperty(preferences::DrivesItem::PERSISTENT, true);  // Reconnect
item->setProperty(preferences::DrivesItem::LABEL,
                  std::string("Общая папка"));
item->setProperty(preferences::DrivesItem::LETTER,
                  std::string("Z:"));
item->setProperty(preferences::DrivesItem::USE_LETTER, true);
item->setProperty(preferences::DrivesItem::THIS_DRIVE, 0);     // No change
item->setProperty(preferences::DrivesItem::ALL_DRIVES, 0);     // No change
```

### Использование DrivesWidget в диалоге

```cpp
auto widget = new preferences::DrivesWidget(parentWidget);
widget->setItem(containerItem->getDrives());

// После подтверждения пользователем:
if (widget->validate()) {
    widget->submit(); // применяет маппер + THIS_DRIVE + ALL_DRIVES
}
```

---

## Примечания

1. Свойство `USE_EXISTING` вычисляется как `!USE_LETTER`. Они соответствуют двум взаимоисключающим радиокнопкам группы `driveButtonGroup`.

2. Поля `USER_NAME` (индекс 5) и `CPASSWORD` (индекс 6) присутствуют в модели, но **не отображаются в форме** и не привязаны к маппером. Они предназначены для хранения учётных данных подключения.

3. Свойства `THIS_DRIVE` и `ALL_DRIVES` не обрабатываются маппером — они записываются напрямую в модель в методе `submit()` через `checkedId()` соответствующей группы кнопок.

4. При пустом поле `Location` в режимах Create и Replace вся группа букв диска (`driveLetterGroupBox`) и группа `thisGroupBox` автоматически блокируются.

5. В режиме **Update** при пустом поле `Location` кнопка `firstAvailableRadioButton` отключается, а `driveRadioButton` показывает текст «Existing:» — предполагается, что диск уже подключён.

6. Таблица политик отображает столбцы: **Имя**, **Очерёдность**, **Действие**, **Путь**, **Переподключиться** — все данные берутся из `DrivesContainerItem` и обновляются автоматически при изменении `DrivesItem` через слушатели (`setupListeners()`).
