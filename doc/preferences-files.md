# Документация модуля Preferences — Файлы (Files)

## Обзор

Модуль `preferences/files` реализует поддержку политик управления **файлами** (Files) в рамках подсистемы групповых политик GPUI. Он позволяет создавать, заменять, обновлять и удалять файлы на управляемых узлах, а также управлять их атрибутами файловой системы. Поддерживается как работа с отдельными файлами, так и с масками файлов (wildcards).

В дереве политик модуль расположен по пути:

```
[Групповая политика]
└── Компьютер / Пользователь
    └── Настройки (Preferences)
        └── Настройки Windows
            └── Файлы (Files)
```

### Технологии

- **Qt Widgets** — построение пользовательского интерфейса
- **ModelView Framework** — работа с моделями данных
- **QDataWidgetMapper** — привязка данных модели к виджетам формы
- **XML-схема** (`Files`) — сериализация/десериализация политик

---

## Структура модуля

```
src/plugins/preferences/files/
├── filesitem.h / .cpp               — модель данных одной политики файла
├── filescontaineritem.h / .cpp      — контейнер (строка таблицы политик)
├── fileswidget.h / .cpp             — виджет формы редактирования
├── fileswidgetslots.cpp             — слоты сигналов формы
├── fileswidget.ui                   — описание формы (Qt Designer)
├── filesmodelbuilder.h / .cpp       — конвертация XML-схемы ↔ модель
├── filespreferencereader.h / .cpp   — чтение политик из файла
├── filespreferencewriter.h / .cpp   — запись политик в файл
└── i18n/
    ├── files_translation_en.ts      — переводы (английский)
    └── files_translation_ru.ts      — переводы (русский)
```

---

## Форма редактирования (FilesWidget)

Форма `fileswidget.ui` открывается при создании или редактировании политики файла. Она организована в виде вертикального списка элементов управления.

### Схема формы

```
┌────────────────────────────────────────────────────────────┐
│  Action: [ Create ▼ ]                                      │
│ ──────────────────────────────────────────────────────────  │
│  Source file(s):    [______________________________] [...] │
│  Destination file:  [______________________________] [...] │
│                                                            │
│  ☐ Suppress errors on individual file actions              │
│                                                            │
│  ┌──────────────────────────┐                              │
│  │ Attributes               │                              │
│  │  ☐ Read-only             │                              │
│  │  ☐ Hidden                │                              │
│  │  ☐ Archive               │                              │
│  │  ☐ Executable            │                              │
│  └──────────────────────────┘                              │
└────────────────────────────────────────────────────────────┘
```

### Элементы управления формы

| Виджет | Имя в коде | Тип | Свойство модели (индекс) | Описание |
|--------|-----------|-----|--------------------------|----------|
| Метка | `actionLabel` | `QLabel` | — | «Action:» / «Действие:» |
| Выпадающий список | `actionComboBox` | `QComboBox` | `ACTION` (0) | Действие над файлом: Create / Replace / Update / Delete |
| Метка | `sourceLabel` | `QLabel` | — | «Source file(s):» / «Источник файла(ов):» |
| Поле ввода | `sourceLineEdit` | `ShortcutLineEdit` | `FROM_PATH` (1) | Путь к исходному файлу (поддерживает маски `*` и `?`) |
| Кнопка | `sourceToolButton` | `QToolButton` | — | Открыть диалог выбора файла («...») |
| Метка | `destinationLabel` | `QLabel` | — | Динамический текст (см. ниже) |
| Поле ввода | `destinationLineEdit` | `ShortcutLineEdit` | `TARGET_PATH` (2) | Путь к файлу/папке назначения |
| Кнопка | `destinationToolButton` | `QToolButton` | — | Открыть диалог выбора файла или папки («...») |
| Чекбокс | `supressErrorsCheckBox` | `QCheckBox` | `SUPPRESS` (3) | Подавлять ошибки при действиях с отдельными файлами |
| Группа | `groupBox` | `QGroupBox` | — | «Attributes» / «Атрибуты» |
| Чекбокс | `readOnly` | `QCheckBox` | `READONLY` (4) | Только для чтения |
| Чекбокс | `archive` | `QCheckBox` | `ARCHIVE` (5) | Архивный |
| Чекбокс | `hidden` | `QCheckBox` | `HIDDEN` (6) | Скрытый |
| Чекбокс | `executable` | `QCheckBox` | `EXECUTABLE` (7) | Исполняемый |

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

