# Документация модуля Preferences Common

## Обзор модуля

Модуль `preferences/common` реализует вкладку **"Общие"** (Common) в диалоге настроек политик групповых политик. Эта вкладка содержит общие параметры, которые применяются ко всем типам настроек политик.

### Технологии

- **Qt Widgets** — для построения пользовательского интерфейса
- **ModelView Framework** — для работы с моделями данных
- **QDataWidgetMapper** — для привязки данных модели к виджетам формы

## Структура модуля

### Основные компоненты

- `CommonView` (`commonview.h`, `commonview.cpp`, `commonview.ui`) — виджет формы с общими настройками
- `CommonItem` (`commonitem.h`, `commonitem.cpp`) — модель данных для общих настроек
- `PreferencesDialog` (`preferencesdialog.h`, `preferencesdialog.cpp`, `preferencesdialog.ui`) — главный диалог настроек, содержащий вкладку Common

## Форма (CommonView)

Вкладка "Общие" (`commonview.ui`) содержит группу параметров и поле описания.

### Группа "Настройки" (Options)

Группа `groupBox` содержит следующие элементы управления:

| Виджет | Имя в коде | Свойство модели | Тип данных | Описание |
|--------|------------|-----------------|------------|----------|
| Чекбокс | `stopOnErrorCheckBox` | `BYPASS_ERRORS` (8) | `bool` | Остановить обработку элементов при ошибке |
| Чекбокс | `userContextCheckBox` | `USER_CONTEXT` (9) | `bool` | Выполнять в контексте безопасности текущего пользователя (опция пользовательских политик) |
| Чекбокс | `removeThisCheckBox` | `REMOVE_POLICY` (10) | `bool` | Удалить элемент, если больше не применим |
| Чекбокс | `applyOnceCheckBox` | — | `bool` | Применить только один раз (отключен) |
| Чекбокс | `itemLevelCheckBox` | — | `bool` | Выбор элементов (отключен) |
| Кнопка | `targetingToolButton` | — | — | Нацеливание... (отключена) |

### Поле описания

| Виджет | Имя в коде | Свойство модели | Тип данных | Описание |
|--------|------------|-----------------|------------|----------|
| Метка | `descriptionLabel` | — | — | Описание: |
| Текстовое поле | `descriptionPlainTextEdit` | `DESC` (7) | `QString` | Многострочное текстовое поле для описания элемента политики |

## Модель данных (CommonItem)

Класс `CommonItem` наследуется от `BasePreferenceItem<CommonItem>` и представляет модель данных для общих настроек.

### Свойства модели

| Свойство | Enum значение | Имя строки | Тип данных | Значение по умолчанию | Описание |
|----------|---------------|------------|------------|----------------------|----------|
| CLSID | 0 | `"clsid"` | `std::string` | `""` | Идентификатор класса |
| DISABLED | 1 | `"disabled"` | `bool` | `false` | Отключен ли элемент |
| NAME | 2 | `"name"` | `QString` | `""` | Имя элемента |
| STATUS | 3 | `"status"` | `std::string` | `""` | Статус элемента |
| IMAGE | 4 | `"image"` | `int` | `0` | Изображение элемента |
| CHANGED | 5 | `"changed"` | `std::string` | `""` | Флаг изменения |
| UID | 6 | `"uid"` | `std::string` | UUID | Уникальный идентификатор |
| DESC | 7 | `"desc"` | `QString` | `""` | Описание элемента |
| BYPASS_ERRORS | 8 | `"bypassErrors"` | `bool` | `false` | Остановить обработку при ошибке |
| USER_CONTEXT | 9 | `"userContext "` | `bool` | `false` | Выполнять в контексте безопасности пользователя |
| REMOVE_POLICY | 10 | `"removePolicy"` | `bool` | `false` | Удалить элемент при отмене применения |

### Методы доступа к свойствам

#### Описание (DESC)
```cpp
QString desc() const;
void setDesc(const QString& path);
```

#### Остановить обработку при ошибке (BYPASS_ERRORS)
```cpp
bool bypassErrors() const;
void setBypassErrors(bool state);
```

#### Контекст безопасности пользователя (USER_CONTEXT)
```cpp
bool userContext() const;
void setUserContext(bool state);
```

