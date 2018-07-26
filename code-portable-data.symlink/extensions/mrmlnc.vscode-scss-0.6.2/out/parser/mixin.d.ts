import { INode } from '../types/nodes';
import { IMixin } from '../types/symbols';
/**
 * Returns information about Mixin Declaraion.
 */
export declare function makeMixin(node: INode): IMixin;
/**
 * Returns information about set of Variable Declarations.
 */
export declare function makeMixinCollection(node: INode): IMixin[];
