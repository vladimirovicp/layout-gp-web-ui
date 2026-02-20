# Документация модуля Preferences — Папки (Folders)

## Обзор

Модуль `preferences/folders` реализует политики управления **папками** (Folders) в рамках подсистемы групповых политик GPUI. Он позволяет создавать, обновлять, заменять и удалять папки на управляемых узлах, а также управлять их атрибутами файловой системы.

В дереве политик модуль расположен по пути:

```
[Групповая политика]
└── Компьютер / Пользователь
    └── Настройки (Preferences)
        └── Настройки Системы (System Settings)
            └── Папки (Folders)
```

### Технологии

- **Qt Widgets** — построение пользовательского интерфейса
- **ModelView Framework** — работа с моделями данных
- **QDataWidgetMapper** — привязка данных модели к виджетам формы
- **XML-схема** (`Folders`) — сериализация/десериализация политик

---

## Структура модуля

```
src/plugins/preferences/folders/
├── folderitem.h / .cpp            — модель данных одной политики папки
├── foldercontaineritem.h / .cpp   — контейнер (строка таблицы политик)
├── folderwidget.h / .cpp          — виджет формы редактирования
├── folderviewslots.cpp            — слоты сигналов формы
├── folderswidget.ui               — описание формы (Qt Designer)
├── foldermodelbuilder.h / .cpp    — конвертация XML-схемы ↔ модель
├── folderpreferencereader.h / .cpp — чтение политик из файла
├── folderpreferencewriter.h / .cpp — запись политик в файл
└── i18n/
    ├── folders_translation_en.ts  — переводы (английский)
    └── folders_translation_ru.ts  — переводы (русский)
```

---

## Форма редактирования (FolderWidget / FoldersWidget)

Форма `folderswidget.ui` открывается при создании или редактировании политики папки. Она организована в виде вертикального списка элементов управления.

### Схема формы

```
┌────────────────────────────────────────────────────────────┐
│  Action: [ Create ▼ ]                                      │
│ ──────────────────────────────────────────────────────────  │
│  Path: [______________________________________] [ ... ]    │
│                                                            │
│  ┌──────────────────────────┐                              │
│  │ Attributes               │                              │
│  │  ☐ Read-only             │                              │
│  │  ☐ Hidden                │                              │
│  │  ☐ Archive               │                              │
│  └──────────────────────────┘                              │
│                                                            │
│  ☐ Delete this folder (if emptied)                         │
│  ☐ Recursively delete subfolders (if emptied)              │
│  ☐ Delete all files in the folder(s)                       │
│  ☐ Allow deletion of read-only files/folders               │
│  ☐ Ignore errors for files/folders cannot be deleted       │
└────────────────────────────────────────────────────────────┘
```

### Элементы управления формы

| Виджет | Имя в коде | Тип | Свойство модели (индекс) | Описание |
|--------|-----------|-----|--------------------------|----------|
| Метка | `actionLabel` | `QLabel` | — | «Action:» / «Действие:» |
| Выпадающий список | `actionComboBox` | `QComboBox` | `ACTION` (0) | Действие над папкой: Create / Replace / Update / Delete |
| Метка | `pathLabel` | `QLabel` | — | «Path:» / «Путь:» |
| Поле ввода | `pathLineEdit` | `ShortcutLineEdit` | `PATH` (1) | Полный путь к папке |
| Кнопка | `pathToolButton` | `QToolButton` | — | Открыть диалог выбора папки («...») |
| Группа | `groupBox` | `QGroupBox` | — | «Attributes» / «Атрибуты» |
| Чекбокс | `readOnly` | `QCheckBox` | `READONLY` (2) | Только для чтения |
| Чекбокс | `archive` | `QCheckBox` | `ARCHIVE` (3) | Архивный |
| Чекбокс | `hidden` | `QCheckBox` | `HIDDEN` (4) | Скрытый |
| Чекбокс | `ignoreErrors` | `QCheckBox` | `DELETE_IGNORE_ERRORS` (5) | Игнорировать ошибки для файлов/папок, которые не могут быть удалены |
| Чекбокс | `deleteAllFiles` | `QCheckBox` | `DELETE_FILES` (6) | Удалить все файлы в папке(ах) |
| Чекбокс | `recursiveDelete` | `QCheckBox` | `DELETE_SUB_FOLDERS` (7) | Рекурсивное удаление папок (если пустые) |
| Чекбокс | `deleteThisFolder` | `QCheckBox` | `DELETE_FOLDER` (8) | Удалить папку (если пустая) |
| Чекбокс | `allowDeletionOfReadOnly` | `QCheckBox` | `DELETE_READ_ONLY` (9) | Разрешить удаление файлов/папок только для чтения |

