import type { PropType, Component, CSSProperties } from 'vue';
import type { Key } from '../_util/type';
export type ScrollAlign = 'top' | 'bottom' | 'auto';
export type ScrollConfig = {
    index: number;
    align?: ScrollAlign;
    offset?: number;
} | {
    key: Key;
    align?: ScrollAlign;
    offset?: number;
};
export type ScrollTo = (arg: number | ScrollConfig) => void;
export interface ListState {
    scrollTop: number;
    scrollMoving: boolean;
}
declare const List: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    data: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    height: NumberConstructor;
    itemHeight: NumberConstructor;
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight: {
        type: BooleanConstructor;
        default: any;
    };
    itemKey: {
        type: PropType<Key | ((item: Record<string, any>) => Key)>;
        required: true;
    };
    component: {
        type: PropType<string | Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, {}, any>>;
    };
    /** Set `false` will always use real scroll instead of virtual one */
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    children: FunctionConstructor;
    onScroll: FunctionConstructor;
    onMousedown: FunctionConstructor;
    onMouseenter: FunctionConstructor;
    onVisibleChange: PropType<(visibleList: any[], fullList: any[]) => void>;
}>, {
    state: {
        scrollTop: number;
        scrollMoving: boolean;
    };
    mergedData: import("vue").ShallowRef<any[], any[]>;
    componentStyle: import("vue").ComputedRef<CSSProperties>;
    onFallbackScroll: (e: UIEvent) => void;
    onScrollBar: (newScrollTop: number) => void;
    componentRef: import("vue").ShallowRef<HTMLDivElement, HTMLDivElement>;
    useVirtual: import("vue").ComputedRef<boolean>;
    calRes: {
        scrollHeight?: number;
        start?: number;
        end?: number;
        offset?: number;
    };
    collectHeight: () => void;
    setInstance: (item: Record<string, any>, instance: HTMLElement) => void;
    sharedConfig: {
        getKey: (item: Record<string, any>) => any;
    };
    scrollBarRef: import("vue").ShallowRef<any, any>;
    fillerInnerRef: import("vue").ShallowRef<HTMLDivElement, HTMLDivElement>;
    delayHideScrollBar: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    data: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    height: NumberConstructor;
    itemHeight: NumberConstructor;
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight: {
        type: BooleanConstructor;
        default: any;
    };
    itemKey: {
        type: PropType<Key | ((item: Record<string, any>) => Key)>;
        required: true;
    };
    component: {
        type: PropType<string | Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, {}, any>>;
    };
    /** Set `false` will always use real scroll instead of virtual one */
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    children: FunctionConstructor;
    onScroll: FunctionConstructor;
    onMousedown: FunctionConstructor;
    onMouseenter: FunctionConstructor;
    onVisibleChange: PropType<(visibleList: any[], fullList: any[]) => void>;
}>> & Readonly<{}>, {
    data: unknown[];
    virtual: boolean;
    fullHeight: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default List;
