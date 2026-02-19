# Документация модуля Preferences — Переменные окружения (Environment)

## Обзор

Модуль `preferences/variables` реализует поддержку политик управления **переменными окружения** (Environment Variables) в рамках подсистемы групповых политик GPUI. Он позволяет создавать, изменять, заменять и удалять переменные окружения как для отдельного пользователя, так и на уровне всей системы.

В дереве политик модуль расположен по пути:

```
[Групповая политика]
└── Компьютер / Пользователь
    └── Настройки (Preferences)
        └── Настройки Системы (System Settings)
            └── Окружение (Environment)
```

### Технологии

- **Qt Widgets** — построение пользовательского интерфейса
- **ModelView Framework** — работа с моделями данных
- **QDataWidgetMapper** — привязка данных модели к виджетам формы
- **XML-схема** (`EnvironmentVariables`) — сериализация/десериализация политик

---

## Структура модуля

```
src/plugins/preferences/variables/
├── variablesitem.h / .cpp            — модель данных одной переменной окружения
├── variablescontaineritem.h / .cpp   — контейнер (строка таблицы политик)
├── variableswidget.h / .cpp          — виджет формы редактирования
├── variableswidgetslots.cpp          — слоты сигналов формы
├── variableswidget.ui                — описание формы (Qt Designer)
├── variablesmodelbuilder.h / .cpp    — конвертация XML-схемы ↔ модель
├── variablespreferencereader.h / .cpp — чтение политик из файла
├── variablespreferencewriter.h / .cpp — запись политик в файл
└── i18n/
    ├── variables_translation_en.ts   — переводы (английский)
    └── variables_translation_ru.ts   — переводы (русский)
```

---

## Форма редактирования (VariablesWidget)

Форма `variableswidget.ui` открывается при создании или редактировании политики переменной окружения. Она организована в виде вертикального списка элементов управления.

### Схема формы

