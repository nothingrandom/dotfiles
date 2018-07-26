'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("../types/nodes");
const ast_1 = require("../utils/ast");
/**
 * Returns information about Variable Declaration.
 */
function makeVariable(node, fromMixin = null) {
    const valueNode = fromMixin ? node.getDefaultValue() : node.getValue();
    let value = null;
    if (valueNode) {
        value = valueNode.getText().replace(/\n/g, ' ').replace(/\s\s+/g, ' ');
    }
    return {
        name: node.getName(),
        value,
        mixin: fromMixin,
        offset: node.offset
    };
}
exports.makeVariable = makeVariable;
/**
 * Returns information about set of Variable Declarations.
 */
function makeVariableCollection(node) {
    return ast_1.getChildByType(node, nodes_1.NodeType.VariableDeclaration).map((child) => {
        return makeVariable(child, null);
    });
}
exports.makeVariableCollection = makeVariableCollection;
