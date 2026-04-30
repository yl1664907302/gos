import type { Fn } from './types';
/**
 * Call onMounted() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 */
export declare function tryOnMounted(fn: Fn, sync?: boolean): void;
