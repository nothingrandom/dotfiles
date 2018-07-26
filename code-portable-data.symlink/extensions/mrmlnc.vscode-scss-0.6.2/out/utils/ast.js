'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("../types/nodes");
/**
 * Get Node by offset position.
 */
function getNodeAtOffset(parsedDocument, posOffset) {
    let candidate = null;
    parsedDocument.accept((node) => {
        if (node.offset === -1 && node.length === -1) {
            return true;
        }
        else if (node.offset <= posOffset && node.end >= posOffset) {
            if (!candidate) {
                candidate = node;
            }
            else if (node.length <= candidate.length) {
                candidate = node;
            }
            return true;
        }
        return false;
    });
    return candidate;
}
exports.getNodeAtOffset = getNodeAtOffset;
/**
 * Returns the parent Node of the specified type.
 */
function getParentNodeByType(node, type) {
    node = node.getParent();
    while (node.type !== type) {
        if (node.type === nodes_1.NodeType.Stylesheet) {
            return null;
        }
        node = node.getParent();
    }
    return node;
}
exports.getParentNodeByType = getParentNodeByType;
/**
 * Returns True, if node has Parent with specified type(s).
 */
function hasParentsByType(node, types) {
    node = node.getParent();
    while (node.type !== nodes_1.NodeType.Stylesheet) {
        if (types.indexOf(node.type) !== -1) {
            return true;
        }
        node = node.getParent();
    }
    return false;
}
exports.hasParentsByType = hasParentsByType;
/**
 * Returns the child Node of the specified type.
 */
function getChildByType(parent, type) {
    return parent.getChildren().filter((node) => node.type === type);
}
exports.getChildByType = getChildByType;
