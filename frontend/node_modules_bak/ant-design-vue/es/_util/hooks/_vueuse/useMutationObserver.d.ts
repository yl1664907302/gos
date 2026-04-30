import type { MaybeElementRef } from './unrefElement';
import type { ConfigurableWindow } from './_configurable';
export interface UseMutationObserverOptions extends MutationObserverInit, ConfigurableWindow {
}
/**
 * Watch for changes being made to the DOM tree.
 *
 * @see https://vueuse.org/useMutationObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 * @param target
 * @param callback
 * @param options
 */
export declare function useMutationObserver(target: MaybeElementRef, callback: MutationCallback, options?: UseMutationObserverOptions): {
    isSupported: import("vue").ShallowRef<boolean, boolean>;
    stop: () => void;
};
export type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>;
