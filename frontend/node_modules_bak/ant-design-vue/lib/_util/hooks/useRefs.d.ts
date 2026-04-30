import type { Ref, ComponentPublicInstance } from 'vue';
import type { Key } from '../type';
type RefType = HTMLElement | ComponentPublicInstance;
export type RefsValue = Map<Key, RefType>;
type UseRef = [(key: Key) => (el: RefType) => void, Ref<RefsValue>];
declare const useRefs: () => UseRef;
export default useRefs;
