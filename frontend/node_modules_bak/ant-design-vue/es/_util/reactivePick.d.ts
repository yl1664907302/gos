import type { UnwrapRef } from 'vue';
/**
 * Reactively pick fields from a reactive object
 *
 * @see https://vueuse.js.org/reactivePick
 */
export declare function reactivePick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): {
    [S in K]: UnwrapRef<T[S]>;
};