#### Чекбокс «Suppress errors» (`supressErrorsCheckBox`)

| Action | Состояние |
|--------|-----------|
| **Create** | **Отключён** |
| Replace | Активен |
| Update | Активен |
| Delete | Активен |

#### Блок «Attributes» (`groupBox`: `readOnly`, `hidden`, `archive`, `executable`)

| Action | Состояние |
|--------|-----------|
| Create | Активен |
| Replace | Активен |
| Update | Активен |
| **Delete** | **Отключён** |

#### Блок «Source» (`sourceLineEdit`, `sourceToolButton`)

| Action | Состояние |
|--------|-----------|
| Create | Активен |
| Replace | Активен |
| Update | Активен |
| **Delete** | **Отключён** (поле очищается) |

#### Динамический текст метки `destinationLabel`

| Условие | Текст (EN) | Текст (RU) |
|---------|-----------|------------|
| Action = Delete | «Delete file(s):» | «Удалить файл(ы):» |
| Source содержит `*` или `?` | «Destination folder:» | «Папка назначения:» |
| Иначе (обычный файл) | «Destination file:» | «Место назначения файлов:» |

---

### Режим файла / папки (fileMode)

Виджет автоматически определяет режим работы на основе содержимого поля `sourceLineEdit`:

| Содержимое Source | `fileMode` | Диалог `destinationToolButton` | Текст `destinationLabel` |
|-------------------|-----------|-------------------------------|--------------------------|
| Содержит `*` или `?` (маска) | `false` | Выбор **папки** (`getOpenDirectoryName`) | «Destination folder:» |
| Обычный путь (без масок) | `true` | Выбор **файла** (`getOpenFileName`) | «Destination file:» |

При нажатии на `sourceToolButton` всегда открывается диалог выбора файла (`getOpenFileName`).

---

### Валидация формы

Метод `validate()` проверяет два поля:

| Поле | Условие | Сообщение (EN) | Сообщение (RU) |
|------|---------|----------------|----------------|
| `sourceLineEdit` | Не должно быть пустым | `"Please enter source file(s) value."` | `"Пожалуйста, введите источник файла(ов)."` |
| `destinationLineEdit` | Не должно быть пустым | `"Please enter destination file(s) value."` | `"Пожалуйста, введите место назначения файла(ов)."` |

---

## Модель данных

### FilesItem

Класс `FilesItem` (наследник `ModelView::CompoundItem`) представляет данные одной политики файла.

#### Свойства

| Свойство | Строка-ключ | Тип данных | Значение по умолчанию | Описание |
|----------|-------------|------------|----------------------|----------|
| `ACTION` | `"action"` | `int` | `0` (Create) | Действие: 0=Create, 1=Replace, 2=Update, 3=Delete |
| `FROM_PATH` | `"fromPath"` | `QString` | `""` | Путь к исходному файлу (source) |
| `TARGET_PATH` | `"targetPath"` | `QString` | `""` | Путь к файлу/папке назначения (destination) |
| `SUPPRESS` | `"suppress"` | `bool` | `false` | Подавлять ошибки при действиях с файлами |
| `READONLY` | `"readonly"` | `bool` | `false` | Атрибут «Только для чтения» |
| `ARCHIVE` | `"archive"` | `bool` | `false` | Атрибут «Архивный» |
| `HIDDEN` | `"hidden"` | `bool` | `false` | Атрибут «Скрытый» |
| `EXECUTABLE` | `"executable"` | `bool` | `false` | Атрибут «Исполняемый» |

#### Привязка к виджетам (QDataWidgetMapper)

| Индекс | Свойство модели | Виджет |
|--------|-----------------|--------|
| 0 | `ACTION` | `actionComboBox` (свойство `currentIndex`) |
| 1 | `FROM_PATH` | `sourceLineEdit` |
| 2 | `TARGET_PATH` | `destinationLineEdit` |
| 3 | `SUPPRESS` | `supressErrorsCheckBox` |
| 4 | `READONLY` | `readOnly` |
| 5 | `ARCHIVE` | `archive` |
| 6 | `HIDDEN` | `hidden` |
| 7 | `EXECUTABLE` | `executable` |

Настройки маппера:
- **Submit Policy**: `QDataWidgetMapper::ManualSubmit`
- **Orientation**: `Qt::Vertical`
- **Delegate**: `ModelView::ViewModelDelegate`

---

