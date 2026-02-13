# Документация по Shortcuts (Ярлыки)

## Обзор

Shortcuts (Ярлыки) - это функциональность для создания, редактирования, обновления и удаления ярлыков в системе Windows. Система позволяет управлять ярлыками через графический интерфейс с сохранением данных в XML-формате.

## Архитектура

### Основные компоненты

1. **ShortcutsItem** - модель данных для одного ярлыка
2. **ShortcutsContainerItem** - контейнер для хранения ярлыков в дереве модели
3. **ShortcutsWidget** - виджет пользовательского интерфейса для редактирования
4. **ShortcutsModelBuilder** - преобразователь между XML-схемой и моделью данных
5. **ShortcutsPreferenceReader/Writer** - чтение и запись XML-файлов

## Модель данных (ShortcutsItem)

### Поля формы

Класс `ShortcutsItem` наследуется от `ModelView::CompoundItem` и содержит следующие свойства:

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `ACTION` | int | Действие: Create (0), Replace (1), Update (2), Delete (3) | Да |
| `PIDL` | string | Pointer to Item ID List (для системных папок) | Нет |
| `SHORTCUT_PATH` | string | Путь к ярлыку (имя файла ярлыка) | Да |
| `TARGET_TYPE` | int | Тип цели: FILESYSTEM (0), URL (1), SHELL (2) | Да |
| `TARGET_PATH` | string | Путь к целевому объекту | Да |
| `LOCATION` | int | Расположение ярлыка (индекс из списка локаций) | Да |
| `ARGUMENTS` | string | Аргументы командной строки | Нет |
| `START_IN` | string | Рабочая директория для запуска | Нет |
| `SHORTCUT_KEY` | string | Горячая клавиша (в формате QKeySequence) | Нет |
| `WINDOW` | int | Режим окна: WINDOWED (0), MINIMIZED (1), MAXIMIZED (2) | Нет |
| `COMMENT` | string | Комментарий к ярлыку | Нет |
| `ICON_PATH` | string | Путь к файлу иконки | Нет |
| `ICON_INDEX` | string | Индекс иконки в файле (для DLL/EXE) | Нет |

### Инициализация

При создании нового `ShortcutsItem` все поля инициализируются значениями по умолчанию:

```cpp
ShortcutsItem::ShortcutsItem()
    : ModelView::CompoundItem("ShortcutsItem")
{
    addProperty(ACTION, 0);           // Create по умолчанию
    addProperty(PIDL, "");
    addProperty(SHORTCUT_PATH, "");
    addProperty(TARGET_TYPE, 0);      // FILESYSTEM по умолчанию
    addProperty(TARGET_PATH, "");
    addProperty(ARGUMENTS, "");
    addProperty(START_IN, "");
    addProperty(SHORTCUT_KEY, "");
    addProperty(WINDOW, 0);           // WINDOWED по умолчанию
    addProperty(COMMENT, "");
    addProperty(ICON_PATH, "");
    addProperty(ICON_INDEX, "");
    addProperty(LOCATION, 0);
}
```

## Пользовательский интерфейс (ShortcutsWidget)

### Структура формы

Виджет `ShortcutsWidget` содержит следующие элементы управления:

#### 1. Действие (Action)
- **Тип**: `QComboBox`
- **Варианты**:
  - Create (0) - Создать новый ярлык
  - Replace (1) - Заменить существующий
  - Update (2) - Обновить существующий
  - Delete (3) - Удалить ярлык

**Особенности**: При выборе "Delete" отключаются виджеты для редактирования пути цели, иконки и рабочей директории.

#### 2. Имя (Name)
- **Тип**: `ShortcutLineEdit` с кнопкой "..." для выбора папки
- **Маппинг**: Колонка 2 модели
- **Особенности**: Кнопка выбора доступна только когда Location = "[Specify full path]" (индекс 0)

#### 3. Тип цели (Target Type)
- **Тип**: `QComboBox`
- **Варианты**:
  - FILESYSTEM (0) - Файловая система
  - URL (1) - URL-адрес
  - SHELL (2) - Оболочка Windows

**Влияние на форму**:
- **FILESYSTEM**: Включает поля Start In, Arguments, Run, Comment
- **URL**: Отключает Start In, Arguments, Run, Comment
- **SHELL**: Отключает Arguments и Start In, включает Run и Comment

