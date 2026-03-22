import { createElement } from '../../util/element-creator.js';

const HELP_PLACEHOLDER = [
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
].join('\n');

function renderChildRow({ icon, title }) {
    return createElement('li', {
        className: ['gp__list-children__item', 'folder'],
        children: [
            createElement('span', {
                className: 'workspace-list-item',
                children: [
                    createElement('span', { className: ['icon', icon] }),
                    createElement('span', {
                        className: 'gp__list-children__item__title',
                        text: title,
                    }),
                ],
            }),
        ],
    });
}

/**
 * Рендерит шаблон при выборе папки в дереве
 * @returns {ElementCreator} — контент папки: список дочерних элементов и блок помощи
 */
export function renderFolderTemplate({ children = [] } = {}) {
    const SAMPLE_CHILDREN = Array.isArray(children)
        ? children
        : [];

    return createElement('div', {
        className: 'gp__list-children-wrapper',
        children: [
            createElement('div', {
                className: 'gp__list-children',
                children: [
                    createElement('ul', {
                        className: 'gp__list-children__list',
                        children: SAMPLE_CHILDREN.map(renderChildRow),
                    }),
                ],
            }),
            createElement('div', {
                className: ['gp__list-children-help', 'is-open'],
                children: [
                    createElement('div', {
                        className: 'title',
                        text: 'Помощь:',
                    }),
                    createElement('div', {
                        className: 'content',
                        text: HELP_PLACEHOLDER,
                    }),
                ],
            }),
        ],
    });
}
