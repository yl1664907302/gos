import type { MaybeComputedRef } from './types';
/**
 * Get the value of value/ref/getter.
 */
export declare function resolveUnref<T>(r: MaybeComputedRef<T>): T;