#### 4. Расположение (Location)
- **Тип**: `QComboBox`
- **Варианты** (15 локаций):
0. [Specify full path] - Указать полный путь
1. Desktop - Рабочий стол
2. Start Menu - Меню Пуск
3. Programs - Программы
4. StartUp - Автозагрузка
5. Explorer Favorites - Избранное проводника
6. Explorer Links - Ссылки проводника
7. Send To - Отправить
8. Recent - Недавние документы
9. Quick Launch ToolBar - Панель быстрого запуска
10. My Network Places - Сетевое окружение
11. All Users Desktop - Рабочий стол всех пользователей
12. All Users Start Menu - Меню Пуск всех пользователей
13. All Users Programs - Программы всех пользователей
14. All Users StartUp - Автозагрузка всех пользователей
15. All Users Explorer Favorites - Избранное всех пользователей

**Маппинг переменных окружения**:
- `%DesktopDir%` - Рабочий стол
- `%StartMenuDir%` - Меню Пуск
- `%ProgramsDir%` - Программы
- `%StartUpDir%` - Автозагрузка
- `%FavoritesDir%` - Избранное
- `%SendToDir%` - Отправить
- `%RecentDocumentsDir%` - Недавние документы
- `%AppDataDir%` - Данные приложения
- `%NetPlacesDir%` - Сетевое окружение
- `%CommonDesktopDir%` - Общий рабочий стол
- `%CommonStartMenuDir%` - Общее меню Пуск
- `%CommonProgramsDir%` - Общие программы
- `%CommonStartUpDir%` - Общая автозагрузка
- `%CommonFavoritesDir%` - Общее избранное

#### 5. Путь цели (Target Path)
- **Тип**: `ShortcutLineEdit` с кнопкой "..." для выбора файла/папки
- **Маппинг**: Колонка 4 модели
- **Валидация**: Обязательное поле

#### 6. Аргументы (Arguments)
- **Тип**: `ShortcutLineEdit`
- **Маппинг**: Колонка 5 модели
- **Особенности**: Доступно только для FILESYSTEM

#### 7. Начать в (Start In)
- **Тип**: `ShortcutLineEdit` с кнопкой "..." для выбора папки
- **Маппинг**: Колонка 6 модели
- **Особенности**: Доступно только для FILESYSTEM

#### 8. Горячая клавиша (Shortcut Key)
- **Тип**: `QKeySequenceEdit`
- **Особенности**: 
  - Placeholder текст: "Press shortcut"
  - Кнопка очистки включена
  - При завершении редактирования сохраняется только первая комбинация клавиш
  - Значение сохраняется в формате строки QKeySequence

#### 9. Запуск (Run)
- **Тип**: `QComboBox`
- **Варианты**:
  - Normal Window (0) - Обычное окно
  - Minimized (1) - Свернуто
  - Maximized (2) - Развернуто
- **Маппинг**: Колонка 8 модели
- **Особенности**: Доступно для FILESYSTEM и SHELL

#### 10. Комментарий (Comment)
- **Тип**: `ShortcutLineEdit`
- **Маппинг**: Колонка 9 модели
- **Особенности**: Доступно для FILESYSTEM и SHELL

#### 11. Путь к иконке (Icon File Path)
- **Тип**: `ShortcutLineEdit` с кнопкой "..." для выбора файла
- **Маппинг**: Колонка 10 модели
- **Особенности**: 
  - Диалог выбора поддерживает: *.ini, *.dll, *.png
  - При изменении текста проверяется расширение файла
  - Если файл заканчивается на ".dll", поле Icon Index становится доступным

#### 12. Индекс иконки (Icon Index)
- **Тип**: `ShortcutLineEdit`
- **Маппинг**: Колонка 11 модели
- **Особенности**: 
  - По умолчанию отключено
  - Включается только если Icon File Path указывает на DLL файл

### Маппинг данных

Виджет использует `QDataWidgetMapper` для связи элементов интерфейса с моделью данных:

```cpp
mapper->addMapping(ui->actionComboBox, 0, "currentIndex");
mapper->addMapping(ui->nameLineEdit, 2);
mapper->addMapping(ui->targetTypeComboBox, 3, "currentIndex");
mapper->addMapping(ui->targetPathLineEdit, 4);
mapper->addMapping(ui->argumentsLineEdit, 5);
mapper->addMapping(ui->startInLineEdit, 6);
mapper->addMapping(ui->runComboBox, 8, "currentIndex");
mapper->addMapping(ui->commentLineEdit, 9);
mapper->addMapping(ui->iconFilePathLineEdit, 10);
mapper->addMapping(ui->iconIndexLineEdit, 11);
mapper->addMapping(ui->locationComboBox, 12, "currentIndex");
```

