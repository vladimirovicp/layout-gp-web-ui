/**
 * Рекурсивно преобразует узел категории из policy-en.json
 * в формат узла дерева { title, type, opened, icon, children }.
 * @param {Object} categoryNode - узел { category, policies, inherited }
 * @returns {Object|null} - узел дерева типа folder или null, если категория пуста
 */
function convertPolicyCategory(categoryNode) {
    const hasInherited = categoryNode.inherited && categoryNode.inherited.length > 0;
    const hasPolicies = categoryNode.policies && Object.keys(categoryNode.policies).length > 0;

    if (!hasInherited && !hasPolicies) {
        return null;
    }

    const children = [];

    if (hasInherited) {
        for (const subCategory of categoryNode.inherited) {
            const converted = convertPolicyCategory(subCategory);
            if (converted !== null) {
                children.push(converted);
            }
        }
    }

    if (hasPolicies) {
        for (const [key, policy] of Object.entries(categoryNode.policies)) {
            children.push({
                title: policy.displayName,
                type: 'file',
                icon: 'ico-file',
                policyKey: key,
                policyData: policy,
                template: 'admx',
            });
        }
    }

    return {
        title: categoryNode.category,
        type: 'folder',
        opened: false,
        icon: 'ico-folder',
        children: children.length > 0 ? children : undefined
    };
}

/**
 * Преобразует секцию (Machine или User) из policy-en.json
 * в массив корневых узлов дерева.
 * @param {Object} section - объект вида { categories: [...], uncategorizedPolicies: {} }
 * @returns {Array} - массив узлов дерева
 */
export function convertPolicySection(section) {
    if (!section || !section.categories) return [];
    return section.categories
        .map(cat => convertPolicyCategory(cat))
        .filter(cat => cat !== null);
}
