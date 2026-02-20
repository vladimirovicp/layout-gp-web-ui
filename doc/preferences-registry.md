# Документация модуля Preferences — Реестр (Registry)

## Обзор

Модуль `preferences/registry` реализует поддержку политик управления **значениями реестра Windows** в рамках подсистемы групповых политик GPUI. Он позволяет создавать, заменять, обновлять и удалять значения в реестре Windows по указанному пути (Hive + Key).

В дереве политик модуль расположен по пути:

```
[Групповая политика]
└── Компьютер / Пользователь
    └── Настройки (Preferences)
        └── Настройки Системы (System Settings)
            └── Реестр (Registry)
```

### Технологии

- **Qt Widgets** — построение пользовательского интерфейса
- **ModelView Framework** — работа с моделями данных
- **QDataWidgetMapper** — привязка данных модели к виджетам формы
- **XML-схема** (`Registry`) — сериализация/десериализация политик

---

## Структура модуля

```
src/plugins/preferences/registry/
├── registryitem.h / .cpp               — модель данных одной записи реестра
├── registrycontaineritem.h / .cpp      — контейнер (строка таблицы политик)
├── registrywidget.h / .cpp             — виджет формы редактирования
├── registrywidgetslots.cpp             — слоты сигналов формы
├── registrywidget.ui                   — описание формы (Qt Designer)
├── registrymodelbuilder.h / .cpp       — конвертация XML-схемы ↔ модель
├── registrypreferencereader.h / .cpp   — чтение политик из файла
├── registrypreferencewriter.h / .cpp   — запись политик в файл
└── i18n/
    ├── registry_translation_en.ts      — переводы (английский)
    └── registry_translation_ru.ts      — переводы (русский)
```

---

## Форма редактирования (RegistryWidget)

Форма `registrywidget.ui` открывается при создании или редактировании политики значения реестра. Она организована вертикально.

### Схема формы

```
┌─────────────────────────────────────────────────────────┐
│  Action: [ Create ▼ ]                                   │
│ ─────────────────────────────────────────────────────── │
│  Hive:      [ HKEY_CURRENT_USER ▼ ]                     │
│  Key Path:  [_______________________________________]   │
│                                                         │
│  ┌── Value name ──────────────────────────────────────┐ │
│  │  ☐ Default   [______________________________]      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  Value type: [ REG_SZ ▼ ]                               │
│  Value data: [_______________________________________]  │
└─────────────────────────────────────────────────────────┘
```

### Элементы управления формы

| Виджет | Имя в коде | Тип | Свойство модели | Описание |
|--------|-----------|-----|-----------------|----------|
| Выпадающий список | `actionComboBox` | `QComboBox` | `ACTION` (индекс 0) | Действие над записью реестра |
| Выпадающий список | `hiveComboBox` | `QComboBox` | `HIVE` (индекс 1) | Куст (корневой раздел) реестра |
| Поле ввода | `keyPathLineEdit` | `ShortcutLineEdit` | `KEY` (индекс 2) | Путь к ключу реестра |
| Метка | `hiveLabel` | `QLabel` | — | «Hive:» / «Улей:» |
| Метка | `keyPathLabel` | `QLabel` | — | «Key Path:» / «Путь к ключу:» |
| Группа | `valueNameGroupBox` | `QGroupBox` | — | «Value name» / «Имя значения» |
| Чекбокс | `defaultValueNameCheckBox` | `QCheckBox` | `DEFAULT` (индекс 6) | Использовать имя по умолчанию `(Default)` |
| Поле ввода | `valueNameLineEdit` | `ShortcutLineEdit` | `NAME` (индекс 3) | Имя значения реестра |
| Выпадающий список | `valueTypeComboBox` | `QComboBox` | `TYPE` (индекс 4) | Тип данных значения реестра |
| Поле ввода | `valueDataLineEdit` | `ShortcutLineEdit` | `VALUE` (индекс 5) | Данные значения реестра |
| Метка | `valueTypeLabel` | `QLabel` | — | «Value type:» / «Тип значения:» |
| Метка | `valueDataLabel` | `QLabel` | — | «Value data:» / «Данные значения:» |