> Все чекбоксы из группы `settingsWidget` (`deleteThisFolder`, `recursiveDelete`, `deleteAllFiles`, `allowDeletionOfReadOnly`, `ignoreErrors`) сгруппированы в виджете `settingsWidget`.

### Поле «Action» — допустимые значения

| Индекс | Значение (EN) | Значение (RU) | Константа в коде |
|--------|--------------|---------------|-----------------|
| 0 | Create | Создать | `CREATE__MODE` |
| 1 | Replace | Заменить | `REPLACE_MODE` |
| 2 | Update | Обновить | `UPDATE__MODE` |
| 3 | Delete | Удалить | `DELETE__MODE` |

### Зависимость доступности элементов от поля «Action»

| Режим | `settingsWidget` (группа удаления) | `groupBox` (Атрибуты) |
|-------|-----------------------------------|-----------------------|
| Create (0) | **Отключён** | Включён |
| Replace (1) | **Включён** | Включён |
| Update (2) | **Отключён** | Включён |
| Delete (3) | **Включён** | **Отключён** |

**Пояснение:**
- В режимах **Create** и **Update** параметры удаления (`settingsWidget`) недоступны, так как папка создаётся или обновляется, а не удаляется.
- В режиме **Delete** группа атрибутов (`groupBox`) недоступна, так как атрибуты не применимы к операции удаления.
- В режимах **Replace** и **Delete** параметры удаления (`settingsWidget`) активны, поскольку перед созданием новой папки (Replace) или при прямом удалении (Delete) может потребоваться очистка содержимого.

### Кнопка выбора пути («...»)

При нажатии на `pathToolButton` открывается системный диалог выбора директории (`FileDialogUtils::getOpenDirectoryName`). Выбранный путь автоматически вставляется в поле `pathLineEdit`.

---

## Модель данных

### FolderItem

Класс `FolderItem` (наследник `ModelView::CompoundItem`) представляет данные одной политики папки.

#### Свойства

| Свойство | Строка-ключ | Тип данных | Значение по умолчанию | Описание |
|----------|-------------|------------|----------------------|----------|
| `ACTION` | `"action"` | `int` | `0` (Create) | Действие: 0=Create, 1=Replace, 2=Update, 3=Delete |
| `PATH` | `"path"` | `QString` | `""` | Полный путь к папке |
| `READONLY` | `"readonly"` | `bool` | `false` | Атрибут «Только для чтения» |
| `ARCHIVE` | `"archive"` | `bool` | `false` | Атрибут «Архивный» |
| `HIDDEN` | `"hidden"` | `bool` | `false` | Атрибут «Скрытый» |
| `DELETE_IGNORE_ERRORS` | `"deleteIgnoreErrors"` | `bool` | `false` | Игнорировать ошибки при удалении |
| `DELETE_FILES` | `"deleteFiles"` | `bool` | `false` | Удалить все файлы в папке(ах) |
| `DELETE_SUB_FOLDERS` | `"deleteSubFolders"` | `bool` | `false` | Рекурсивно удалить подпапки |
| `DELETE_FOLDER` | `"deleteFolder"` | `bool` | `false` | Удалить саму папку (если пустая) |
| `DELETE_READ_ONLY` | `"deleteReadOnly"` | `bool` | `false` | Разрешить удаление файлов/папок только для чтения |

#### Методы доступа к свойствам

