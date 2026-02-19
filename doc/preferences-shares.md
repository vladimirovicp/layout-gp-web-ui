# Документация модуля Preferences — Сетевые папки (Network Shares)

## Обзор

Модуль `preferences/shares` реализует поддержку политик управления **сетевыми папками** (Network Shares) в рамках подсистемы групповых политик GPUI. Он позволяет создавать, заменять, обновлять и удалять общие сетевые ресурсы (shared folders), а также управлять ограничениями пользователей и перечислением на основе доступа (Access-Based Enumeration).

В дереве политик модуль расположен по пути:

```
[Групповая политика]
└── Компьютер / Пользователь
    └── Настройки (Preferences)
        └── Настройки Windows
            └── Сетевые папки (Network Shares)
```

### Технологии

- **Qt Widgets** — построение пользовательского интерфейса
- **ModelView Framework** — работа с моделями данных
- **QDataWidgetMapper** — привязка данных модели к виджетам формы
- **QRadioButton** — выбор режимов ограничения пользователей и ABE
- **XML-схема** (`NetworkShareSettings`) — сериализация/десериализация политик

---

## Структура модуля

```
src/plugins/preferences/shares/
├── sharesitem.h / .cpp               — модель данных одной сетевой папки
├── sharescontaineritem.h / .cpp      — контейнер (строка таблицы политик)
├── shareswidget.h / .cpp             — виджет формы редактирования
├── shareswidgetslots.cpp             — слоты сигналов формы
├── shareswidget.ui                   — описание формы (Qt Designer)
├── sharesmodelbuilder.h / .cpp       — конвертация XML-схемы ↔ модель
├── sharespreferencereader.h / .cpp   — чтение политик из файла
├── sharespreferencewriter.h / .cpp   — запись политик в файл
└── i18n/
    ├── shares_translation_en.ts      — переводы (английский)
    └── shares_translation_ru.ts      — переводы (русский)
```

---

## Форма редактирования (SharesWidget)

Форма `shareswidget.ui` открывается при создании или редактировании политики сетевой папки. Она разделена на несколько логических блоков.

### Схема формы

