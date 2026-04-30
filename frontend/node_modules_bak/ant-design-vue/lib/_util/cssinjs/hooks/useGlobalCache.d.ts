import type { KeyType } from '../Cache';
import type { ShallowRef, Ref } from 'vue';
export default function useClientCache<CacheType>(prefix: string, keyPath: Ref<KeyType[]>, cacheFn: () => CacheType, onCacheRemove?: (cache: CacheType, fromHMR: boolean) => void): ShallowRef<CacheType>;
