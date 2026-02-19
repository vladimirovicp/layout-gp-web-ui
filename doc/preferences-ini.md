# Документация модуля Preferences — INI-файлы (Ini Files)

## Обзор

Модуль `preferences/ini` реализует поддержку политик управления **INI-файлами** (Ini Files) в рамках подсистемы групповых политик GPUI. Он позволяет создавать, заменять, обновлять и удалять свойства в INI-файлах на управляемых узлах, работая на уровне секций и отдельных параметров.

В дереве политик модуль расположен по пути:

```
[Групповая политика]
└── Компьютер / Пользователь
    └── Настройки (Preferences)
        └── Настройки Windows
            └── INI-файлы (Ini Files)
```

### Технологии

- **Qt Widgets** — построение пользовательского интерфейса
- **ModelView Framework** — работа с моделями данных
- **QDataWidgetMapper** — привязка данных модели к виджетам формы
- **XML-схема** (`IniFiles`) — сериализация/десериализация политик

---

## Структура модуля

```
src/plugins/preferences/ini/
├── iniitem.h / .cpp                 — модель данных одной политики INI-файла
├── inicontaineritem.h / .cpp        — контейнер (строка таблицы политик)
├── iniwidget.h / .cpp               — виджет формы редактирования
├── iniwidgetslots.cpp               — слоты сигналов формы
├── iniwidget.ui                     — описание формы (Qt Designer)
├── inimodelbuilder.h / .cpp         — конвертация XML-схемы ↔ модель
├── inipreferencereader.h / .cpp     — чтение политик из файла
├── inipreferencewriter.h / .cpp     — запись политик в файл
└── i18n/
    ├── ini_translation_en.ts        — переводы (английский)
    └── ini_translation_ru.ts        — переводы (русский)
```

---

## Форма редактирования (IniWidget)

Форма `iniwidget.ui` открывается при создании или редактировании политики INI-файла. Она организована как последовательность полей ввода с каскадной активацией.

### Схема формы

```
┌────────────────────────────────────────────────────────────┐
│  Action: [ Create ▼ ]                                      │
│ ──────────────────────────────────────────────────────────  │
│  File path       [______________________________] [...]    │
│  Section Name    [______________________________]          │
│  Property Name   [______________________________]          │
│  Property Value  [______________________________]          │
└────────────────────────────────────────────────────────────┘
```

### Элементы управления формы

| Виджет | Имя в коде | Тип | Свойство модели (индекс) | Описание |
|--------|-----------|-----|--------------------------|----------|
| Метка | `actionLabel` | `QLabel` | — | «Action:» / «Действие:» |
| Выпадающий список | `actionComboBox` | `QComboBox` | `ACTION` (0) | Действие: Create / Replace / Update / Delete |
| Метка | `pathLabel` | `QLabel` | — | «File path» / «Путь к файлу» |
| Поле ввода | `pathLineEdit` | `ShortcutLineEdit` | `PATH` (1) | Путь к INI-файлу |
| Кнопка | `pathToolButton` | `QToolButton` | — | Открыть диалог выбора INI-файла («...») |
| Метка | `sectionLabel` | `QLabel` | — | «Section Name» / «Имя секции» |
| Поле ввода | `sectionLineEdit` | `ShortcutLineEdit` | `SECTION` (2) | Имя секции в INI-файле |
| Метка | `propertyLabel` | `QLabel` | — | «Property Name» / «Имя свойства» |
| Поле ввода | `propertyLineEdit` | `ShortcutLineEdit` | `PROPERTY` (4) | Имя свойства (ключа) внутри секции |
| Метка | `valueLabel` | `QLabel` | — | «Property Value» / «Значение свойства» |
| Поле ввода | `valueLineEdit` | `ShortcutLineEdit` | `VALUE` (3) | Значение свойства |

> Поля `sectionLineEdit`, `propertyLineEdit` и `valueLineEdit` по умолчанию **отключены** (`enabled = false`). Они активируются каскадно при заполнении предыдущего поля.

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

#### Поле «Property Value» (`valueLineEdit`)

