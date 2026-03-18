import { t } from '../../locales/translations.js';
import { treepreferences } from './tree-view-preferences.js';
import { convertPolicySection } from './policy-converter.js';
import policyData from './policy-en.json';

const machineCategories = convertPolicySection(policyData.Machine);
const userCategories = convertPolicySection(policyData.User);

export const treeViewList = [
    {
        title: t('policies.localGroupPolicy'),
        type: 'folder',
        opened: true,
        icon: null,
        children: [
            {
                title: t('policies.machine'),
                type: 'folder',
                opened: true,
                icon: 'ico-computer',
                children: [
                    {
                        title: t('policies.adminTemplates'),
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        children: machineCategories
                    },
                    {
                        title: t('preferences.title'),
                        type: 'folder',
                        opened: true,
                        icon: 'ico-folder',
                        children: [
                            {
                                title: t('preferences.systemSettings'), //'Настройки системы',  
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
                        title: t('policies.adminTemplates'),
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        children: userCategories
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
