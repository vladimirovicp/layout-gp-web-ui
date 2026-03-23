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
        opened: false,
        icon: null,
        help: 'Local group policies templates',
      
        children: [
            {
                title: t('policies.machine'),
                type: 'folder',
                opened: false,
                icon: 'ico-computer',
                help: 'Machine level policies',
                children: [
                    {
                        title: t('policies.adminTemplates'),
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        children: machineCategories,
                        help: 'Machine administrative templates',
                    },
                    {
                        title: t('preferences.title'),
                        type: 'folder',
                        opened: false,
                        icon: 'ico-folder',
                        help: 'Preferences policies.',
                        children: [
                            {
                                title: t('preferences.systemSettings'), //'Настройки системы',  
                                type: 'folder',
                                opened: false,
                                icon: 'ico-folder',
                                children: treepreferences,
                                help: 'Policies that set system settings.',
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
                                type: 'file',
                                opened: false,
                                icon: 'ico-file',
                                template: 'scripts',
                                header: {
                                    class: 'Machine'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: t('policies.user'),
                type: 'folder',
                opened: false,
                icon: 'ico-user',
                help: 'User level policies',
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
