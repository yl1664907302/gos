/**
 * Handle virtual list of the TreeNodes.
 */
import type { FlattenNode, DataEntity, ScrollTo } from './interface';
export declare const MOTION_KEY: string;
export declare const MotionEntity: DataEntity;
export interface NodeListRef {
    scrollTo: ScrollTo;
    getIndentWidth: () => number;
}
/**
 * We only need get visible content items to play the animation.
 */
export declare function getMinimumRangeTransitionRange(list: FlattenNode[], virtual: boolean, height: number, itemHeight: number): FlattenNode[];
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: import("vue").PropType<string>;
    };
    motion: {
        type: import("vue").PropType<any>;
    };
    focusable: {
        type: import("vue").PropType<boolean>;
    };
    activeItem: {
        type: import("vue").PropType<FlattenNode>;
    };
    focused: {
        type: import("vue").PropType<boolean>;
    };
    tabindex: {
        type: import("vue").PropType<number>;
    };
    checkable: {
        type: import("vue").PropType<boolean>;
    };
    selectable: {
        type: import("vue").PropType<boolean>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    height: {
        type: import("vue").PropType<number>;
    };
    itemHeight: {
        type: import("vue").PropType<number>;
    };
    virtual: {
        type: import("vue").PropType<boolean>;
    };
    onScroll: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onKeydown: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onActiveChange: {
        type: import("vue").PropType<(key: import("./interface").Key) => void>;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onListChangeStart: {
        type: import("vue").PropType<() => void>;
    };
    onListChangeEnd: {
        type: import("vue").PropType<() => void>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: import("vue").PropType<string>;
    };
    motion: {
        type: import("vue").PropType<any>;
    };
    focusable: {
        type: import("vue").PropType<boolean>;
    };
    activeItem: {
        type: import("vue").PropType<FlattenNode>;
    };
    focused: {
        type: import("vue").PropType<boolean>;
    };
    tabindex: {
        type: import("vue").PropType<number>;
    };
    checkable: {
        type: import("vue").PropType<boolean>;
    };
    selectable: {
        type: import("vue").PropType<boolean>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    height: {
        type: import("vue").PropType<number>;
    };
    itemHeight: {
        type: import("vue").PropType<number>;
    };
    virtual: {
        type: import("vue").PropType<boolean>;
    };
    onScroll: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onKeydown: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onActiveChange: {
        type: import("vue").PropType<(key: import("./interface").Key) => void>;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onListChangeStart: {
        type: import("vue").PropType<() => void>;
    };
    onListChangeEnd: {
        type: import("vue").PropType<() => void>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