```
┌──────────────────────────────────────────────────────────────┐
│  Action: [ Create ▼ ]                                        │
│ ────────────────────────────────────────────────────────────  │
│  Share name:   [________________________________] [...]       │
│  Folder path:  [________________________________] [...]       │
│  Comment:      [________________________________________]     │
│                                                              │
│  Action           ┌─ modifiersFrame ───────────────────────┐ │
│  Modifiers:       │  ☐ Update all regular shares           │ │
│                   │  ☐ Update all hidden non-administrative │ │
│                   │     shares                              │ │
│                   │  ☐ Update all administrative            │ │
│                   │     drive-letter shares                 │ │
│                   └────────────────────────────────────────┘ │
│                                                              │
│  User limit:      ┌─ userFrame ───────────────────────────┐  │
│                   │  ● No change                           │  │
│                   │  ○ Maximum allowed                     │  │
│                   │  ○ Allow this number of users: [  10]  │  │
│                   └────────────────────────────────────────┘  │
│                                                              │
│  Access-based     ┌─ accessFrame ─────────────────────────┐  │
│  Enumeration:     │  ● No change                          │  │
│                   │  ○ Enable                              │  │
│                   │  ○ Disable                             │  │
│                   └───────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Элементы управления формы

| Виджет | Имя в коде | Тип | Свойство модели (индекс) | Описание |
|--------|-----------|-----|--------------------------|----------|
| Метка | `actionLabel` | `QLabel` | — | «Action:» / «Действие:» |
| Выпадающий список | `actionComboBox` | `QComboBox` | `ACTION` (0) | Действие над сетевой папкой |
| Метка | `shareNameLabel` | `QLabel` | — | «Share name:» / «Имя общего сетевого ресурса:» |
| Поле ввода | `shareNameLineEdit` | `ShortcutLineEdit` | `NAME` (1) | Имя общего сетевого ресурса |
| Кнопка | `shareToolButton` | `QToolButton` | — | Кнопка «...» (отключена) |
| Метка | `folderPathLabel` | `QLabel` | — | «Folder path:» / «Путь к каталогу:» |
| Поле ввода | `folderPathLineEdit` | `ShortcutLineEdit` | `PATH` (2) | Путь к каталогу на диске |
| Кнопка | `folderToolButton` | `QToolButton` | — | Открыть диалог выбора папки («...») |
| Метка | `commentLabel` | `QLabel` | — | «Comment:» / «Комментарий:» |
| Поле ввода | `commentLineEdit` | `ShortcutLineEdit` | `COMMENT` (3) | Описание/комментарий к общей папке |
| Метка | `actionModifiersLabel` | `QLabel` | — | «Action Modifiers:» / «Модификаторы действий:» |
| Фрейм | `modifiersFrame` | `QFrame` | — | Группа модификаторов действия |
| Чекбокс | `updateAllRegularShares` | `QCheckBox` | `ALL_REGULAR` (4) | Обновить все регулярные общие ресурсы |
| Чекбокс | `updateAllHiddenShares` | `QCheckBox` | `ALL_HIDDEN` (5) | Обновить все скрытые не административные ресурсы |
| Чекбокс | `updateAllAdministrativeDrives` | `QCheckBox` | `ALL_ADMIN_DRIVE` (6) | Обновить все административные диски ресурсов |
| Метка | `userLimitLabel` | `QLabel` | — | «User limit:» / «Лимит пользователей:» |
| Фрейм | `userFrame` | `QFrame` | — | Группа настроек лимита пользователей |
| Радиокнопка | `noChangeUsers` | `QRadioButton` | `LIMIT_USERS` = `"NO_CHANGE"` | Без изменений (по умолчанию) |
| Радиокнопка | `maximumAllowedUsers` | `QRadioButton` | `LIMIT_USERS` = `"MAX_ALLOWED"` | Максимально допустимое число |
| Радиокнопка | `allowThisNumberOfUsers` | `QRadioButton` | `LIMIT_USERS` = `"SET_LIMIT"` | Разрешить указанное число пользователей |
| Спинбокс | `numberOfUsers` | `QSpinBox` | `USER_LIMIT` (8) | Число пользователей (0–65535, по умолчанию 10) |
| Метка | `accessBasedLabel` | `QLabel` | — | «Access-based Enumeration:» / «Перечисление на основе доступа:» |
| Фрейм | `accessFrame` | `QFrame` | — | Группа настроек ABE |
| Радиокнопка | `noChangeAccess` | `QRadioButton` | `ACCESS_BASED_ENUMERATION` = `"NO_CHANGE"` | Без изменений (по умолчанию) |
| Радиокнопка | `enableAccess` | `QRadioButton` | `ACCESS_BASED_ENUMERATION` = `"ENABLE"` | Включить ABE |
| Радиокнопка | `disableAccess` | `QRadioButton` | `ACCESS_BASED_ENUMERATION` = `"DISABLE"` | Отключить ABE |

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

#### Блок «Action Modifiers» (`modifiersFrame`)

| Action | Состояние |
|--------|-----------|
| Create | **Отключён** |
| Replace | **Отключён** |
| Update | Активен |
| Delete | Активен |

#### Блок «User limit» (`userFrame`)

| Action | Состояние |
|--------|-----------|
| Create | Активен |
| Replace | Активен |
| Update | Активен |
| **Delete** | **Отключён** |

#### Блок «Access-based Enumeration» (`accessFrame`)

| Action | Состояние |
|--------|-----------|
| Create | Активен |
| Replace | Активен |
| Update | Активен |
| **Delete** | **Отключён** |

#### Поля ввода в режиме Delete

| Поле | Состояние |
|------|-----------|
| `commentLineEdit` | **Отключён** |
| `folderPathLineEdit` | **Отключён** |
| `folderToolButton` | **Отключён** |

---

### Взаимодействие радиокнопок User Limit с спинбоксом

| Радиокнопка | Состояние `numberOfUsers` |
|-------------|--------------------------|
| `noChangeUsers` | **Отключён** |
| `maximumAllowedUsers` | **Отключён** |
| `allowThisNumberOfUsers` | Активен |

---

### Валидация формы

Метод `validate()` проверяет два поля:

| Поле | Условие | Сообщение (EN) | Сообщение (RU) |
|------|---------|----------------|----------------|
| `shareNameLineEdit` | Не должно быть пустым | `"Please input name value."` | `"Введите имя."` |
| `folderPathLineEdit` | Не должно быть пустым | `"Please input folder path value."` | `"Введите путь к папке."` |

---

### Кнопка выбора пути («...»)

При нажатии на `folderToolButton` открывается системный диалог выбора директории (`FileDialogUtils::getOpenDirectoryName`). Выбранный путь автоматически вставляется в поле `folderPathLineEdit`.

> Кнопка `shareToolButton` рядом с полем `shareNameLineEdit` по умолчанию **отключена** (`enabled = false`).

---

## Модель данных

### SharesItem

Класс `SharesItem` (наследник `ModelView::CompoundItem`) представляет данные одной политики сетевой папки.

#### Свойства

| Свойство | Строка-ключ | Тип данных | Значение по умолчанию | Описание |
|----------|-------------|------------|----------------------|----------|
| `ACTION` | `"action"` | `int` | `0` (Create) | Действие: 0=Create, 1=Replace, 2=Update, 3=Delete |
| `NAME` | `"name"` | `QString` | `""` | Имя общего сетевого ресурса (share name) |
| `PATH` | `"path"` | `QString` | `""` | Путь к каталогу на диске (folder path) |
| `COMMENT` | `"comment"` | `QString` | `""` | Комментарий к общей папке |
| `ALL_REGULAR` | `"allRegular"` | `bool` | `false` | Обновить все регулярные общие ресурсы |
| `ALL_HIDDEN` | `"allHidden"` | `bool` | `false` | Обновить все скрытые не административные ресурсы |
| `ALL_ADMIN_DRIVE` | `"allAdminDrive"` | `bool` | `false` | Обновить все административные ресурсы дисков |
| `LIMIT_USERS` | `"limitUsers"` | `QString` | `"NO_CHANGE"` | Режим ограничения пользователей |
| `USER_LIMIT` | `"userLimit"` | `int` | `0` | Числовое ограничение пользователей |
| `ACCESS_BASED_ENUMERATION` | `"abe"` | `QString` | `"NO_CHANGE"` | Режим перечисления на основе доступа (ABE) |

#### Значения поля LIMIT_USERS

| Значение | Описание (EN) | Описание (RU) |
|----------|--------------|---------------|
| `"NO_CHANGE"` | No change | Без изменений |
| `"MAX_ALLOWED"` | Maximum allowed | Максимально допустимое |
| `"SET_LIMIT"` | Allow this number of users | Указанное число пользователей |

#### Значения поля ACCESS_BASED_ENUMERATION

| Значение | Описание (EN) | Описание (RU) |
|----------|--------------|---------------|
| `"NO_CHANGE"` | No change | Без изменений |
| `"ENABLE"` | Enable | Включить |
| `"DISABLE"` | Disable | Отключить |

#### Привязка к виджетам (QDataWidgetMapper)

| Индекс | Свойство модели | Виджет |
|--------|-----------------|--------|
| 0 | `ACTION` | `actionComboBox` (свойство `currentIndex`) |
| 1 | `NAME` | `shareNameLineEdit` |
| 2 | `PATH` | `folderPathLineEdit` |
| 3 | `COMMENT` | `commentLineEdit` |
| 4 | `ALL_REGULAR` | `updateAllRegularShares` |
| 5 | `ALL_HIDDEN` | `updateAllHiddenShares` |
| 6 | `ALL_ADMIN_DRIVE` | `updateAllAdministrativeDrives` |
| 8 | `USER_LIMIT` | `numberOfUsers` |

> Свойства `LIMIT_USERS` (индекс 7) и `ACCESS_BASED_ENUMERATION` (индекс 9) **не привязаны через маппер** — они устанавливаются напрямую в `submit()` на основе состояния радиокнопок.

Настройки маппера:
- **Submit Policy**: `QDataWidgetMapper::ManualSubmit`
- **Orientation**: `Qt::Vertical`
- **Delegate**: `ModelView::ViewModelDelegate`

Начальное состояние радиокнопок устанавливается при загрузке данных:
- `setInitialUserFrameRadioButton()` — считывает `LIMIT_USERS` из модели (индекс 7) и выбирает соответствующую радиокнопку
- `setInitialAccessFrameRadioButton()` — считывает `ACCESS_BASED_ENUMERATION` из модели (индекс 9) и выбирает соответствующую радиокнопку

---

### Группы радиокнопок (ручная запись в submit)

Значения радиокнопок сохраняются вручную в методе `submit()`:

```cpp
void SharesWidget::submit()
{
    if (mapper && validate()) {
        mapper->submit();

        // Access-Based Enumeration
        if (ui->noChangeAccess->isChecked())
            m_item->setProperty(SharesItem::ACCESS_BASED_ENUMERATION, "NO_CHANGE");
        if (ui->enableAccess->isChecked())
            m_item->setProperty(SharesItem::ACCESS_BASED_ENUMERATION, "ENABLE");
        if (ui->disableAccess->isChecked())
            m_item->setProperty(SharesItem::ACCESS_BASED_ENUMERATION, "DISABLE");

        // User Limit
        if (ui->noChangeUsers->isChecked())
            m_item->setProperty(SharesItem::LIMIT_USERS, "NO_CHANGE");
        if (ui->maximumAllowedUsers->isChecked())
            m_item->setProperty(SharesItem::LIMIT_USERS, "MAX_ALLOWED");
        if (ui->allowThisNumberOfUsers->isChecked())
            m_item->setProperty(SharesItem::LIMIT_USERS, "SET_LIMIT");

        emit dataChanged();
    }
}
```

---

### SharesContainerItem

Класс `SharesContainerItem` является строкой таблицы в списке политик сетевых папок. Содержит отображаемые свойства и вложенные объекты `CommonItem` и `SharesItem`.

#### Свойства контейнера (видимые столбцы таблицы)

| Свойство | Строка-ключ | Тип | Описание |
|----------|-------------|-----|----------|
| `NAME` | `"name"` | `std::string` | Имя общего сетевого ресурса |
| `ORDER` | `"order"` | `int` | Порядковый номер применения |
| `ACTION` | `"action"` | `std::string` | Действие в текстовом виде |
| `PATH` | `"path"` | `std::string` | Путь к каталогу на диске |
| `USER_LIMIT` | `"userLimit"` | `std::string` | Ограничение пользователей (текстовое: «Unchanged» / «Maximum» / число) |
| `ACCESS_BASED_ENUMERATION` | `"abe"` | `std::string` | ABE (текстовое: «Unchanged» / «Enabled» / «Disabled») |

#### Вложенные объекты (скрытые)

| Ключ | Тип | Описание |
|------|-----|----------|
| `"common"` | `CommonItem` | Общие параметры политики (вкладка «Общие») |
| `"shares"` | `SharesItem` | Данные сетевой папки |

#### Синхронизация контейнера с моделью (setupListeners)

Изменения в `SharesItem` автоматически синхронизируются с отображаемыми свойствами контейнера через `setupListeners()`:

| Свойство SharesItem | Свойство контейнера | Логика преобразования |
|---------------------|--------------------|-----------------------|
| `ACTION` | `ACTION` | `defaultActionsToString()` — числовое значение → строка |
| `NAME` | `NAME` | Прямое копирование |
| `PATH` | `PATH` | Прямое копирование |
| `LIMIT_USERS` | `USER_LIMIT` | `"NO_CHANGE"` → «Unchanged», `"MAX_ALLOWED"` → «Maximum», иначе → числовое значение `USER_LIMIT` |
| `ACCESS_BASED_ENUMERATION` | `ACCESS_BASED_ENUMERATION` | `"NO_CHANGE"` → «Unchanged», `"ENABLE"` → «Enabled», `"DISABLE"` → «Disabled» |

---

## Чтение и запись политик

### SharesPreferenceReader

Класс `SharesPreferenceReader` (наследник `BasePreferenceReader`) отвечает за загрузку политик сетевых папок из XML-файла.

```cpp
auto reader = std::make_unique<preferences::SharesPreferenceReader>();
std::ifstream inputFile("shares.xml");
auto model = reader->read(inputFile);
```

### SharesPreferenceWriter

Класс `SharesPreferenceWriter` (наследник `BasePreferenceWriter`) отвечает за сохранение политик в XML-файл.

### SharesModelBuilder

Класс `SharesModelBuilder` выполняет конвертацию между XML-схемой (`NetworkShareSettings`) и внутренней моделью данных (`PreferencesModel`):

```cpp
// XML → модель
std::unique_ptr<PreferencesModel> model = builder.schemaToModel(networkShareSettings);