| Action | Состояние |
|--------|-----------|
| Create | Активен (если `propertyLineEdit` не пустое) |
| Replace | Активен (если `propertyLineEdit` не пустое) |
| Update | Активен (если `propertyLineEdit` не пустое) |
| **Delete** | **Отключён** (очищается) |

**Пояснение:** В режиме Delete значение свойства не требуется — удаляется сам ключ или секция.

---

### Каскадная активация полей

Форма реализует каскадную логику активации полей: каждое последующее поле активируется только если предыдущее заполнено. При очистке поля все нижестоящие поля автоматически отключаются.

```
pathLineEdit → sectionLineEdit → propertyLineEdit → valueLineEdit
```

| Событие | Действие |
|---------|----------|
| `pathLineEdit` стал пустым | `sectionLineEdit` **отключается**, `propertyLineEdit` **отключается**, `valueLineEdit` **отключается** |
| `pathLineEdit` заполнен | `sectionLineEdit` **активируется** |
| `sectionLineEdit` стал пустым | `propertyLineEdit` **отключается**, `valueLineEdit` **отключается** |
| `sectionLineEdit` заполнен | `propertyLineEdit` **активируется** |
| `propertyLineEdit` стал пустым | `valueLineEdit` **отключается** |
| `propertyLineEdit` заполнен | `valueLineEdit` **активируется** (кроме режима Delete) |

---

### Кнопка выбора файла («...»)

При нажатии на `pathToolButton` открывается системный диалог выбора файла (`FileDialogUtils::getOpenFileName`) с фильтром `"Ini files (*.ini)"`. Выбранный путь автоматически вставляется в поле `pathLineEdit`.

---

### Валидация формы

Метод `validate()` проверяет поля с учётом режима Action:

| Поле | Условие | Проверяется при Action | Сообщение (EN) | Сообщение (RU) |
|------|---------|----------------------|----------------|----------------|
| `pathLineEdit` | Не должно быть пустым | Все режимы | `"Please input path value"` | `"Введите путь"` |
| `sectionLineEdit` | Не должно быть пустым | Create, Replace, Update | `"Please input section value"` | `"Введите секцию"` |
| `propertyLineEdit` | Не должно быть пустым | Create, Replace, Update | `"Please input name of the property"` | `"Введите имя свойства"` |

> В режиме **Delete** поля `sectionLineEdit` и `propertyLineEdit` **не валидируются** — допускается удаление целого INI-файла без указания секции и свойства.

---

## Модель данных

### IniItem

Класс `IniItem` (наследник `ModelView::CompoundItem`) представляет данные одной политики INI-файла.

#### Свойства

| Свойство | Строка-ключ | Тип данных | Значение по умолчанию | Описание |
|----------|-------------|------------|----------------------|----------|
| `ACTION` | `"action"` | `int` | `0` (Create) | Действие: 0=Create, 1=Replace, 2=Update, 3=Delete |
| `PATH` | `"path"` | `QString` | `""` | Путь к INI-файлу |
| `SECTION` | `"section"` | `QString` | `""` | Имя секции в INI-файле |
| `VALUE` | `"value"` | `QString` | `""` | Значение свойства |
| `PROPERTY` | `"property"` | `QString` | `""` | Имя свойства (ключа) внутри секции |

#### Привязка к виджетам (QDataWidgetMapper)

| Индекс | Свойство модели | Виджет |
|--------|-----------------|--------|
| 0 | `ACTION` | `actionComboBox` (свойство `currentIndex`) |
| 1 | `PATH` | `pathLineEdit` |
| 2 | `SECTION` | `sectionLineEdit` |
| 3 | `VALUE` | `valueLineEdit` |
| 4 | `PROPERTY` | `propertyLineEdit` |

Настройки маппера:
- **Submit Policy**: `QDataWidgetMapper::ManualSubmit`
- **Orientation**: `Qt::Vertical`
- **Delegate**: `ModelView::ViewModelDelegate`

---

### IniContainerItem

