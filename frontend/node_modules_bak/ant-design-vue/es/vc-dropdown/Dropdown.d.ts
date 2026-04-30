import type { CSSProperties, PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    minOverlayWidthMatchTrigger: {
        type: BooleanConstructor;
        default: any;
    };
    arrow: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    transitionName: StringConstructor;
    overlayClassName: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    openClassName: StringConstructor;
    animation: import("vue-types").VueTypeValidableDef<any>;
    align: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    overlayStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    placement: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    overlay: import("vue-types").VueTypeValidableDef<any>;
    trigger: import("vue-types").VueTypeDef<string | string[]> & {
        default: string | (() => string[]);
    };
    alignPoint: {
        type: BooleanConstructor;
        default: any;
    };
    showAction: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    hideAction: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    getPopupContainer: FunctionConstructor;
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    defaultVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    mouseEnterDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    mouseLeaveDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("visibleChange" | "overlayClick")[], "visibleChange" | "overlayClick", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    minOverlayWidthMatchTrigger: {
        type: BooleanConstructor;
        default: any;
    };
    arrow: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    transitionName: StringConstructor;
    overlayClassName: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    openClassName: StringConstructor;
    animation: import("vue-types").VueTypeValidableDef<any>;
    align: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    overlayStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    placement: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    overlay: import("vue-types").VueTypeValidableDef<any>;
    trigger: import("vue-types").VueTypeDef<string | string[]> & {
        default: string | (() => string[]);
    };
    alignPoint: {
        type: BooleanConstructor;
        default: any;
    };
    showAction: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    hideAction: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    getPopupContainer: FunctionConstructor;
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    defaultVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    mouseEnterDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    mouseLeaveDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
}>> & Readonly<{
    onVisibleChange?: (...args: any[]) => any;
    onOverlayClick?: (...args: any[]) => any;
}>, {
    visible: boolean;
    trigger: string | string[];
    prefixCls: string;
    align: {
        [key: string]: any;
    };
    showAction: unknown[];
    hideAction: unknown[];
    arrow: boolean;
    mouseEnterDelay: number;
    mouseLeaveDelay: number;
    alignPoint: boolean;
    overlayClassName: string;
    defaultVisible: boolean;
    placement: string;
    overlayStyle: CSSProperties;
    minOverlayWidthMatchTrigger: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