// модель → XML
std::unique_ptr<NetworkShareSettings> schema = builder.modelToSchema(model);
```

#### Условная сериализация при записи (modelToSchema)

При записи модели в XML-схему применяются условия:

| Свойство | Условие записи |
|----------|---------------|
| `ALL_REGULAR`, `ALL_HIDDEN`, `ALL_ADMIN_DRIVE` | Записываются только если Action **не** Create и **не** Replace |
| `COMMENT`, `PATH`, `LIMIT_USERS`, `USER_LIMIT`, `ABE` | Записываются только если Action **не** Delete |
| `USER_LIMIT` | Записывается только если значение > 0 |

---

## Интернационализация (i18n)

Модуль поддерживает переводы через файлы:
- `i18n/shares_translation_en.ts` — английский
- `i18n/shares_translation_ru.ts` — русский

### Таблица переводов UI-элементов

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Form | Форма |
| Action: | Действие: |
| Create | Создать |
| Replace | Заменить |
| Update | Обновить |
| Delete | Удалить |
| Share name: | Имя общего сетевого ресурса: |
| Folder path: | Путь к каталогу: |
| Comment: | Комментарий: |
| Action Modifiers: | Модификаторы действий: |
| Update all regular shares | Обновление всех регулярных общих сетевых ресурсов |
| Update all hidden non-administrative shares | Обновление всех скрытых не административных общих сетевых ресурсов |
| Update all administrative drive-letter shares | Обновление всех административных дисков общих сетевых ресурсов |
| User limit: | Лимит пользователей: |
| No change | Без изменений |
| Maximum allowed | Максимально допустимое |
| Allow this number of users: | Разрешение на количество пользователей: |
| Access-based Enumeration: | Перечисление на основе доступа: |
| Enable | Включить |
| Disable | Отключить |
| General | Основные настройки |

### Таблица переводов свойств модели

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Name | Имя |
| Order | Очерёдность |
| Action | Действие |
| Path | Путь |
| User Limit | Ограничение пользователя |
| ABE | ABE |
| Unchanged | Неизмененный |
| Maximum | Максимум |
| Enabled | Включено |
| Disabled | Выключено |

### Переводы сообщений валидации

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Please input name value. | Введите имя. |
| Please input folder path value. | Введите путь к папке. |

---

## Архитектура

### Иерархия классов

```
QWidget
└── BasePreferenceWidget
    └── SharesWidget