**Примечание**: Горячая клавиша обрабатывается отдельно через `QKeySequenceEdit` и не использует маппер.

### Валидация

Метод `validate()` проверяет обязательные поля:

```cpp
bool ShortcutsWidget::validate()
{
    // Проверка имени
    if (!CommonUtils::validateLineEdit(ui->nameLineEdit, tr("Please input name value.")))
    {
        return false;
    }

    // Проверка пути цели
    if (!CommonUtils::validateLineEdit(ui->targetPathLineEdit, tr("Please input target path value.")))
    {
        return false;
    }

    return true;
}
```

## Хранение данных

### Формат XML

Данные хранятся в XML-файлах согласно схеме `shortcutsschema.xsd`.

#### Структура XML

```xml
<Shortcuts clsid="{872ECB34-B2EC-401b-A585-D32574AA90EE}">
  <Shortcut clsid="{4F2F7C55-2790-433e-8127-0739D1CFA327}"
            name="ИмяЯрлыка"
            status="Статус"
            image="0"
            changed="2020-05-13 15:37:47"
            uid="{GUID}"
            userContext="0"
            bypassErrors="1"
            desc="Описание"
            removePolicy="1">
    <Properties pidl=""
                targetType="FILESYSTEM|URL|SHELL"
                action="C|R|U|D"
                comment="Комментарий"
                shortcutKey="0"
                startIn="/путь/"
                arguments="--аргументы"
                iconIndex="0"
                targetPath="/путь/к/файлу"
                iconPath="путь/к/иконке"
                window="MIN|MAX|"
                shortcutPath="%DesktopDir%\ИмяЯрлыка" />
  </Shortcut>
</Shortcuts>
```

#### Атрибуты элемента Shortcuts

- `clsid` (обязательный) - CLSID контейнера: `{872ECB34-B2EC-401b-A585-D32574AA90EE}`
- `disabled` (опциональный) - Флаг отключения

#### Атрибуты элемента Shortcut

- `clsid` (обязательный) - CLSID ярлыка: `{4F2F7C55-2790-433e-8127-0739D1CFA327}`
- `name` (обязательный) - Имя ярлыка
- `uid` (обязательный) - Уникальный идентификатор (GUID)
- `image` (опциональный) - Индекс изображения
- `changed` (опциональный) - Дата изменения (формат: "YYYY-MM-DD HH:MM:SS")
- `desc` (опциональный) - Описание
- `bypassErrors` (опциональный) - Игнорировать ошибки (0/1)
- `userContext` (опциональный) - Контекст пользователя
- `status` (опциональный) - Статус
- `removePolicy` (опциональный) - Политика удаления

#### Атрибуты элемента Properties

- `targetType` (обязательный) - Тип цели: "FILESYSTEM", "URL", "SHELL"
- `targetPath` (обязательный) - Путь к целевому объекту
- `shortcutPath` (обязательный) - Путь к ярлыку (может содержать переменные окружения)
- `action` (опциональный) - Действие: "C" (Create), "R" (Replace), "U" (Update), "D" (Delete)
- `pidl` (опциональный) - Pointer to Item ID List
- `comment` (опциональный) - Комментарий
- `shortcutKey` (опциональный) - Горячая клавиша (uint16, закодированная)
- `startIn` (опциональный) - Рабочая директория
- `arguments` (опциональный) - Аргументы командной строки
- `iconIndex` (опциональный) - Индекс иконки (uint8)
- `iconPath` (опциональный) - Путь к файлу иконки
- `window` (опциональный) - Режим окна: "MIN", "MAX" или пустая строка
- `disabled` (опциональный) - Флаг отключения

### Кодирование горячих клавиш

Горячие клавиши хранятся в XML как `uint16` (unsignedShort), но в модели данных используются как строки в формате QKeySequence.

#### Процесс кодирования

