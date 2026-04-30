import type { Ref, ShallowRef } from 'vue';
import type { GetKey } from '../interface';
export type CacheMap = Map<any, number>;
export default function useHeights<T>(mergedData: ShallowRef<any[]>, getKey: GetKey<T>, onItemAdd?: ((item: T) => void) | null, onItemRemove?: ((item: T) => void) | null): [(item: T, instance: HTMLElement) => void, () => void, CacheMap, Ref<Symbol>];
