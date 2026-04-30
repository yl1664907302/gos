export type BindElement = HTMLElement | Window | null | undefined;
export declare function getTargetRect(target: BindElement): DOMRect;
export declare function getFixedTop(placeholderRect: DOMRect, targetRect: DOMRect, offsetTop: number): string;
export declare function getFixedBottom(placeholderRect: DOMRect, targetRect: DOMRect, offsetBottom: number): string;
interface ObserverEntity {
    target: HTMLElement | Window;
    affixList: any[];
    eventHandlers: {
        [eventName: string]: any;
    };
}
export declare function getObserverEntities(): ObserverEntity[];
export declare function addObserveTarget<T>(target: HTMLElement | Window | null, affix: T): void;
export declare function removeObserveTarget<T>(affix: T): void;
export {};