#### Удалить политику (REMOVE_POLICY)
```cpp
bool removePolicy() const;
void setRemovePolicy(bool state);
```

#### Имя (NAME)
```cpp
QString name() const;
void setName(const QString& path);
```

#### Флаг изменения (CHANGED)
```cpp
std::string changed() const;
void setChanged(bool state);
```

## Привязка данных (Data Binding)

В `CommonView::setItem()` используется `QDataWidgetMapper` для привязки свойств модели к виджетам формы:

```cpp
mapper->addMapping(ui->descriptionPlainTextEdit, CommonItem::propertyToInt(CommonItem::DESC));
mapper->addMapping(ui->stopOnErrorCheckBox, CommonItem::propertyToInt(CommonItem::BYPASS_ERRORS));
mapper->addMapping(ui->userContextCheckBox, CommonItem::propertyToInt(CommonItem::USER_CONTEXT));
mapper->addMapping(ui->removeThisCheckBox, CommonItem::propertyToInt(CommonItem::REMOVE_POLICY));
```

### Настройки маппера

- **Submit Policy**: `QDataWidgetMapper::ManualSubmit` — изменения применяются вручную через метод `submit()`
- **Orientation**: `Qt::Vertical` — вертикальная ориентация
- **Delegate**: `ModelView::ViewModelDelegate` — делегат для преобразования данных

## Переводы (i18n)

Модуль поддерживает интернационализацию через файлы переводов:

- `i18n/preferences_common_translation_en.ts` — английский язык
- `i18n/preferences_common_translation_ru.ts` — русский язык

### Ключевые переводы для формы

#### Русский язык

| Исходный текст (EN) | Перевод (RU) |
|---------------------|--------------|
| Stop processing items in this extension if an error occurs | Остановить обработку элементов при ошибке |
| Run in logged-on user's security context (user policy option) | Выполнять в контексте безопасности текущего пользователя (опция пользовательских политик) |
| Remove this item when it is no longer applied | Удалить элемент, если больше не применим |
| Apply once and do not reapply | Применить только один раз |
| Item-level targeting | Выбор элементов |
| Description: | Описание: |
| Common | Общие |

## Архитектура

### Иерархия классов

```
BasePreferenceWidget
    └── CommonView

BasePreferenceItem<CommonItem>
    └── CommonItem
```

### Использование в PreferencesDialog

`CommonView` используется как вкладка в `PreferencesDialog`:

```cpp
ui->commonTab->setItem(item->children()[item->children().size() - 2]);
```

Вкладка "Общие" всегда присутствует в диалоге настроек и содержит общие параметры для всех типов политик.

## Файлы модуля

### Заголовочные файлы (.h)
- `commonview.h` — класс виджета формы
- `commonitem.h` — класс модели данных
- `basepreferencewidget.h` — базовый класс виджета настроек
- `basepreferenceitem.h` — базовый класс элемента настроек

### Файлы реализации (.cpp)
- `commonview.cpp` — реализация виджета формы
- `commonitem.cpp` — реализация модели данных

### UI файлы (.ui)
- `commonview.ui` — описание формы в формате Qt Designer

### Файлы переводов (.ts)
- `i18n/preferences_common_translation_en.ts` — переводы на английский
- `i18n/preferences_common_translation_ru.ts` — переводы на русский

## Примеры использования

### Создание и настройка CommonItem

```cpp
auto item = std::make_unique<preferences::CommonItem>();
item->setName("My Policy");
item->setDesc("Описание политики");
item->setBypassErrors(true);
item->setUserContext(false);
item->setRemovePolicy(false);
```

### Использование CommonView в диалоге

```cpp
auto commonView = new preferences::CommonView(this);
commonView->setItem(sessionItem);
```

## Примечания

1. Чекбоксы `applyOnceCheckBox` и `itemLevelCheckBox`, а также кнопка `targetingToolButton` в текущей версии отключены (`enabled: false`) и не используются.

2. Свойство `USER_CONTEXT` имеет строковое представление `"userContext "` с завершающим пробелом — это особенность реализации, которую следует учитывать при работе с сериализацией.

3. Все изменения в форме применяются через метод `submit()` базового класса `BasePreferenceWidget` при нажатии кнопки "OK" в диалоге.

4. Модель использует паттерн ModelView для разделения данных и представления, что обеспечивает гибкость и возможность переиспользования компонентов.
