import type { Ref } from 'vue';
type MaybeRef<T> = T | Ref<T>;
/**
 * Converts ref to reactive.
 *
 * @see https://vueuse.org/toReactive
 * @param objectRef A ref of object
 */
export declare function toReactive<T extends object>(objectRef: MaybeRef<T>): T;
export {};