1. **В модель**: Строка QKeySequence → uint32 через `KeySequenceEncoder::encode()`
2. **В XML**: uint32 → uint16 (обрезается до младших 16 бит)
3. **Из XML**: uint16 → uint32 → QKeySequence через `KeySequenceEncoder::decode()`
4. **Из модели**: QKeySequence → строка через `toString()`

#### Формат кодирования

- Модификаторы (Shift, Ctrl, Alt, Win) кодируются в старшем байте (биты 8-15)
- Код клавиши кодируется в младшем байте (биты 0-7)
- Формула: `result = (nativeModifiers << 8) ^ nativeKeycode`

### Преобразование данных

#### ShortcutsModelBuilder

Класс `ShortcutsModelBuilder` отвечает за преобразование между XML-схемой и моделью данных:

**Методы**:

1. `schemaToModel()` - Преобразование XML → Модель данных
   - Парсит XML-структуру
   - Извлекает свойства из элементов Properties
   - Декодирует значения (типы, локации, горячие клавиши)
   - Создает `ShortcutsContainerItem` для каждого ярлыка

2. `modelToSchema()` - Преобразование Модель данных → XML
   - Проходит по элементам модели
   - Кодирует значения в формат XML
   - Формирует структуру Shortcuts/Shortcut/Properties

**Вспомогательные методы**:

- `decodeShortcutKey()` / `encodeShortcutKey()` - Кодирование горячих клавиш
- `decodeTargetType()` / `encodeTargetType()` - Преобразование типов целей
- `decodeLocation()` / `encodeLocation()` - Преобразование локаций
- `decodeWindowMode()` / `encodeWindowMode()` - Преобразование режимов окна

### Чтение и запись

#### ShortcutsPreferenceReader

```cpp
std::unique_ptr<PreferencesModel> ShortcutsPreferenceReader::createModel(std::istream &input)
{
    auto schema = Shortcuts_(input, ::xsd::cxx::tree::flags::dont_validate);
    auto modelBuilder = std::make_unique<ShortcutsModelBuilder>();
    return modelBuilder->schemaToModel(schema);
}
```

#### ShortcutsPreferenceWriter

```cpp
bool ShortcutsPreferenceWriter::writeModel(std::ostream &output, const std::unique_ptr<PreferencesModel> &model)
{
    auto modelBuilder = std::make_unique<ShortcutsModelBuilder>();
    auto shortcuts = modelBuilder->modelToSchema(const_cast<std::unique_ptr<PreferencesModel> &>(model));
    const ::xml_schema::NamespaceInfomap map;
    Shortcuts_(output, *shortcuts.get(), map);
    return true;
}
```

## Контейнер (ShortcutsContainerItem)

### Структура

`ShortcutsContainerItem` содержит:

1. **Отображаемые свойства** (для таблицы):
   - `SHORTCUT_PATH` - Имя ярлыка
   - `ORDER` - Порядок сортировки
   - `ACTION` - Действие (строковое представление)
   - `TARGET_PATH` - Путь к цели

2. **Скрытые свойства**:
   - `COMMON` - `CommonItem` (общие свойства: CLSID, UID, имя, дата изменения и т.д.)
   - `SHORTCUTS` - `ShortcutsItem` (специфичные свойства ярлыка)

### Слушатели изменений

Метод `setupListeners()` синхронизирует отображаемые свойства с данными `ShortcutsItem`:

```cpp
void ShortcutsContainerItem::setupListeners()
{
    auto onChildPropertyChange = [&](SessionItem *item, std::string property) {
        if (auto shortcutsItem = dynamic_cast<ShortcutsItem *>(item))
        {
            if (property == ACTION)
            {
                setProperty(ACTION, defaultActionsToString(shortcutsItem->property<int>(ACTION)));
            }
            if (property == SHORTCUT_PATH)
            {
                setProperty(SHORTCUT_PATH, shortcutsItem->property<std::string>(SHORTCUT_PATH));
            }
            if (property == TARGET_PATH)
            {
                setProperty(TARGET_PATH, shortcutsItem->property<std::string>(TARGET_PATH));
            }
        }
    };
    this->mapper()->setOnChildPropertyChange(onChildPropertyChange, nullptr);
}
```

## Специальные компоненты

### ShortcutLineEdit

Кастомный виджет `ShortcutLineEdit` наследуется от `QLineEdit` и добавляет функциональность:

- **F3 для выбора переменных**: При нажатии F3 открывается диалог выбора переменных окружения
- Используется для всех текстовых полей формы (кроме горячей клавиши)