---

### Поле «Action» — допустимые значения

| Индекс | Значение (EN) | Значение (RU) | Константа в коде |
|--------|--------------|---------------|-----------------|
| 0 | Create | Создать | `CREATE__MODE` |
| 1 | Replace | Заменить | `REPLACE_MODE` |
| 2 | Update | Обновить | `UPDATE__MODE` |
| 3 | Delete | Удалить | `DELETE__MODE` |

**Поведение при смене Action:**  
В режиме **Delete** весь блок `valueFormLayout` (тип и данные значения) отключается (`setEnabled(false)`). В остальных режимах блок активен.

---

### Поле «Hive» — допустимые значения

Значения не переводятся (помечены `notr="true"` в UI-файле):

| Индекс | Значение | Описание |
|--------|---------|----------|
| 0 | `HKEY_CLASSES_ROOT` | Типы файлов и ассоциации COM-объектов |
| 1 | `HKEY_CURRENT_USER` | Настройки текущего пользователя *(по умолчанию)* |
| 2 | `HKEY_LOCAL_MACHINE` | Настройки всей системы |
| 3 | `HKEY_USERS` | Профили всех пользователей |
| 4 | `HKEY_CURRENT_CONFIG` | Текущая конфигурация оборудования |

---

### Поле «Value type» — допустимые значения

| Индекс | Тип | Описание |
|--------|-----|----------|
| 0 | `REG_SZ` | Строка с завершающим нулём |
| 1 | `REG_EXPAND_SZ` | Строка с переменными окружения (например, `%SystemRoot%`) |
| 2 | `REG_BINARY` | Произвольные двоичные данные |
| 3 | `REG_DWORD` | 32-битное целое число |
| 4 | `REG_MULTI_SZ` | Массив строк, разделённых нулевым байтом |
| 5 | `REG_QWORD` | 64-битное целое число |

---

### Поведение чекбокса «Default»

Чекбокс `defaultValueNameCheckBox` управляет именем значения реестра по умолчанию:

| Состояние | `valueNameLineEdit` |
|-----------|---------------------|
| Чекбокс = OFF | Редактируемое, пустое |
| Чекбокс = ON | Заблокировано, значение = `"(Default)"` |

При загрузке формы (`setInitialState`) если поле `valueNameLineEdit` уже содержит строку `"(Default)"`, чекбокс автоматически устанавливается в отмеченное состояние.

---

### Валидация формы

Метод `validate()` проверяет три поля по порядку:

| № | Поле | Условие | Сообщение об ошибке (EN) | Сообщение об ошибке (RU) |
|---|------|---------|--------------------------|--------------------------|
| 1 | `keyPathLineEdit` | Не должно быть пустым | `"Please input key path value."` | `"Введите значение для «путь к ключу»."` |
| 2 | `valueNameLineEdit` | Не должно быть пустым | `"Please input name value."` | `"Введите имя."` |
| 3 | `valueDataLineEdit` | Не должно быть пустым | `"Please input data value."` | `"Введите данные."` |

> Валидация не выполняется в режиме **Delete** — поля типа и данных отключены.

---

## Модель данных

### RegistryItem

Класс `RegistryItem` (наследник `ModelView::CompoundItem`) представляет данные одной политики значения реестра.

#### Свойства

| Свойство | Строка-ключ | Тип данных | Значение по умолчанию | Описание |
|----------|-------------|------------|----------------------|----------|
| `ACTION` | `"action"` | `int` | `0` (Create) | Действие: 0=Create, 1=Replace, 2=Update, 3=Delete |
| `HIVE` | `"hive"` | `std::string` | `""` | Куст реестра (строка, например `"HKEY_LOCAL_MACHINE"`) |
| `KEY` | `"key"` | `std::string` | `""` | Путь к ключу реестра |
| `NAME` | `"name"` | `std::string` | `""` | Имя значения реестра |
| `TYPE` | `"type"` | `std::string` | `""` | Тип данных (например `"REG_SZ"`) |
| `VALUE` | `"value"` | `std::string` | `""` | Данные значения реестра |
| `DEFAULT` | `"default"` | `bool` | `false` | Использовать имя `(Default)` |

