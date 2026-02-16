# Документация GPUI

## Оглавление

1. [Введение](#введение)
2. [Архитектура системы](#архитектура-системы)
3. [Основные компоненты](#основные-компоненты)
4. [Плагины и Snap-ins](#плагины-и-snap-ins)
5. [Модель данных](#модель-данных)
6. [Пользовательский интерфейс](#пользовательский-интерфейс)
7. [Система логирования](#система-логирования)
8. [Интернационализация](#интернационализация)
9. [Сборка и установка](#сборка-и-установка)
10. [Использование](#использование)
11. [Разработка плагинов](#разработка-плагинов)

---

## Введение

**GPUI** (Group Policy UI) — это открытая утилита для управления групповыми политиками на ALT-Linux. Проект разработан компанией BaseALT Ltd. и распространяется под лицензией GNU General Public License версии 2 или более поздней.

### Основные возможности

- Управление групповыми политиками через графический интерфейс
- Поддержка форматов ADMX/ADML (Administrative Templates)
- Работа с различными типами политик (POL, REG, INI, скрипты и др.)
- Модульная архитектура с поддержкой плагинов
- Интернационализация (поддержка нескольких языков)
- Интеграция с LDAP/Active Directory
- Работа с SMB-хранилищами

---

## Архитектура системы

GPUI построена на модульной архитектуре с использованием следующих технологий:

- **Язык программирования**: C++17
- **GUI Framework**: Qt5 (Widgets, QML)
- **Система сборки**: CMake 3.14+
- **Целевая платформа**: ALT-Linux (UNIX-подобные системы)

### Структура проекта

```
gpui/
├── src/
│   ├── app/              # Главное приложение
│   ├── core/             # Ядро системы
│   ├── gui/              # Пользовательский интерфейс
│   ├── io/               # Ввод/вывод данных
│   ├── ldap/             # Интеграция с LDAP
│   └── plugins/          # Плагины и snap-ins
├── tests/                # Тесты
├── cmake/                # CMake модули
└── setup/                # Файлы установки
```

### Основные библиотеки

1. **gpui-core** — ядро системы, управление плагинами и snap-ins
2. **gpui-gui** — графический интерфейс пользователя
3. **gpui-io** — модули ввода/вывода для работы с файлами политик
4. **gpui-ldap** — интеграция с LDAP/Active Directory

---

## Основные компоненты

### 1. Точка входа приложения (`src/app/main.cpp`)

Главная функция `main()` выполняет следующие действия:

1. **Регистрация типов для фабрики**:
   - Регистрирует типы диалогов для snap-ins через `SnapInDetailsFactory`

2. **Инициализация менеджера snap-ins**:
   - Создает `SnapInManager` для управления snap-ins
   - Создает `SnapInLoader` для загрузки snap-ins
   - Загружает стандартные snap-ins через `loadDefaultSnapIns()`

3. **Инициализация Qt приложения**:
   - Создает `QApplication`
   - Устанавливает метаданные приложения (организация, домен, имя, версия)

4. **Настройка локализации**:
   - Определяет системную локаль
   - Загружает переводы через `TranslatorStorage`

5. **Парсинг командной строки**:
   - Обрабатывает аргументы через `CommandLineParser`
   - Поддерживает опции: `-p` (путь к политике), `-b` (путь к bundle), `-h`, `-v`, `-n`

6. **Настройка логирования**:
   - Инициализирует `LoggerManager`
   - Настраивает логирование в консоль, syslog и файл

7. **Создание главного окна**:
   - Создает и отображает `MainWindow`

### 2. Ядро системы (`src/core/`)

#### SnapInManager (`snapinmanager.h/cpp`)

Менеджер snap-ins, реализующий интерфейс `ISnapInManager`:

- **Добавление snap-ins**: `addSnapIn(ISnapIn*)`
- **Удаление snap-ins**: `removeSnapIn(ISnapIn*)`
- **Получение списка**: `getSnapIns()`
- **Очистка**: `clear()`

#### SnapInLoader (`snapinloader.h/cpp`)

Загрузчик snap-ins:

- **Загрузка из директории**: `loadSnapIns(const QDir&)`
- **Загрузка стандартных**: `loadDefaultSnapIns()`

Стандартные директории для snap-ins:
- `/usr/lib/gpui/snapins/`
- `/usr/lib64/gpui/snapins/`
- Директория из переменной окружения `GPUI_SNAPIN_DIRECTORY`

#### PluginStorage (`pluginstorage.h/cpp`)

Хранилище и менеджер плагинов:

- **Загрузка плагина**: `loadPlugin(const QFileInfo&, QString&)`
- **Загрузка директории**: `loadPluginDirectory(const QString&)`
- **Выгрузка плагина**: `unloadPlugin(const QString&)`
- **Создание класса плагина**: `createPluginClass<T>(const QString&)`

Стандартные директории для плагинов:
- `/usr/lib/gpui/plugins/`
- `/usr/lib64/gpui/plugins/`
- Директория из переменной окружения `GPUI_PLUGIN_DIRECTORY`

#### Интерфейс ISnapIn (`isnapin.h`)

Базовый интерфейс для всех snap-ins:

```cpp
class ISnapIn {
    virtual void onInitialize(QMainWindow *mainWindow) = 0;
    virtual void onShutdown() = 0;
    virtual void onDataLoad(const std::string &policyPath, 
                           const std::string &locale) = 0;
    virtual void onDataSave() = 0;
    virtual QUuid getId() const = 0;
    virtual QString getType() const = 0;
    virtual QAbstractItemModel *getRootNode() const = 0;
    virtual QString getDisplayName() const = 0;
    virtual QString getHelpText() const = 0;
    virtual QVersionNumber getVersion() const = 0;
    virtual QString getLicense() const = 0;
    virtual QString getCopyright() const = 0;
    virtual void onRetranslateUI(const std::string &locale) = 0;
};
```

### 3. Пользовательский интерфейс (`src/gui/`)

#### MainWindow (`mainwindow.h/cpp`)

Главное окно приложения:

- **Инициализация**:
  - Настройка UI через Qt Designer (`mainwindow.ui`)
  - Инициализация LDAP через `LdapImpl`
  - Восстановление настроек через `MainWindowSettings`
  - Создание меню языков
  - Создание виджета контента (`ContentWidget`)

- **Основные компоненты UI**:
  - `QTreeView` — дерево snap-ins и политик
  - `ContentWidget` — область отображения содержимого выбранного элемента
  - `QSplitter` — разделитель между деревом и контентом

- **Функциональность**:
  - Открытие директории политик (`onDirectoryOpen`)
  - Сохранение источника реестра (`updateStatusBar`)
  - Переключение языков
  - Управление snap-ins

#### ContentWidget (`contentwidget.h/cpp`)

Виджет для отображения содержимого выбранного элемента:

- Использует `QStackedWidget` для переключения между различными представлениями
- Обрабатывает выбор элементов модели через `modelItemSelected()`
- Поддерживает локализацию через `onLanguageChanged()`

#### CommandLineParser (`commandlineparser.h/cpp`)

Парсер командной строки:

- **Опции**:
  - `-p <path>` — полный путь к политике для редактирования
  - `-b <path>` — полный путь к bundle политик для загрузки
  - `-h, --help` — справка
  - `-v, --version` — информация о версии
  - `-n <name>` — опция для совместимости с ADMC (не используется)

### 4. Модуль ввода/вывода (`src/io/`)

Обеспечивает работу с файлами политик различных форматов:

- `PolicyDefinitionsFile` — работа с ADMX файлами
- `PolicyResourcesFile` — работа с ADML файлами
- `PolicyFile` — работа с POL файлами

### 5. Интеграция с LDAP (`src/ldap/`)

Модуль для работы с LDAP/Active Directory:

- `LdapImpl` — реализация LDAP интерфейса
- `AdInterface` — интерфейс для работы с Active Directory
- Поддержка атрибутов групповых политик в AD

---

## Плагины и Snap-ins

### Доступные плагины

1. **administrative_templates** — административные шаблоны (ADMX/ADML)
2. **admx** — поддержка формата ADMX
3. **adml** — поддержка формата ADML
4. **pol** — поддержка формата POL (Policy files)
5. **reg** — поддержка формата REG (реестр Windows)
6. **ini** — поддержка INI файлов
7. **ini_ascii** — поддержка ASCII INI файлов
8. **scripts** — управление скриптами (логин, логаут, запуск, выключение)
9. **preferences** — настройки предпочтений
10. **spol** — специальные политики
11. **cmtx** — политики безопасности
12. **cmtl** — политики безопасности (альтернативный)
13. **storage/smb** — хранилище на SMB-шарах

### Архитектура плагинов

Плагины реализуются как динамические библиотеки (shared libraries) и должны:

1. **Экспортировать функцию инициализации**:
   ```cpp
   extern "C" GPUI_SYMBOL_EXPORT ::gpui::Plugin *gpui_plugin_init() {
       return new YourPluginClass;
   }
   ```

2. **Наследоваться от класса Plugin**:
   ```cpp
   class YourPlugin : public gpui::Plugin {
   public:
       YourPlugin() : Plugin("PluginName") {
           GPUI_REGISTER_PLUGIN_CLASS("ClassName", YourClass);
       }
   };
   ```

3. **Регистрировать классы плагина** через `GPUI_REGISTER_PLUGIN_CLASS`

### Архитектура Snap-ins

Snap-ins должны:

1. **Реализовать интерфейс ISnapIn** или наследоваться от `AbstractSnapIn`

2. **Предоставить модель данных** через `getRootNode()` — возвращает `QAbstractItemModel*`

3. **Обрабатывать жизненный цикл**:
   - `onInitialize()` — инициализация при запуске
   - `onShutdown()` — очистка при завершении
   - `onDataLoad()` — загрузка данных из директории политик
   - `onDataSave()` — сохранение данных

4. **Поддерживать локализацию** через `onRetranslateUI()`

---

## Модель данных

### Policy Bundle (`policybundle.h/cpp`)

Класс для работы с набором политик:

- Загружает ADMX/ADML файлы из директории
- Строит дерево категорий и политик
- Поддерживает разделение на Machine и User политики
- Использует `QStandardItemModel` для представления дерева

### Policy (`policy.h`)

Представление отдельной политики:

- **Основные поля**:
  - `name` — имя политики
  - `namespace_` — пространство имен
  - `displayName` — отображаемое имя
  - `explainText` — описание
  - `key` — ключ реестра
  - `valueName` — имя значения реестра
  - `policyType` — тип (Machine/User/Both)

- **Элементы политики**:
  - `elements` — параметры политики
  - `enabledList` / `disabledList` — списки для включенного/выключенного состояния
  - `enabledValue` / `disabledValue` — значения для состояний

### Policy File (POL формат)

Формат POL файлов:

- Бинарный формат с заголовком `PReg`
- Содержит инструкции для реестра:
  - Тип значения (REG_SZ, REG_DWORD, REG_BINARY и др.)
  - Ключ реестра
  - Имя значения
  - Данные

### Registry Integration

Интеграция с реестром Windows:

- `AbstractRegistrySource` — абстрактный источник данных реестра
- `Registry` — реализация работы с реестром
- `PolicyStateManager` — управление состоянием политик в реестре

---

## Пользовательский интерфейс

### Структура главного окна

```
MainWindow
├── MenuBar (меню)
├── ToolBar (панель инструментов)
├── QSplitter
│   ├── QTreeView (дерево snap-ins)
│   └── ContentWidget (контент)
│       └── QStackedWidget
│           ├── PolicyListWidget
│           └── PolicyDetailsWidget
└── StatusBar (строка состояния)
```

### Основные виджеты

1. **TreeView** — отображает иерархию snap-ins и политик
2. **ContentWidget** — показывает детали выбранного элемента
3. **PresentationBuilder** — строит UI для политик на основе ADML
4. **PluginWidgetInterface** — интерфейс для виджетов плагинов

### События и фильтры

- `TreeViewEventFilter` — фильтр событий для дерева (обработка Enter для открытия элемента)
- Сигналы Qt для связи компонентов

---

## Система логирования

### LoggerManager (`loggermanager.h/cpp`)

Центральный менеджер логирования:

- Глобальный экземпляр через `globalInstance()`
- Поддержка нескольких логгеров одновременно
- Уровни логирования: `LOG_LEVEL_DISABLED`, `LOG_LEVEL_DEBUG`, `LOG_LEVEL_INFO`, `LOG_LEVEL_WARNING`, `LOG_LEVEL_ERROR`

### Типы логгеров

1. **ConsoleLogger** (`consolelogger.h/cpp`) — вывод в консоль
2. **SyslogLogger** (`sysloglogger.h/cpp`) — вывод в syslog
3. **FileLogger** (`filelogger.h/cpp`) — вывод в файл

### Использование

```cpp
auto logManager = gpui::logger::LoggerManager::globalInstance();
logManager->addLogger<gpui::logger::ConsoleLogger>(LOG_LEVEL_INFO);
logManager->addLogger<gpui::logger::FileLogger>(LOG_LEVEL_DEBUG);
```

---

## Интернационализация

### TranslatorStorage (`translatorstorage.h/cpp`)

Хранилище переводов:

- **Загрузка переводов**: `loadTranslators(const QString& language)`
- **Загрузка Qt переводов**: `loadQtTranslations(const QString& language, const QString& prefix)`
- Поддержка динамической смены языка

### Файлы переводов

- Расположение: `src/gui/i18n/`, `src/plugins/*/i18n/`
- Формат: Qt Translation Source (`.ts`)
- Компиляция: Qt Linguist Tools (`qt5_add_translation`)

### Поддерживаемые языки

- Английский (`en`)
- Русский (`ru`)
- Возможность добавления других языков

---

## Сборка и установка

### Зависимости

Для сборки требуются следующие пакеты:

```bash
apt-get install cmake rpm-macros-cmake cmake-modules gcc-c++ \
    qt5-base-devel qt5-declarative-devel qt5-tools-devel \
    libsmbclient-devel libsmbclient samba-devel \
    libldap-devel libsasl2-devel libuuid-devel \
    glib2-devel libpcre-devel libkrb5-devel \
    qt5-base-common doxygen libxerces-c-devel xsd \
    boost-devel-headers desktop-file-utils \
    ImageMagick-tools libqt-mvvm-devel \
    xorg-xvfb xvfb-run
```

### Сборка

```bash
cmake -B build -DGPUI_BUILD_TESTS=OFF .
cd build
make -j `nproc`
```

### Установка ADMX политик

Для работы с ADMX политиками необходимо установить:

```bash
apt-get install admx-msi-setup
admx-msi-setup
```

### Переменные окружения

- `GPUI_PLUGIN_DIRECTORY` — директория для загрузки плагинов
- `GPUI_SNAPIN_DIRECTORY` — директория для загрузки snap-ins

---

## Использование

### Запуск приложения

```bash
gpui-main [options]
```

### Опции командной строки

- `-p <path>` — полный путь к политике для редактирования
- `-b <path>` — полный путь к bundle политик (по умолчанию: `/usr/share/PolicyDefinitions`)
- `-h, --help` — отображение справки
- `-v, --version` — отображение информации о версии
- `-n <name>` — опция для совместимости с ADMC (не используется)

### Примеры использования

1. **Открыть политику из указанной директории**:
   ```bash
   gpui-main -p /path/to/policy/directory
   ```

2. **Загрузить bundle из указанной директории**:
   ```bash
   gpui-main -b /usr/share/PolicyDefinitions
   ```

3. **Открыть с указанием политики и bundle**:
   ```bash
   gpui-main -p /path/to/policy -b /path/to/bundle
   ```

### Работа с интерфейсом

1. **Дерево snap-ins** (левая панель):
   - Отображает все загруженные snap-ins
   - Развертывание узлов для просмотра политик
   - Выбор элемента для просмотра деталей

2. **Область контента** (правая панель):
   - Отображает детали выбранного элемента
   - Формы редактирования для политик
   - Информация о snap-ins

3. **Меню**:
   - Файл: открытие директории политик, сохранение
   - Вид: настройки отображения
   - Язык: переключение языка интерфейса
   - Справка: информация о программе

---

## Разработка плагинов

### Создание нового плагина

1. **Создать структуру директорий**:
   ```
   src/plugins/your_plugin/
   ├── CMakeLists.txt
   ├── yourplugin.cpp
   └── yourplugin.h
   ```

2. **Реализовать класс плагина**:
   ```cpp
   #include "core/plugin.h"
   
   class YourPlugin : public gpui::Plugin {
   public:
       YourPlugin() : Plugin("YourPlugin") {
           GPUI_REGISTER_PLUGIN_CLASS("YourClass", YourClass);
       }
   };
   
   GPUI_EXPORT_PLUGIN(YourPlugin, YourPlugin)
   ```

3. **Добавить в CMakeLists.txt**:
   ```cmake
   add_subdirectory(your_plugin)
   ```

4. **В CMakeLists.txt плагина**:
   ```cmake
   add_gpui_plugin(your-plugin ${SOURCES} ${HEADERS})
   target_link_libraries(your-plugin gpui-core)
   ```

### Создание нового Snap-in

1. **Наследоваться от AbstractSnapIn**:
   ```cpp
   #include "core/abstractsnapin.h"
   
   class YourSnapIn : public gpui::AbstractSnapIn {
   public:
       void onInitialize(QMainWindow *mainWindow) override {
           // Инициализация
       }
       
       QAbstractItemModel *getRootNode() const override {
           // Возврат модели данных
       }
       
       // Реализация других методов интерфейса
   };
   ```

2. **Создать фабрику для создания экземпляров**

3. **Зарегистрировать snap-in** в системе загрузки

### Тестирование

Проект включает систему тестов:

- Расположение: `tests/auto/`
- Использование Qt Test Framework
- Запуск: `ctest` или через CMake тесты

---

## Дополнительная информация

### Лицензия

Проект распространяется под лицензией GNU General Public License версии 2 или более поздней. Подробности см. в файле `LICENSE.md`.

### Авторские права

Copyright (C) BaseALT Ltd. <org@basealt.ru>

### Версия

Версия определяется из файла `.gear/gpui.spec` и доступна через функцию `getApplicationVersion()`.

### Поддержка

Для получения поддержки и дополнительной информации обращайтесь к разработчикам проекта.

---

## Заключение

GPUI представляет собой мощный инструмент для управления групповыми политиками на ALT-Linux с модульной архитектурой, поддержкой различных форматов политик и расширяемостью через систему плагинов и snap-ins. Документация охватывает основные аспекты архитектуры, использования и разработки расширений для системы.