ModelView::CompoundItem
├── SharesItem
└── SharesContainerItem
        ├── CommonItem      (вложен, скрыт)
        └── SharesItem      (вложен, скрыт)

BaseModelBuilder
└── SharesModelBuilder

BasePreferenceReader
└── SharesPreferenceReader

BasePreferenceWriter
└── SharesPreferenceWriter
```

### Взаимодействие компонентов

```
XML-файл политик
      │
      ▼
SharesPreferenceReader
      │  createModel()
      ▼
PreferencesModel
      │
      ▼
SharesModelBuilder::schemaToModel()
      │
      ▼
SharesContainerItem[]    ← таблица политик
      │
      ├── SharesItem      ← данные одной сетевой папки
      └── CommonItem      ← общие параметры

      │  редактирование
      ▼
SharesWidget (форма)
      │  QDataWidgetMapper
      └── actionComboBox, shareNameLineEdit, folderPathLineEdit,
          commentLineEdit, updateAllRegularShares, updateAllHiddenShares,
          updateAllAdministrativeDrives, numberOfUsers

      │  + ручная запись через submit()
      └── радиокнопки User Limit (LIMIT_USERS)
          радиокнопки ABE (ACCESS_BASED_ENUMERATION)

      │  сохранение
      ▼
SharesPreferenceWriter → XML-файл политик
```

---

## Примеры использования

### Создание политики сетевой папки

```cpp
auto item = std::make_unique<preferences::SharesItem>();
item->setProperty(preferences::SharesItem::ACTION, 0);         // Create
item->setProperty(preferences::SharesItem::NAME,
                  std::string("SharedDocs"));