```cpp
// Действие
QString action() const;
void setAction(QString action);

// Путь к папке
QString path() const;
void setPath(const QString& path);

// Атрибуты
bool readOnly() const;       void setReadOnly(bool state);
bool archive() const;        void setArchive(bool state);
bool hidden() const;         void setHidden(bool state);

// Параметры удаления
bool deleteIgnoreErrors() const;   void setDeleteIgnoreErrors(bool state);
bool deleteFiles() const;          void setDeleteFiles(bool state);
bool deleteSubFolders() const;     void setDeleteSubFolders(bool state);
bool deleteFolder() const;         void setDeleteFolder(bool state);
```

#### Привязка к виджетам (QDataWidgetMapper)

| Индекс | Свойство | Виджет |
|--------|----------|--------|
| 0 | `ACTION` | `actionComboBox` (свойство `currentIndex`) |
| 1 | `PATH` | `pathLineEdit` |
| 2 | `READONLY` | `readOnly` |
| 3 | `ARCHIVE` | `archive` |
| 4 | `HIDDEN` | `hidden` |
| 5 | `DELETE_IGNORE_ERRORS` | `ignoreErrors` |
| 6 | `DELETE_FILES` | `deleteAllFiles` |
| 7 | `DELETE_SUB_FOLDERS` | `recursiveDelete` |
| 8 | `DELETE_FOLDER` | `deleteThisFolder` |
| 9 | `DELETE_READ_ONLY` | `allowDeletionOfReadOnly` |

Настройки маппера:
- **Submit Policy**: `QDataWidgetMapper::ManualSubmit`
- **Orientation**: `Qt::Vertical`
- **Delegate**: `ModelView::ViewModelDelegate`

### FolderContainerItem

Класс `FolderContainerItem` является строкой таблицы в списке политик папок. Содержит отображаемые (видимые) свойства и вложенные объекты `CommonItem` и `FolderItem`.

#### Свойства контейнера (видимые столбцы таблицы)

| Свойство | Строка-ключ | Тип | Описание |
|----------|-------------|-----|----------|
| `NAME` | `"name"` | `std::string` | Имя папки (последний сегмент пути, автовычисляется) |
| `ORDER` | `"order"` | `int` | Порядковый номер применения |
| `ACTION` | `"action"` | `std::string` | Действие в текстовом виде (Create / Replace / Update / Delete) |
| `PATH` | `"path"` | `std::string` | Полный путь к папке |

