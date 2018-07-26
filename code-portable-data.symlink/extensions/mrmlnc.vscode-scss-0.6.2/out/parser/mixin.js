'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("../types/nodes");
const variable_1 = require("./variable");
const ast_1 = require("../utils/ast");
/**
 * Returns information about Mixin Declaraion.
 */
function makeMixin(node) {
    const name = node.getName();
    const params = [];
    node.getParameters().getChildren().forEach((child) => {
        if (child.getName()) {
            params.push(variable_1.makeVariable(child, name));
        }
    });
    return {
        name,
        parameters: params,
        offset: node.offset
    };
}
exports.makeMixin = makeMixin;
/**
 * Returns information about set of Variable Declarations.
 */
function makeMixinCollection(node) {
    return ast_1.getChildByType(node, nodes_1.NodeType.MixinDeclaration).map(makeMixin);
}
exports.makeMixinCollection = makeMixinCollection;