```
┌─────────────────────────────────────────────────────────┐
│  Action: [ Create ▼ ]                                   │
│ ─────────────────────────────────────────────────────── │
│  ┌──────────────────────────────┐                       │
│  │ Variable Type                │                       │
│  │  ● User Variable             │                       │
│  │  ○ System Variable           │                       │
│  └──────────────────────────────┘                       │
│  Name: [________________________] or  ☐ PATH            │
│                                       ☐ Partial         │
│  Value: [_______________________________________________]│
│  ┌──────────────────────────────────────────────────┐   │
│  │ Details                                          │   │
│  │  <текстовое описание текущего режима действия>   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Элементы управления формы

| Виджет | Имя в коде | Тип | Свойство модели | Описание |
|--------|-----------|-----|-----------------|----------|
| Выпадающий список | `actionComboBox` | `QComboBox` | `ACTION` (индекс 0) | Действие над переменной: Create / Replace / Update / Delete |
| Радиокнопка | `userVariableRadio` | `QRadioButton` | `USER` (индекс 1) | Переменная пользователя (отмечена по умолчанию) |
| Радиокнопка | `systemVariableRadio` | `QRadioButton` | `SYSTEM` (индекс 5) | Переменная системы (= `!USER`) |
| Поле ввода | `nameLineEdit` | `ShortcutLineEdit` | `NAME` (индекс 2) | Имя переменной окружения |
| Метка | `nameLabel` | `QLabel` | — | «Name:» / «Имя:» |
| Метка | `orLabel` | `QLabel` | — | «or» / «или» |
| Чекбокс | `pathCheckBox` | `QCheckBox` | — | Быстрый выбор переменной PATH (только для системных переменных) |
| Чекбокс | `partialCheckBox` | `QCheckBox` | `PARTIAL` (индекс 3) | Частичное изменение PATH (доступно только при включённом `pathCheckBox`) |
| Поле ввода | `valueLineEdit` | `ShortcutLineEdit` | `VALUE` (индекс 4) | Значение переменной окружения |
| Метка | `valueLabel` | `QLabel` | — | «Value:» / «Значение:» |
| Группа | `detailsGroupBox` | `QGroupBox` | — | «Details» / «Детали» — блок с описанием |
| Метка | `detailsLabel` | `QLabel` | — | Динамический текст, описывающий поведение выбранного действия |

### Поле «Action» — допустимые значения

| Индекс | Значение (EN) | Значение (RU) | Константа в коде |
|--------|--------------|---------------|-----------------|
| 0 | Create | Создать | `CREATE__MODE` |
| 1 | Replace | Заменить | `REPLACE_MODE` |
| 2 | Update | Обновить | `UPDATE__MODE` |
| 3 | Delete | Удалить | `DELETE__MODE` |

### Поведение поля «Value»

- В режиме **Delete** поле `valueLineEdit` отключается (`setEnabled(false)`).
- В остальных режимах (Create, Replace, Update) поле активно.

### Поведение группы «PATH / Partial»

Чекбокс `pathCheckBox` доступен только при выборе **System Variable**:

| Состояние | `nameLineEdit` | `partialCheckBox` |
|-----------|---------------|-------------------|
| `pathCheckBox` = OFF | Редактируемое, пустое | Отключён |
| `pathCheckBox` = ON | Заблокировано, значение = «PATH» | Включён и отмечен |

При переключении обратно на **User Variable** оба чекбокса (`pathCheckBox`, `partialCheckBox`) сбрасываются и отключаются.

### Динамические подсказки в блоке «Details»

Текст `detailsLabel` зависит от выбранного действия и комбинации `pathCheckBox` + `partialCheckBox`:

#### Действие: Create

| PATH | Partial | Описание |
|------|---------|---------|
| OFF | — | Переменная будет добавлена в указанное окружение. Если уже существует — значение не изменится. |
| ON | OFF | Переменная PATH будет создана целиком, если не существует. Обычно PATH уже присутствует. |
| ON | ON | Переменная будет добавлена в окружение. Если уже существует — значение не изменится. |

#### Действие: Update

| PATH | Partial | Описание |
|------|---------|---------|
| OFF | — | Переменная будет заменена. Если не существует — будет создана. |
| ON | OFF | Будет заменён ПОЛНЫЙ PATH. Все ранее установленные значения пути будут удалены. |
| ON | ON | Будет заменена только указанная часть PATH (без изменения регистра). Несколько сегментов не поддерживаются. |

#### Действие: Replace

| PATH | Partial | Описание |
|------|---------|---------|
| OFF | — | Переменная будет заменена. Если не существует — будет создана. |
| ON | OFF | Будет заменён ПОЛНЫЙ PATH. Все ранее установленные значения пути будут удалены. |
| ON | ON | Будет заменена только указанная часть PATH. Несколько сегментов не поддерживаются. |

#### Действие: Delete

| PATH | Partial | Описание |
|------|---------|---------|
| OFF | — | Переменная будет удалена. Если не существует — ошибка не возвращается. |
| ON | OFF | Будет удалён ПОЛНЫЙ PATH. Не рекомендуется для общего использования. |
| ON | ON | Будет удалён указанный сегмент из PATH. Если не существует — ошибка не возвращается. Несколько сегментов не поддерживаются. |

### Валидация формы

Метод `validate()` проверяет:

1. Поле `nameLineEdit` не должно быть пустым — сообщение: `"Please input name value."`.
2. Поле `valueLineEdit` не должно быть пустым в режимах Create/Replace/Update — сообщение: `"A blank value is reserved for delete mode. Use delete mode."`.

---

## Модель данных

### VariablesItem

Класс `VariablesItem` (наследник `ModelView::CompoundItem`) представляет данные одной политики переменной окружения.

#### Свойства

| Свойство | Строка-ключ | Тип данных | Значение по умолчанию | Описание |
|----------|-------------|------------|----------------------|----------|
| `ACTION` | `"action"` | `int` | `0` (Create) | Действие: 0=Create, 1=Replace, 2=Update, 3=Delete |
| `USER` | `"user"` | `bool` | `true` | Переменная пользователя (true) или системная (false) |
| `NAME` | `"name"` | `QString` | `""` | Имя переменной окружения |
| `PARTIAL` | `"partial"` | `bool` | `false` | Частичное изменение PATH |
| `VALUE` | `"value"` | `QString` | `""` | Значение переменной окружения |
| `SYSTEM` | `"system"` | `bool` | `false` | Системная переменная (`= !USER`, вычисляется автоматически) |

#### Привязка к виджетам (QDataWidgetMapper)

| Индекс | Свойство | Виджет |
|--------|----------|--------|
| 0 | `ACTION` | `actionComboBox` (свойство `currentIndex`) |
| 1 | `USER` | `userVariableRadio` |
| 2 | `NAME` | `nameLineEdit` |
| 3 | `PARTIAL` | `partialCheckBox` |
| 4 | `VALUE` | `valueLineEdit` |
| 5 | `SYSTEM` | `systemVariableRadio` |

Настройки маппера:
- **Submit Policy**: `QDataWidgetMapper::ManualSubmit`
- **Orientation**: `Qt::Vertical`
- **Delegate**: `ModelView::ViewModelDelegate`

### VariablesContainerItem

Класс `VariablesContainerItem` является строкой таблицы в списке политик переменных окружения. Содержит отображаемые (видимые) свойства и вложенные объекты `CommonItem` и `VariablesItem`.

#### Свойства контейнера (видимые столбцы таблицы)

| Свойство | Строка-ключ | Тип | Описание |
|----------|-------------|-----|----------|
| `NAME` | `"name"` | `std::string` | Имя переменной (отображаемое) |
| `ORDER` | `"order"` | `int` | Порядковый номер применения |
| `ACTION` | `"action"` | `std::string` | Действие в текстовом виде (Create / Replace / Update / Delete) |
| `VALUE` | `"value"` | `std::string` | Значение переменной (отображаемое) |
| `USER` | `"user"` | `std::string` | «Да» / «Нет» — признак пользовательской переменной |

#### Вложенные объекты (скрытые)

| Ключ | Тип | Описание |
|------|-----|----------|
| `"common"` | `CommonItem` | Общие параметры политики (вкладка «Общие») |
| `"variables"` | `VariablesItem` | Данные переменной окружения |

Изменения в `VariablesItem` автоматически синхронизируются с отображаемыми свойствами контейнера через `setupListeners()`.

---

## Чтение и запись политик

### VariablesPreferenceReader

Класс `VariablesPreferenceReader` (наследник `BasePreferenceReader`) отвечает за загрузку политик переменных окружения из XML-файла.

```cpp
auto reader = std::make_unique<preferences::VariablesPreferenceReader>();
// reader читает файл и возвращает PreferencesModel через createModel(std::istream&)
```

### VariablesPreferenceWriter

Класс `VariablesPreferenceWriter` (наследник `BasePreferenceWriter`) отвечает за сохранение политик в XML-файл.

### VariablesModelBuilder

Класс `VariablesModelBuilder` выполняет конвертацию между XML-схемой (`EnvironmentVariables`) и внутренней моделью данных (`PreferencesModel`):

```cpp
// XML → модель
std::unique_ptr<PreferencesModel> model = builder.schemaToModel(variables);