> Поле `NAME` вычисляется автоматически из `PATH` — берётся последний сегмент пути (после последнего `\` или `/`).

#### Вложенные объекты (скрытые)

| Ключ | Тип | Описание |
|------|-----|----------|
| `"common"` | `CommonItem` | Общие параметры политики (вкладка «Общие») |
| `"folder"` | `FolderItem` | Данные политики папки |

Изменения в `FolderItem` автоматически синхронизируются с отображаемыми свойствами контейнера через `setupListeners()`.

---

## Чтение и запись политик

### FolderPreferenceReader

Класс `FolderPreferenceReader` (наследник `BasePreferenceReader`) отвечает за загрузку политик папок из XML-файла.

```cpp
auto reader = std::make_unique<preferences::FolderPreferenceReader>();
std::ifstream inputFile("folders.xml");
auto model = reader->read(inputFile);
```

### FolderPreferenceWriter

Класс `FolderPreferenceWriter` (наследник `BasePreferenceWriter`) отвечает за сохранение политик в XML-файл.

### FolderModelBuilder

Класс `FolderModelBuilder` выполняет конвертацию между XML-схемой (`Folders`) и внутренней моделью данных (`PreferencesModel`):

```cpp
// XML → модель
std::unique_ptr<PreferencesModel> model = builder.schemaToModel(folders);

// модель → XML
std::unique_ptr<Folders> schema = builder.modelToSchema(model);
```

---

## Интернационализация (i18n)

Модуль поддерживает переводы через файлы:
- `i18n/folders_translation_en.ts` — английский
- `i18n/folders_translation_ru.ts` — русский

### Таблица переводов UI-элементов

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Form | Форма |
| Action: | Действие: |
| Create | Создать |
| Replace | Заменить |
| Update | Обновить |
| Delete | Удалить |
| Path: | Путь: |
| Attributes | Атрибуты |
| Read-only | Только для чтения |
| Hidden | Скрытый |
| Archive | Архивный |
| Delete this folder (if emptied) | Удалить папку (если пустая) |
| Recrusively delete subfolders (if emptied) | Рекурсивное удаление папок (если пустые) |
| Delete all files in the folder(s) | Удалить все файлы в папке(ах) |
| Allow deletion of read-only files/folders | Разрешить удаление файлов/папок только для чтения |
| Ignore errors for files/folders cannot be deleted | Игнорировать ошибки для файлов/папок, которые не могут быть удалены |
| General | Основные настройки |

### Таблица переводов свойств модели

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Name | Название |
| Order | Порядок |
| Action | Действие |
| Path | Путь |
| All files (*.*) | Все файлы (*.*) |

---

## Архитектура

### Иерархия классов

```
QWidget
└── BasePreferenceWidget
    └── FolderWidget

ModelView::CompoundItem
├── FolderItem
└── FolderContainerItem
        ├── CommonItem   (вложен, скрыт)
        └── FolderItem   (вложен, скрыт)

BaseModelBuilder
└── FolderModelBuilder

BasePreferenceReader
└── FolderPreferenceReader

BasePreferenceWriter
└── FolderPreferenceWriter
```

### Взаимодействие компонентов

```
XML-файл политик
      │
      ▼
FolderPreferenceReader
      │  createModel()
      ▼
PreferencesModel
      │
      ▼
FolderModelBuilder::schemaToModel()
      │
      ▼
FolderContainerItem[]    ← таблица политик
      │
      ├── FolderItem     ← данные одной записи
      └── CommonItem     ← общие параметры

      │  редактирование
      ▼
FolderWidget (форма)
      │  QDataWidgetMapper
      └── actionComboBox, pathLineEdit,
          readOnly, archive, hidden,
          ignoreErrors, deleteAllFiles,
          recursiveDelete, deleteThisFolder,
          allowDeletionOfReadOnly

      │  сохранение
      ▼
FolderPreferenceWriter → XML-файл политик
```

---

## Примеры использования

### Создание элемента политики папки

```cpp
// Создать папку с атрибутом "Hidden"
auto item = std::make_unique<preferences::FolderItem>();
item->setAction("Create");
item->setPath("/home/user/myfolder");
item->setHidden(true);
item->setReadOnly(false);
item->setArchive(false);
```

### Политика удаления папки с очисткой содержимого

```cpp
auto item = std::make_unique<preferences::FolderItem>();
item->setAction("Delete");
item->setPath("/tmp/cache");
item->setDeleteFiles(true);
item->setDeleteSubFolders(true);
item->setDeleteFolder(true);
item->setDeleteIgnoreErrors(true);
```

### Использование FolderWidget в диалоге

```cpp
auto widget = new preferences::FolderWidget(parentWidget);
widget->setItem(containerItem->getFolder());

// После подтверждения:
widget->submit(); // применяет изменения через mapper
```

---

## Примечания

1. Поле `NAME` в `FolderContainerItem` вычисляется автоматически на основе `PATH`: берётся последний сегмент пути через разделители `\` и `/`. Явная установка `NAME` не предусмотрена.

2. Группа атрибутов (`groupBox`) недоступна в режиме **Delete**, поскольку атрибуты файловой системы не имеют смысла для операции удаления.

3. Группа `settingsWidget` (параметры удаления) недоступна в режимах **Create** и **Update**, так как удаление содержимого актуально только при замене (Replace) или явном удалении (Delete).

4. Все изменения применяются вручную через `mapper->submit()` при нажатии «OK» в родительском диалоге настроек.

5. Таблица политик отображает столбцы: **Название**, **Порядок**, **Действие**, **Путь** — все данные берутся из `FolderContainerItem` и обновляются автоматически при изменении `FolderItem` через слушатели (`setupListeners()`).