### FilesContainerItem

Класс `FilesContainerItem` является строкой таблицы в списке политик файлов. Содержит отображаемые (видимые) свойства и вложенные объекты `CommonItem` и `FilesItem`.

#### Свойства контейнера (видимые столбцы таблицы)

| Свойство | Строка-ключ | Тип | Описание |
|----------|-------------|-----|----------|
| `NAME` | `"name"` | `std::string` | Имя файла (последний сегмент пути назначения, автовычисляется) |
| `ORDER` | `"order"` | `int` | Порядковый номер применения |
| `ACTION` | `"action"` | `std::string` | Действие в текстовом виде (Create / Replace / Update / Delete) |
| `FROM_PATH` | `"fromPath"` | `std::string` | Путь к исходному файлу (Source) |
| `TARGET_PATH` | `"targetPath"` | `std::string` | Путь назначения (Target) |

> Поле `NAME` вычисляется автоматически из `TARGET_PATH` — берётся последний сегмент пути (после последнего `\` или `/`).

#### Вложенные объекты (скрытые)

| Ключ | Тип | Описание |
|------|-----|----------|
| `"common"` | `CommonItem` | Общие параметры политики (вкладка «Общие») |
| `"files"` | `FilesItem` | Данные политики файла |

#### Синхронизация контейнера с моделью (setupListeners)

Изменения в `FilesItem` автоматически синхронизируются с отображаемыми свойствами контейнера через `setupListeners()`:

| Свойство FilesItem | Свойство контейнера | Логика преобразования |
|--------------------|--------------------|-----------------------|
| `ACTION` | `ACTION` | `defaultActionsToString()` — числовое значение → строка |
| `FROM_PATH` | `FROM_PATH` | Прямое копирование |
| `TARGET_PATH` | `NAME` | Последний сегмент пути (после `\` или `/`) |
| `TARGET_PATH` | `TARGET_PATH` | Прямое копирование |

---

## Чтение и запись политик

### FilesPreferenceReader

Класс `FilesPreferenceReader` (наследник `BasePreferenceReader`) отвечает за загрузку политик файлов из XML-файла.

```cpp
auto reader = std::make_unique<preferences::FilesPreferenceReader>();
std::ifstream inputFile("files.xml");
auto model = reader->read(inputFile);
```

### FilesPreferenceWriter

Класс `FilesPreferenceWriter` (наследник `BasePreferenceWriter`) отвечает за сохранение политик в XML-файл.

### FilesModelBuilder

Класс `FilesModelBuilder` выполняет конвертацию между XML-схемой (`Files`) и внутренней моделью данных (`PreferencesModel`):

```cpp
// XML → модель
std::unique_ptr<PreferencesModel> model = builder.schemaToModel(files);

// модель → XML
std::unique_ptr<Files> schema = builder.modelToSchema(model);
```

#### Условная сериализация при записи (modelToSchema)

При записи модели в XML-схему применяются условия:

| Свойство | Условие записи |
|----------|---------------|
| `FROM_PATH`, `READONLY`, `ARCHIVE`, `HIDDEN`, `EXECUTABLE` | Записываются только если Action **не** Delete |
| `SUPPRESS` | Записывается только если Action **не** Create |

**Пояснение:**
- В режиме **Delete** источник и атрибуты не требуются — удаляется файл по пути назначения.
- В режиме **Create** подавление ошибок не применимо, так как файл создаётся впервые.

---

## Интернационализация (i18n)

Модуль поддерживает переводы через файлы:
- `i18n/files_translation_en.ts` — английский
- `i18n/files_translation_ru.ts` — русский

### Таблица переводов UI-элементов

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Form | Форма |
| Action: | Действие: |
| Create | Создать |
| Replace | Заменить |
| Update | Обновить |
| Delete | Удалить |
| Source file(s): | Источник файла(ов): |
| Destination: | Назначение: |
| Destination file: | Место назначения файлов: |
| Destination folder: | Папка назначения: |
| Delete file(s): | Удалить файл(ы): |
| Supress errors on individual file actions | Подавление ошибок при действиях с отдельными файлами |
| Attributes | Атрибуты |
| Read-only | Только для чтения |
| Hidden | Скрытый |
| Archive | Архивный |
| Executable | Исполняемый |
| General | Основные настройки |

### Таблица переводов свойств модели

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Name | Название |
| Order | Порядок |
| Action | Действие |
| Source | Источник |
| Target | Цель |
| All files (*) | Все файлы (*) |
| All files (*.*) | Все файлы (*.*) |

### Переводы сообщений валидации

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Please enter source file(s) value. | Пожалуйста, введите источник файла(ов). |
| Please enter destination file(s) value. | Пожалуйста, введите место назначения файла(ов). |

---

## Архитектура

### Иерархия классов

```
QWidget
└── BasePreferenceWidget
    └── FilesWidget

ModelView::CompoundItem
├── FilesItem
└── FilesContainerItem
        ├── CommonItem    (вложен, скрыт)
        └── FilesItem     (вложен, скрыт)

BaseModelBuilder
└── FilesModelBuilder

BasePreferenceReader
└── FilesPreferenceReader

BasePreferenceWriter
└── FilesPreferenceWriter
```

### Взаимодействие компонентов

```
XML-файл политик
      │
      ▼
FilesPreferenceReader
      │  createModel()
      ▼
PreferencesModel
      │
      ▼
FilesModelBuilder::schemaToModel()
      │
      ▼
FilesContainerItem[]    ← таблица политик
      │
      ├── FilesItem      ← данные одной записи
      └── CommonItem     ← общие параметры

      │  редактирование
      ▼
FilesWidget (форма)
      │  QDataWidgetMapper
      └── actionComboBox, sourceLineEdit, destinationLineEdit,
          supressErrorsCheckBox, readOnly, archive, hidden, executable

      │  сохранение
      ▼
FilesPreferenceWriter → XML-файл политик
```

---

## Примеры использования

### Создание политики копирования файла

```cpp
auto item = std::make_unique<preferences::FilesItem>();
item->setProperty(preferences::FilesItem::ACTION, 0);         // Create
item->setProperty(preferences::FilesItem::FROM_PATH,
                  std::string("\\\\server\\share\\config.ini"));
item->setProperty(preferences::FilesItem::TARGET_PATH,
                  std::string("C:\\Program Files\\App\\config.ini"));
item->setProperty(preferences::FilesItem::SUPPRESS, false);
item->setProperty(preferences::FilesItem::READONLY, true);
item->setProperty(preferences::FilesItem::ARCHIVE, false);
item->setProperty(preferences::FilesItem::HIDDEN, false);
item->setProperty(preferences::FilesItem::EXECUTABLE, false);
```

### Политика удаления файлов по маске

```cpp
auto item = std::make_unique<preferences::FilesItem>();
item->setProperty(preferences::FilesItem::ACTION, 3);         // Delete
item->setProperty(preferences::FilesItem::TARGET_PATH,
                  std::string("C:\\Temp\\*.tmp"));
item->setProperty(preferences::FilesItem::SUPPRESS, true);
```

### Использование FilesWidget в диалоге

```cpp
auto widget = new preferences::FilesWidget(parentWidget);
widget->setItem(containerItem->getFiles());

// После подтверждения:
if (widget->validate()) {
    widget->submit(); // применяет изменения через mapper
}
```

---

## Примечания

1. Поле `NAME` в `FilesContainerItem` вычисляется автоматически на основе `TARGET_PATH`: берётся последний сегмент пути через разделители `\` и `/`. Явная установка `NAME` не предусмотрена.

2. Виджет автоматически переключается между режимом файла и режимом папки в зависимости от содержимого поля `sourceLineEdit`. Если путь содержит символы подстановки (`*` или `?`), поле назначения переключается на выбор папки, иначе — на выбор файла.

3. В режиме **Delete** поле `sourceLineEdit` очищается и отключается, так как при удалении указывается только путь к удаляемому файлу(ам) в поле назначения. Метка `destinationLabel` при этом меняется на «Delete file(s):».

4. Чекбокс `supressErrorsCheckBox` отключён в режиме **Create**, так как подавление ошибок актуально только при операциях с существующими файлами (Replace, Update, Delete).

5. Группа атрибутов (`groupBox`) отключена в режиме **Delete**, поскольку атрибуты файловой системы не применимы к операции удаления.

6. При записи в XML-схему атрибуты и путь источника сохраняются только для режимов, отличных от Delete, а флаг подавления ошибок — только для режимов, отличных от Create.

7. Таблица политик отображает столбцы: **Название**, **Порядок**, **Действие**, **Источник**, **Цель** — все данные берутся из `FilesContainerItem` и обновляются автоматически при изменении `FilesItem` через слушатели (`setupListeners()`).
