import type { ComponentPublicInstance, CSSProperties, ExtractPropTypes, PropType } from 'vue';
declare function getDefaultTarget(): Window & typeof globalThis;
declare enum AffixStatus {
    None = 0,
    Prepare = 1
}
export interface AffixState {
    affixStyle?: CSSProperties;
    placeholderStyle?: CSSProperties;
    status: AffixStatus;
    lastAffix: boolean;
    prevTarget: Window | HTMLElement | null;
}
export declare const affixProps: () => {
    /**
     * 距离窗口顶部达到指定偏移量后触发
     */
    offsetTop: NumberConstructor;
    /** 距离窗口底部达到指定偏移量后触发 */
    offsetBottom: NumberConstructor;
    /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
    target: {
        type: PropType<() => Window | HTMLElement | null>;
        default: typeof getDefaultTarget;
    };
    prefixCls: StringConstructor;
    /** 固定状态改变时触发的回调函数 */
    onChange: PropType<(lastAffix: boolean) => void>;
    onTestUpdatePosition: PropType<() => void>;
};
export type AffixProps = Partial<ExtractPropTypes<ReturnType<typeof affixProps>>>;
export type AffixEmits = {
    change: (lastAffix: boolean) => void;
    testUpdatePosition: () => void;
};
export type AffixExpose = {
    updatePosition: (...args: any[]) => void;
    lazyUpdatePosition: (...args: any[]) => void;
};
export type AffixInstance = ComponentPublicInstance<AffixProps, AffixExpose>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        /**
         * 距离窗口顶部达到指定偏移量后触发
         */
        offsetTop: NumberConstructor;
        /** 距离窗口底部达到指定偏移量后触发 */
        offsetBottom: NumberConstructor;
        /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
        target: {
            type: PropType<() => Window | HTMLElement>;
            default: typeof getDefaultTarget;
        };
        prefixCls: StringConstructor;
        /** 固定状态改变时触发的回调函数 */
        onChange: PropType<(lastAffix: boolean) => void>;
        onTestUpdatePosition: PropType<() => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        target: () => Window | HTMLElement;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        /**
         * 距离窗口顶部达到指定偏移量后触发
         */
        offsetTop: NumberConstructor;
        /** 距离窗口底部达到指定偏移量后触发 */
        offsetBottom: NumberConstructor;
        /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
        target: {
            type: PropType<() => Window | HTMLElement>;
            default: typeof getDefaultTarget;
        };
        prefixCls: StringConstructor;
        /** 固定状态改变时触发的回调函数 */
        onChange: PropType<(lastAffix: boolean) => void>;
        onTestUpdatePosition: PropType<() => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        target: () => Window | HTMLElement;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    /**
     * 距离窗口顶部达到指定偏移量后触发
     */
    offsetTop: NumberConstructor;
    /** 距离窗口底部达到指定偏移量后触发 */
    offsetBottom: NumberConstructor;
    /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
    target: {
        type: PropType<() => Window | HTMLElement>;
        default: typeof getDefaultTarget;
    };
    prefixCls: StringConstructor;
    /** 固定状态改变时触发的回调函数 */
    onChange: PropType<(lastAffix: boolean) => void>;
    onTestUpdatePosition: PropType<() => void>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    target: () => Window | HTMLElement;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