// модель → XML
std::unique_ptr<EnvironmentVariables> schema = builder.modelToSchema(model);
```

---

## Интернационализация (i18n)

Модуль поддерживает переводы через файлы:
- `i18n/variables_translation_en.ts` — английский
- `i18n/variables_translation_ru.ts` — русский

### Таблица переводов UI-элементов

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Form | Форма |
| Details | Детали |
| Placeholder | Расположение |
| Value: | Значение: |
| Name: | Имя: |
| or | или |
| PATH | PATH |
| Partial | Частичный |
| Action: | Действие: |
| Create | Создать |
| Replace | Заменить |
| Update | Обновить |
| Delete | Удалить |
| Variable Type | Тип переменной |
| User Variable | Переменная пользователя |
| System Variable | Системная переменная |
| General | Общие |

### Таблица переводов свойств модели

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Name | Имя |
| Order | Очерёдность |
| Action | Действие |
| Value | Значение |
| User | Пользователь |
| Yes | Да |
| No | Нет |

---

## Архитектура

### Иерархия классов

```
QWidget
└── BasePreferenceWidget
    └── VariablesWidget

ModelView::CompoundItem
├── VariablesItem
└── VariablesContainerItem
        ├── CommonItem        (вложен, скрыт)
        └── VariablesItem     (вложен, скрыт)

