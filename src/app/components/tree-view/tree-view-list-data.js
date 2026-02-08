import { t } from '../../locales/translations.js';
import { treepreferences } from './tree-view-preferences.js';

export const treeViewList = [
    {
        title: t('policies.localGroupPolicy'),
        type: 'folder',
        opened: true,
        icon: null,
        children: [
            {
                title: 'Компьютер',
                type: 'folder',
                opened: true,
                icon: 'ico-computer',
                children: [
                    {
                        title: 'Администранивные шаблоны',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        children: [
                            {
                                title: 'Система Alt',
                                type: 'folder',
                                opened: false,
                                icon: 'ico-folder',
                                children: [
                                    {
                                        title: 'Безопасность',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    },
                                    {
                                        title: 'Виртуализация',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    },
                                    {
                                        title: 'Графическая подсистема',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    },
                                    {
                                        title: '...',
                                        type: 'file',
                                        icon: 'ico-folder'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Настройки',
                        type: 'folder',
                        opened: true,
                        icon: 'ico-folder',
                        children: [
                            {
                                title: 'Настройки системы',
                                type: 'folder',
                                opened: true,
                                icon: 'ico-folder',
                                children: treepreferences
                            }
                        ]
                    },
                    {
                        title: 'Настройки системы',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        children: [
                            {
                                title: 'Скрипты',
                                type: 'folder',
                                opened: false,
                                icon: 'ico-folder'
                            }
                        ]
                    }
                ]
            },
            {
                title: t('policies.user'),
                type: 'folder',
                opened: true,
                icon: 'ico-user',
                children: [
                    {
                        title: t('adminTemplates'),
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder'
                    },
                    {
                        title: 'Настройки',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder'
                    },
                    {
                        title: 'Настройки системы',
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder'
                    }
                ]
            }
        ]
    }
];
