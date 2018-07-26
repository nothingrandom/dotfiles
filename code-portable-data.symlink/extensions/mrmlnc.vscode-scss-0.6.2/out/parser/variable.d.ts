import { INode } from '../types/nodes';
import { IVariable } from '../types/symbols';
/**
 * Returns information about Variable Declaration.
 */
export declare function makeVariable(node: INode, fromMixin?: string): IVariable;
/**
 * Returns information about set of Variable Declarations.
 */
export declare function makeVariableCollection(node: INode): IVariable[];