### KeySequenceEncoder

Класс для преобразования между форматами горячих клавиш:

- **encode()**: `QKeySequence` → `uint32` (нативный формат Windows)
- **decode()**: `uint32` → `QKeySequence`

Использует маппинг между Qt-кодами клавиш и нативными Windows Virtual Key Codes.

## Пример использования

### Пример XML-файла

```xml
<?xml version="1.0" encoding="utf-8"?>
<Shortcuts clsid="{872ECB34-B2EC-401b-A585-D32574AA90EE}">
  <Shortcut clsid="{4F2F7C55-2790-433e-8127-0739D1CFA327}"
            name="Firefox"
            status="Firefox"
            image="0"
            changed="2020-05-13 15:37:47"
            uid="{EA9BCB22-CD0C-47B2-B550-D812414DEE6B}"
            userContext="0"
            bypassErrors="1"
            desc="Test description"
            removePolicy="1">
    <Properties pidl=""
                targetType="FILESYSTEM"
                action="C"
                comment="Test comment"
                shortcutKey="0"
                startIn="/usr/bin/"
                arguments="--no-remote"
                iconIndex="0"
                targetPath="/usr/bin/firefox"
                iconPath="system-file-manager"
                window=""
                shortcutPath="%DesktopDir%\Firefox" />
  </Shortcut>
</Shortcuts>
```

### Создание ярлыка программно

```cpp
// Создание элемента ярлыка
auto shortcutsItem = std::make_unique<ShortcutsItem>();

// Установка свойств
shortcutsItem->setProperty(ShortcutsItem::ACTION, CREATE__MODE);
shortcutsItem->setProperty(ShortcutsItem::SHORTCUT_PATH, "MyApp");
shortcutsItem->setProperty(ShortcutsItem::TARGET_TYPE, FILESYSTEM);
shortcutsItem->setProperty(ShortcutsItem::TARGET_PATH, "/usr/bin/myapp");
shortcutsItem->setProperty(ShortcutsItem::LOCATION, 1); // Desktop
shortcutsItem->setProperty(ShortcutsItem::SHORTCUT_KEY, "Ctrl+Alt+A");
shortcutsItem->setProperty(ShortcutsItem::WINDOW, WINDOWED);
shortcutsItem->setProperty(ShortcutsItem::COMMENT, "My Application");
```

## Зависимости

- **Qt5**: Core, Gui, Widgets
- **ModelView**: Фреймворк для работы с моделями данных
- **XSD**: Генерация классов из XML-схем
- **XercesC**: Парсинг XML

## Файлы проекта

### Основные файлы

- `shortcutsitem.h/cpp` - Модель данных ярлыка
- `shortcutscontaineritem.h/cpp` - Контейнер ярлыков
- `shortcutswidget.h/cpp` - Виджет редактирования
- `shortcutswidget.ui` - UI-файл формы
- `shortcutswidgetslots.cpp` - Обработчики событий UI
- `shortcutsmodelbuilder.h/cpp` - Преобразователь данных
- `shortcutspreferencereader.h/cpp` - Чтение XML
- `shortcutspreferencewriter.h/cpp` - Запись XML
- `keysequenceencoder.h/cpp` - Кодирование горячих клавиш

### Схемы и ресурсы

- `schemas/shortcutsschema.xsd` - XML-схема
- `i18n/shortcuts_translation_*.ts` - Файлы переводов

## Особенности реализации

1. **Маппинг данных**: Используется `QDataWidgetMapper` с ручным режимом сохранения (`ManualSubmit`)
2. **Валидация**: Проверка обязательных полей перед сохранением
3. **Условная активация**: Элементы формы активируются/деактивируются в зависимости от типа цели и действия
4. **Кодирование клавиш**: Сложное преобразование между Qt и Windows форматами
5. **Переменные окружения**: Поддержка переменных типа `%DesktopDir%` в путях
6. **Иконки**: Специальная обработка DLL-файлов с поддержкой индексов иконок

## Ограничения

1. Горячая клавиша сохраняется только первая комбинация из последовательности
2. Поддержка только одного ярлыка на элемент Properties (хотя схема позволяет несколько)
3. Кодирование горячих клавиш специфично для Windows Virtual Key Codes
4. Валидация ограничена проверкой обязательных полей (имя и путь цели)