#### Привязка к виджетам (QDataWidgetMapper)

| Индекс | Свойство модели | Виджет |
|--------|-----------------|--------|
| 0 | `ACTION` | `actionComboBox` (свойство `currentIndex`) |
| 1 | `HIVE` | `hiveComboBox` |
| 2 | `KEY` | `keyPathLineEdit` |
| 3 | `NAME` | `valueNameLineEdit` |
| 4 | `TYPE` | `valueTypeComboBox` |
| 5 | `VALUE` | `valueDataLineEdit` |
| 6 | `DEFAULT` | `defaultValueNameCheckBox` |

Настройки маппера:
- **Submit Policy**: `QDataWidgetMapper::ManualSubmit`
- **Orientation**: `Qt::Vertical`
- **Delegate**: `ModelView::ViewModelDelegate`

---

### RegistryContainerItem

Класс `RegistryContainerItem` является строкой таблицы в списке политик реестра. Содержит отображаемые свойства и вложенные объекты `CommonItem` и `RegistryItem`.

#### Свойства контейнера (видимые столбцы таблицы)

| Свойство | Строка-ключ | Тип | Описание |
|----------|-------------|-----|----------|
| `NAME` | `"name"` | `std::string` | Имя значения реестра (отображаемое) |
| `ORDER` | `"order"` | `int` | Порядковый номер применения |
| `ACTION` | `"action"` | `std::string` | Действие в текстовом виде |
| `HIVE` | `"hive"` | `std::string` | Куст реестра (отображаемый) |
| `KEY` | `"key"` | `std::string` | Путь к ключу реестра (отображаемый) |

#### Вложенные объекты (скрытые)

| Ключ | Тип | Описание |
|------|-----|----------|
| `"common"` | `CommonItem` | Общие параметры политики (вкладка «Общие») |
| `"registry"` | `RegistryItem` | Данные записи реестра |

Изменения в `RegistryItem` по свойствам `ACTION`, `NAME`, `HIVE`, `KEY` автоматически синхронизируются с отображаемыми свойствами контейнера через `setupListeners()`.

---

## Чтение и запись политик

### RegistryPreferenceReader

Класс `RegistryPreferenceReader` (наследник `BasePreferenceReader`) отвечает за загрузку политик реестра из XML-файла.

### RegistryPreferenceWriter

Класс `RegistryPreferenceWriter` (наследник `BasePreferenceWriter`) отвечает за сохранение политик в XML-файл.

### RegistryModelBuilder

Класс `RegistryModelBuilder` выполняет конвертацию между XML-схемой (`Registry`) и внутренней моделью данных (`PreferencesModel`):

```cpp
// XML → модель
std::unique_ptr<PreferencesModel> model = builder.schemaToModel(registrySource);

// модель → XML
std::unique_ptr<Registry> schema = builder.modelToSchema(model);
```

---

## Интернационализация (i18n)

Модуль поддерживает переводы через файлы:
- `i18n/registry_translation_en.ts` — английский
- `i18n/registry_translation_ru.ts` — русский

### Таблица переводов UI-элементов

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Form | Форма |
| Action: | Действие: |
| Create | Создать |
| Replace | Заменить |
| Update | Обновить |
| Delete | Удалить |
| Hive: | Улей: |
| Key Path: | Путь к ключу: |
| Value name | Имя значения |
| Default | По умолчанию |
| Value type: | Тип значения: |
| Value data: | Данные значения: |
| General | Основные настройки |

