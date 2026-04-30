import type { Fn } from './types';
/**
 * Call onScopeDispose() if it's inside a effect scope lifecycle, if not, do nothing
 *
 * @param fn
 */
export declare function tryOnScopeDispose(fn: Fn): boolean;
