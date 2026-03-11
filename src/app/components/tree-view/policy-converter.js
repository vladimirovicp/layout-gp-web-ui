/**
 * Рекурсивно преобразует узел категории из policy-en.json
 * в формат узла дерева { title, type, opened, icon, children }.
 * @param {Object} categoryNode - узел { category, policies, inherited }
 * @returns {Object} - узел дерева типа folder
 */
function convertPolicyCategory(categoryNode) {
    const children = [];

    if (categoryNode.inherited && categoryNode.inherited.length > 0) {
        for (const subCategory of categoryNode.inherited) {
            children.push(convertPolicyCategory(subCategory));
        }
    }

    if (categoryNode.policies) {
        for (const [key, policy] of Object.entries(categoryNode.policies)) {
            children.push({
                title: policy.displayName,
                type: 'file',
                icon: 'ico-file',
                policyKey: key,
                policyData: policy
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
    return section.categories.map(cat => convertPolicyCategory(cat));
}
