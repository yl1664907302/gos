import type { MaybeComputedElementRef } from './unrefElement';
import type { ConfigurableWindow } from './_configurable';
export interface ResizeObserverSize {
    readonly inlineSize: number;
    readonly blockSize: number;
}
export interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
    readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>;
    readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>;
    readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}
export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void;
export interface UseResizeObserverOptions extends ConfigurableWindow {
    /**
     * Sets which box model the observer will observe changes to. Possible values
     * are `content-box` (the default), `border-box` and `device-pixel-content-box`.
     *
     * @default 'content-box'
     */
    box?: ResizeObserverBoxOptions;
}
declare class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    disconnect(): void;
    observe(target: Element, options?: UseResizeObserverOptions): void;
    unobserve(target: Element): void;
}
/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see https://vueuse.org/useResizeObserver
 * @param target
 * @param callback
 * @param options
 */
export declare function useResizeObserver(target: MaybeComputedElementRef, callback: ResizeObserverCallback, options?: UseResizeObserverOptions): {
    isSupported: import("vue").ShallowRef<boolean, boolean>;
    stop: () => void;
};
export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>;
export {};