item->setProperty(preferences::SharesItem::PATH,
                  std::string("/srv/samba/docs"));
item->setProperty(preferences::SharesItem::COMMENT,
                  std::string("Общие документы"));
item->setProperty(preferences::SharesItem::ALL_REGULAR, false);
item->setProperty(preferences::SharesItem::ALL_HIDDEN, false);
item->setProperty(preferences::SharesItem::ALL_ADMIN_DRIVE, false);
item->setProperty(preferences::SharesItem::LIMIT_USERS,
                  std::string("SET_LIMIT"));
item->setProperty(preferences::SharesItem::USER_LIMIT, 50);
item->setProperty(preferences::SharesItem::ACCESS_BASED_ENUMERATION,
                  std::string("ENABLE"));
```

### Использование SharesWidget в диалоге

```cpp
auto widget = new preferences::SharesWidget(parentWidget);
widget->setItem(containerItem->getShares());

// После подтверждения пользователем:
if (widget->validate()) {
    widget->submit(); // применяет маппер + LIMIT_USERS + ABE
}
```

---

## Примечания

1. Свойства `LIMIT_USERS` и `ACCESS_BASED_ENUMERATION` не обрабатываются маппером — они записываются напрямую в модель в методе `submit()` на основе состояния радиокнопок.

2. Спинбокс `numberOfUsers` активен только когда выбрана радиокнопка `allowThisNumberOfUsers`. При выборе `noChangeUsers` или `maximumAllowedUsers` спинбокс автоматически отключается.

3. Кнопка `shareToolButton` рядом с полем `shareNameLineEdit` отключена по умолчанию (`enabled = false` в UI-файле).

4. В режиме **Delete** поля `commentLineEdit`, `folderPathLineEdit` и кнопка `folderToolButton` отключаются, так как при удалении общего ресурса эти данные не требуются.

5. В режимах **Create** и **Replace** блок модификаторов (`modifiersFrame`) отключён, так как модификаторы применимы только для обновления и удаления существующих ресурсов.

6. При записи в XML-схему модификаторы (`ALL_REGULAR`, `ALL_HIDDEN`, `ALL_ADMIN_DRIVE`) сохраняются только для режимов Update и Delete, а свойства `COMMENT`, `PATH`, `LIMIT_USERS`, `USER_LIMIT`, `ABE` — только для режимов, отличных от Delete.

7. Таблица политик отображает столбцы: **Имя**, **Очерёдность**, **Действие**, **Путь**, **Ограничение пользователя**, **ABE** — все данные берутся из `SharesContainerItem` и обновляются автоматически при изменении `SharesItem` через слушатели (`setupListeners()`).
