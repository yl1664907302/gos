import type { ExtractPropTypes, HTMLAttributes, PropType } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { Key, VueNode } from '../_util/type';
import RawItem from './RawItem';
declare const RESPONSIVE: "responsive";
declare const INVALIDATE: "invalidate";
declare const overflowProps: () => {
    id: StringConstructor;
    prefixCls: StringConstructor;
    data: ArrayConstructor;
    itemKey: PropType<Key | ((item: any) => Key)>;
    /** Used for `responsive`. It will limit render node to avoid perf issue */
    itemWidth: {
        type: NumberConstructor;
        default: number;
    };
    renderItem: PropType<(item: any) => VueNode>;
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawItem: PropType<(item: any, index: number) => VueNode>;
    maxCount: PropType<number | "responsive" | "invalidate">;
    renderRest: PropType<(items: any[]) => VueNode>;
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawRest: PropType<(items: any[]) => VueNode>;
    suffix: import("vue-types").VueTypeValidableDef<any>;
    component: StringConstructor;
    itemComponent: import("vue-types").VueTypeValidableDef<any>;
    /** @private This API may be refactor since not well design */
    onVisibleChange: PropType<(visibleCount: number) => void>;
    /** When set to `full`, ssr will render full items by default and remove at client side */
    ssr: PropType<"full">;
    onMousedown: PropType<MouseEventHandler>;
    role: StringConstructor;
};
type InterOverflowProps = Partial<ExtractPropTypes<ReturnType<typeof overflowProps>>>;
export type OverflowProps = HTMLAttributes & InterOverflowProps;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        data: ArrayConstructor;
        itemKey: PropType<Key | ((item: any) => Key)>;
        /** Used for `responsive`. It will limit render node to avoid perf issue */
        itemWidth: {
            type: NumberConstructor;
            default: number;
        };
        renderItem: PropType<(item: any) => VueNode>;
        /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
        renderRawItem: PropType<(item: any, index: number) => VueNode>;
        maxCount: PropType<number | "responsive" | "invalidate">;
        renderRest: PropType<(items: any[]) => VueNode>;
        /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
        renderRawRest: PropType<(items: any[]) => VueNode>;
        suffix: import("vue-types").VueTypeValidableDef<any>;
        component: StringConstructor;
        itemComponent: import("vue-types").VueTypeValidableDef<any>;
        /** @private This API may be refactor since not well design */
        onVisibleChange: PropType<(visibleCount: number) => void>;
        /** When set to `full`, ssr will render full items by default and remove at client side */
        ssr: PropType<"full">;
        onMousedown: PropType<MouseEventHandler>;
        role: StringConstructor;
    }>> & Readonly<{
        onVisibleChange?: (...args: any[]) => any;
    }>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "visibleChange"[], import("vue").PublicProps, {
        itemWidth: number;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        data: ArrayConstructor;
        itemKey: PropType<Key | ((item: any) => Key)>;
        /** Used for `responsive`. It will limit render node to avoid perf issue */
        itemWidth: {
            type: NumberConstructor;
            default: number;
        };
        renderItem: PropType<(item: any) => VueNode>;
        /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
        renderRawItem: PropType<(item: any, index: number) => VueNode>;
        maxCount: PropType<number | "responsive" | "invalidate">;
        renderRest: PropType<(items: any[]) => VueNode>;
        /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
        renderRawRest: PropType<(items: any[]) => VueNode>;
        suffix: import("vue-types").VueTypeValidableDef<any>;
        component: StringConstructor;
        itemComponent: import("vue-types").VueTypeValidableDef<any>;
        /** @private This API may be refactor since not well design */
        onVisibleChange: PropType<(visibleCount: number) => void>;
        /** When set to `full`, ssr will render full items by default and remove at client side */
        ssr: PropType<"full">;
        onMousedown: PropType<MouseEventHandler>;
        role: StringConstructor;
    }>> & Readonly<{
        onVisibleChange?: (...args: any[]) => any;
    }>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        itemWidth: number;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    id: StringConstructor;
    prefixCls: StringConstructor;
    data: ArrayConstructor;
    itemKey: PropType<Key | ((item: any) => Key)>;
    /** Used for `responsive`. It will limit render node to avoid perf issue */
    itemWidth: {
        type: NumberConstructor;
        default: number;
    };
    renderItem: PropType<(item: any) => VueNode>;
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawItem: PropType<(item: any, index: number) => VueNode>;
    maxCount: PropType<number | "responsive" | "invalidate">;
    renderRest: PropType<(items: any[]) => VueNode>;
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawRest: PropType<(items: any[]) => VueNode>;
    suffix: import("vue-types").VueTypeValidableDef<any>;
    component: StringConstructor;
    itemComponent: import("vue-types").VueTypeValidableDef<any>;
    /** @private This API may be refactor since not well design */
    onVisibleChange: PropType<(visibleCount: number) => void>;
    /** When set to `full`, ssr will render full items by default and remove at client side */
    ssr: PropType<"full">;
    onMousedown: PropType<MouseEventHandler>;
    role: StringConstructor;
}>> & Readonly<{
    onVisibleChange?: (...args: any[]) => any;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "visibleChange"[], "visibleChange", {
    itemWidth: number;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    readonly Item: typeof RawItem;
    readonly RESPONSIVE: typeof RESPONSIVE;
    readonly INVALIDATE: typeof INVALIDATE;
};
export default _default;
