import type { ComputedRef } from 'vue';
export declare type ComputedGetter<T> = (...args: any[]) => T;
export default function eagerComputed<T>(fn: ComputedGetter<T>): ComputedRef<T>;
