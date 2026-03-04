import { t } from '../../locales/translations.js';

/** Элементы раздела «Настройки системы» (Компьютер → Настройки → Настройки системы) */
export const treepreferences = [
    {
        title: t('preferences.shortcuts'),
        name:'shortcuts',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    },
    {
        title: t('preferences.environment'),
        name:'environment',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    },
    {
        title: 'Папки',
        name: 'folders',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    },
    {
        title: 'Реестр',
        name: 'registry',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    },
    {
        title: 'Сетевые диски',
        name: 'driveMaps',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    },
    {
        title: 'Сетевые папки',
        name: 'networkShares',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    },
    {
        title: 'Файлы',
        name: 'files',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    },
    {
        title: 'Ini файлы',
        name: 'iniFiles',
        type: 'file',
        icon: 'ico-file',
        template: 'preferences'
    }
];