Класс `IniContainerItem` является строкой таблицы в списке политик INI-файлов. Содержит отображаемые (видимые) свойства и вложенные объекты `CommonItem` и `IniItem`.

#### Свойства контейнера (видимые столбцы таблицы)

| Свойство | Строка-ключ | Тип | Описание |
|----------|-------------|-----|----------|
| `NAME` | `"name"` | `std::string` | Имя файла (последний сегмент пути, автовычисляется) |
| `ORDER` | `"order"` | `int` | Порядковый номер применения |
| `ACTION` | `"action"` | `std::string` | Действие в текстовом виде (Create / Replace / Update / Delete) |
| `PATH` | `"path"` | `std::string` | Путь к INI-файлу |
| `SECTION` | `"section"` | `std::string` | Имя секции |
| `PROPERTY` | `"property"` | `std::string` | Имя свойства |
| `VALUE` | `"value"` | `std::string` | Значение свойства |

> Поле `NAME` вычисляется автоматически из `PATH` — берётся последний сегмент пути (после последнего `\` или `/`).

#### Вложенные объекты (скрытые)

| Ключ | Тип | Описание |
|------|-----|----------|
| `"common"` | `CommonItem` | Общие параметры политики (вкладка «Общие») |
| `"ini"` | `IniItem` | Данные политики INI-файла |

#### Синхронизация контейнера с моделью (setupListeners)

Изменения в `IniItem` автоматически синхронизируются с отображаемыми свойствами контейнера через `setupListeners()`:

| Свойство IniItem | Свойство контейнера | Логика преобразования |
|------------------|--------------------|-----------------------|
| `ACTION` | `ACTION` | `defaultActionsToString()` — числовое значение → строка |
| `PATH` | `NAME` | Последний сегмент пути (после `\` или `/`) |
| `PATH` | `PATH` | Прямое копирование |
| `SECTION` | `SECTION` | Прямое копирование |
| `PROPERTY` | `PROPERTY` | Прямое копирование |
| `VALUE` | `VALUE` | Прямое копирование |

---

## Чтение и запись политик

### IniPreferenceReader

Класс `IniPreferenceReader` (наследник `BasePreferenceReader`) отвечает за загрузку политик INI-файлов из XML-файла.

```cpp
auto reader = std::make_unique<preferences::IniPreferenceReader>();
std::ifstream inputFile("inifiles.xml");
auto model = reader->read(inputFile);
```

### IniPreferenceWriter

Класс `IniPreferenceWriter` (наследник `BasePreferenceWriter`) отвечает за сохранение политик в XML-файл.

### IniModelBuilder

Класс `IniModelBuilder` выполняет конвертацию между XML-схемой (`IniFiles`) и внутренней моделью данных (`PreferencesModel`):

```cpp
// XML → модель
std::unique_ptr<PreferencesModel> model = builder.schemaToModel(iniFiles);

// модель → XML
std::unique_ptr<IniFiles> schema = builder.modelToSchema(model);
```

При записи модели в XML-схему все свойства (`ACTION`, `PATH`, `SECTION`, `VALUE`, `PROPERTY`) записываются безусловно для всех режимов Action.

---

## Интернационализация (i18n)

Модуль поддерживает переводы через файлы:
- `i18n/ini_translation_en.ts` — английский
- `i18n/ini_translation_ru.ts` — русский

### Таблица переводов UI-элементов

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Form | Форма |
| Action: | Действие: |
| Create | Создать |
| Replace | Заменить |
| Update | Обновить |
| Delete | Удалить |
| File path | Путь к файлу |
| Section Name | Имя секции |
| Property Name | Имя свойства |
| Property Value | Значение свойства |
| General | Основные настройки |
| Ini files (*.ini) | Ini файлы (*.ini) |

### Таблица переводов свойств модели

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Name | Имя |
| Order | Очерёдность |
| Action | Действие |
| Path | Путь |
| Section | Секция |
| Property | Свойство |
| Value | Значение |

### Переводы сообщений валидации

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Please input path value | Введите путь |
| Please input section value | Введите секцию |
| Please input name of the property | Введите имя свойства |

---

## Архитектура

### Иерархия классов

```
QWidget
└── BasePreferenceWidget
    └── IniWidget

ModelView::CompoundItem
├── IniItem
└── IniContainerItem
        ├── CommonItem   (вложен, скрыт)
        └── IniItem      (вложен, скрыт)

BaseModelBuilder
└── IniModelBuilder

BasePreferenceReader
└── IniPreferenceReader

BasePreferenceWriter
└── IniPreferenceWriter
```

### Взаимодействие компонентов

```
XML-файл политик
      │
      ▼
IniPreferenceReader
      │  createModel()
      ▼
PreferencesModel
      │
      ▼
IniModelBuilder::schemaToModel()
      │
      ▼
IniContainerItem[]    ← таблица политик
      │
      ├── IniItem       ← данные одной записи
      └── CommonItem    ← общие параметры

      │  редактирование
      ▼
IniWidget (форма)
      │  QDataWidgetMapper
      └── actionComboBox, pathLineEdit,
          sectionLineEdit, propertyLineEdit,
          valueLineEdit

      │  каскадная активация полей
      └── path → section → property → value

      │  сохранение
      ▼
IniPreferenceWriter → XML-файл политик
```

---

## Примеры использования

### Создание политики записи значения в INI-файл

```cpp
auto item = std::make_unique<preferences::IniItem>();
item->setProperty(preferences::IniItem::ACTION, 0);         // Create
item->setProperty(preferences::IniItem::PATH,
                  std::string("C:\\App\\settings.ini"));
item->setProperty(preferences::IniItem::SECTION,
                  std::string("General"));
item->setProperty(preferences::IniItem::PROPERTY,
                  std::string("Language"));
item->setProperty(preferences::IniItem::VALUE,
                  std::string("ru_RU"));
```

### Политика удаления свойства из INI-файла

```cpp
auto item = std::make_unique<preferences::IniItem>();
item->setProperty(preferences::IniItem::ACTION, 3);         // Delete
item->setProperty(preferences::IniItem::PATH,
                  std::string("C:\\App\\settings.ini"));
item->setProperty(preferences::IniItem::SECTION,
                  std::string("Cache"));
item->setProperty(preferences::IniItem::PROPERTY,
                  std::string("MaxSize"));
```

### Использование IniWidget в диалоге

```cpp
auto widget = new preferences::IniWidget(parentWidget);
widget->setItem(containerItem->getIni());

// После подтверждения:
if (widget->validate()) {
    widget->submit(); // применяет изменения через mapper
}
```

---

## Примечания

1. Форма реализует **каскадную активацию**: поля включаются последовательно — `sectionLineEdit` активируется только при заполненном `pathLineEdit`, `propertyLineEdit` — при заполненном `sectionLineEdit`, `valueLineEdit` — при заполненном `propertyLineEdit`. При очистке любого поля все нижестоящие отключаются.

2. Поля `sectionLineEdit`, `propertyLineEdit` и `valueLineEdit` по умолчанию **отключены** в UI-файле (`enabled = false`).

3. В режиме **Delete** поле `valueLineEdit` отключается и очищается, так как для удаления свойства его значение не требуется.

4. Валидация полей `sectionLineEdit` и `propertyLineEdit` **пропускается** в режиме Delete — допускается указание только пути к файлу.

5. Диалог выбора файла (`pathToolButton`) использует фильтр `"Ini files (*.ini)"`, ограничивая выбор файлами с расширением `.ini`.

6. Поле `NAME` в `IniContainerItem` вычисляется автоматически на основе `PATH`: берётся последний сегмент пути через разделители `\` и `/`. Явная установка `NAME` не предусмотрена.

7. В отличие от других модулей preferences, при записи в XML-схему все свойства `IniItem` записываются безусловно — без фильтрации по режиму Action.

8. Таблица политик отображает столбцы: **Имя**, **Очерёдность**, **Действие**, **Путь**, **Секция**, **Свойство**, **Значение** — все данные берутся из `IniContainerItem` и обновляются автоматически при изменении `IniItem` через слушатели (`setupListeners()`).