### Таблица переводов свойств модели

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Name | Имя |
| Order | Очерёдность |
| Action | Действие |
| Hive | Hive |
| Key | Ключ |

### Переводы сообщений валидации

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Please input key path value. | Введите значение для «путь к ключу». |
| Please input name value. | Введите имя. |
| Please input data value. | Введите данные. |

---

## Архитектура

### Иерархия классов

```
QWidget
└── BasePreferenceWidget
    └── RegistryWidget

ModelView::CompoundItem
├── RegistryItem
└── RegistryContainerItem
        ├── CommonItem       (вложен, скрыт)
        └── RegistryItem     (вложен, скрыт)

BaseModelBuilder
└── RegistryModelBuilder

BasePreferenceReader
└── RegistryPreferenceReader

BasePreferenceWriter
└── RegistryPreferenceWriter
```

### Взаимодействие компонентов

```
XML-файл политик
      │
      ▼
RegistryPreferenceReader
      │  createModel()
      ▼
PreferencesModel
      │
      ▼
RegistryModelBuilder::schemaToModel()
      │
      ▼
RegistryContainerItem[]    ← таблица политик
      │
      ├── RegistryItem      ← данные одной записи реестра
      └── CommonItem        ← общие параметры

      │  редактирование
      ▼
RegistryWidget (форма)
      │  QDataWidgetMapper
      └── actionComboBox, hiveComboBox, keyPathLineEdit,
          valueNameLineEdit, valueTypeComboBox, valueDataLineEdit,
          defaultValueNameCheckBox

      │  сохранение
      ▼
RegistryPreferenceWriter → XML-файл политик
```

---

## Примеры использования

### Создание элемента политики реестра

```cpp
// Создание значения HKLM\Software\MyApp\Version = "1.0.0" (REG_SZ)
auto item = std::make_unique<preferences::RegistryItem>();
item->setProperty(preferences::RegistryItem::ACTION, 0);              // Create
item->setProperty(preferences::RegistryItem::HIVE,
                  std::string("HKEY_LOCAL_MACHINE"));
item->setProperty(preferences::RegistryItem::KEY,
                  std::string("Software\\MyApp"));
item->setProperty(preferences::RegistryItem::NAME,
                  std::string("Version"));
item->setProperty(preferences::RegistryItem::TYPE,
                  std::string("REG_SZ"));
item->setProperty(preferences::RegistryItem::VALUE,
                  std::string("1.0.0"));
item->setProperty(preferences::RegistryItem::DEFAULT, false);
```

### Использование RegistryWidget в диалоге

```cpp
auto widget = new preferences::RegistryWidget(parentWidget);
widget->setItem(containerItem->getRegistry());

// После подтверждения пользователем:
if (widget->validate()) {
    widget->submit(); // применяет изменения через mapper
}
```

---

## Примечания

1. Значения `HIVE` в модели хранятся как строки (`std::string`), например `"HKEY_LOCAL_MACHINE"`. При отображении в `hiveComboBox` маппер сопоставляет строку с соответствующим пунктом списка.

2. Типы значений (`TYPE`) хранятся в модели тоже как строки (`"REG_SZ"`, `"REG_DWORD"` и т.д.) — не как числовые идентификаторы.

3. Строка `"(Default)"` является зарезервированным именем и устанавливается автоматически при активации чекбокса `defaultValueNameCheckBox`. Эта строка не переводится.

4. В режиме **Delete** весь блок `valueFormLayout` (тип и данные значения) становится недоступным. При этом поля имени и пути к ключу остаются активными — они необходимы для идентификации удаляемой записи.

5. Все изменения применяются вручную через `mapper->submit()` при нажатии «OK» в диалоге настроек (`PreferencesDialog`).

6. Таблица политик отображает столбцы: **Имя**, **Очерёдность**, **Действие**, **Hive**, **Ключ** — все данные берутся из `RegistryContainerItem` и обновляются автоматически при изменении `RegistryItem` через слушатели (`setupListeners()`).
