import type { Ref } from 'vue';
type Updater<T> = (prev: T) => T;
export default function useSyncState<T>(defaultState: T, onChange: (newValue: T, prevValue: T) => void): [Ref<T>, (updater: T | Updater<T>) => void];
export {};
