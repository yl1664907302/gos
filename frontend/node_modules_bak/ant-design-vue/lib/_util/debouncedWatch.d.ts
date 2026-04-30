import type { Ref, WatchOptions, WatchStopHandle } from 'vue';
type MaybeRef<T> = T | Ref<T>;
type Fn = () => void;
export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;
export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
    fn: FunctionArgs<Args, This>;
    args: Args;
    thisArg: This;
}
export type EventFilter<Args extends any[] = any[], This = any> = (invoke: Fn, options: FunctionWrapperOptions<Args, This>) => void;
/**
 * Create an EventFilter that debounce the events
 *
 * @param ms
 */
export declare function debounceFilter(ms: MaybeRef<number>): EventFilter<any[], any>;
export interface DebouncedWatchOptions<Immediate> extends WatchOptions<Immediate> {
    debounce?: MaybeRef<number>;
}
interface ConfigurableEventFilter {
    eventFilter?: EventFilter;
}
export interface WatchWithFilterOptions<Immediate> extends WatchOptions<Immediate>, ConfigurableEventFilter {
}
export declare function watchWithFilter<Immediate extends Readonly<boolean> = false>(source: any, cb: any, options?: WatchWithFilterOptions<Immediate>): WatchStopHandle;
export default function debouncedWatch<Immediate extends Readonly<boolean> = false>(source: any, cb: any, options?: DebouncedWatchOptions<Immediate>): WatchStopHandle;
export {};