BaseModelBuilder
└── VariablesModelBuilder

BasePreferenceReader
└── VariablesPreferenceReader

BasePreferenceWriter
└── VariablesPreferenceWriter
```

### Взаимодействие компонентов

```
XML-файл политик
      │
      ▼
VariablesPreferenceReader
      │  createModel()
      ▼
PreferencesModel
      │
      ▼
VariablesModelBuilder::schemaToModel()
      │
      ▼
VariablesContainerItem[]    ← таблица политик
      │
      └── VariablesItem     ← данные одной записи
      └── CommonItem        ← общие параметры

      │  редактирование
      ▼
VariablesWidget (форма)
      │  QDataWidgetMapper
      └── actionComboBox, userVariableRadio, systemVariableRadio,
          nameLineEdit, partialCheckBox, valueLineEdit

      │  сохранение
      ▼
VariablesPreferenceWriter → XML-файл политик
```

---

## Примеры использования

### Создание элемента политики переменной окружения

```cpp
// Создание системной переменной MY_VAR = /opt/myapp
auto item = std::make_unique<preferences::VariablesItem>();
item->setProperty(preferences::VariablesItem::ACTION, 0);   // Create
item->setProperty(preferences::VariablesItem::USER, false); // System variable
item->setProperty(preferences::VariablesItem::NAME, QString("MY_VAR"));
item->setProperty(preferences::VariablesItem::VALUE, QString("/opt/myapp"));
item->setProperty(preferences::VariablesItem::PARTIAL, false);
```

### Использование VariablesWidget в диалоге

```cpp
auto widget = new preferences::VariablesWidget(parentWidget);
widget->setItem(containerItem->getVariables());

// После подтверждения пользователем:
if (widget->validate()) {
    widget->submit(); // применяет изменения через mapper
}
```

### Чтение политик из файла

```cpp
auto reader = std::make_unique<preferences::VariablesPreferenceReader>();
std::ifstream inputFile("environment.xml");
auto model = reader->read(inputFile);
```

---

## Примечания

1. Свойство `SYSTEM` в `VariablesItem` не задаётся напрямую — оно вычисляется как `!USER`. При установке `USER = true` значение `SYSTEM` автоматически становится `false`.

2. Чекбокс `pathCheckBox` в форме **не привязан к модели данных** через маппер. Он является вспомогательным элементом UI: при его активации в поле `nameLineEdit` автоматически вставляется строка `"PATH"`, а `partialCheckBox` включается. Итоговые значения сохраняются через `nameLineEdit` (NAME) и `partialCheckBox` (PARTIAL).

3. В режиме **Delete** поле значения (`valueLineEdit`) отключается, однако данные в модели не очищаются — это остаётся на ответственности вызывающего кода при необходимости.

4. Все изменения применяются вручную через `mapper->submit()` при нажатии «OK» в диалоге настроек (`PreferencesDialog`).

5. Таблица политик отображает колонки: **Имя**, **Очерёдность**, **Действие**, **Значение**, **Пользователь** — все данные берутся из `VariablesContainerItem` и обновляются автоматически при изменении `VariablesItem` через слушатели (`setupListeners()`).
