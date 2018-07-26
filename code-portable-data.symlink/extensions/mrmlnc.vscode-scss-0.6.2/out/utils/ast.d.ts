import { INode, NodeType } from '../types/nodes';
/**
 * Get Node by offset position.
 */
export declare function getNodeAtOffset(parsedDocument: INode, posOffset: number): INode;
/**
 * Returns the parent Node of the specified type.
 */
export declare function getParentNodeByType(node: INode, type: NodeType): INode;
/**
 * Returns True, if node has Parent with specified type(s).
 */
export declare function hasParentsByType(node: INode, types: NodeType[]): boolean;
/**
 * Returns the child Node of the specified type.
 */
export declare function getChildByType(parent: INode, type: NodeType): INode[];
