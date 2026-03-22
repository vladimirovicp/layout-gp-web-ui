import { createElement } from '../../util/element-creator.js';

const HELP_PLACEHOLDER = [
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
    'какой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, большекакой-то рандомный текст, не знаю о чем)  текста больше, больше',
].join('\n');

function renderChildRow(item, onItemClick) {
    const row = createElement('span', {
        className: 'workspace-list-item',
        attrs: typeof onItemClick === 'function'
            ? {
                role: 'button',
                tabindex: '0',
            }
            : {},
        children: [
            createElement('span', { className: ['icon', item.icon] }),
            createElement('span', {
                className: 'gp__list-children__item__title',
                text: item.title,
            }),
        ],
    });

    if (typeof onItemClick === 'function') {
        row.on('click', () => onItemClick(item));
        row.on('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onItemClick(item);
            }
        });
    }

    return createElement('li', {
        className: ['gp__list-children__item', item.type],
        children: [row],
    });
}

export function renderFolderTemplate({ children = [], onItemClick = null } = {}) {
    const folderChildren = Array.isArray(children)
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
                        children: folderChildren.map((child) => renderChildRow(child, onItemClick)),
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
