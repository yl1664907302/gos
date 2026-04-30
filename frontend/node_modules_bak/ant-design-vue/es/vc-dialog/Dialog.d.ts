import type { PropType } from 'vue';
import type ScrollLocker from '../vc-util/Dom/scrollLocker';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    getOpenCount: PropType<() => number>;
    scrollLocker: PropType<ScrollLocker>;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    mask: {
        type: BooleanConstructor;
        default: any;
    };
    afterClose: FunctionConstructor;
    closable: {
        type: BooleanConstructor;
        default: any;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: any;
    };
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    destroyOnClose: {
        type: BooleanConstructor;
        default: any;
    };
    mousePosition: import("vue-types").VueTypeLooseShape<{
        x: number;
        y: number;
    }>;
    title: import("vue-types").VueTypeValidableDef<any>;
    footer: import("vue-types").VueTypeValidableDef<any>;
    transitionName: StringConstructor;
    maskTransitionName: StringConstructor;
    animation: import("vue-types").VueTypeValidableDef<any>;
    maskAnimation: import("vue-types").VueTypeValidableDef<any>;
    wrapStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    bodyStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    maskStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    prefixCls: StringConstructor;
    wrapClassName: StringConstructor;
    rootClassName: StringConstructor;
    width: (StringConstructor | NumberConstructor)[];
    height: (StringConstructor | NumberConstructor)[];
    zIndex: NumberConstructor;
    bodyProps: import("vue-types").VueTypeValidableDef<any>;
    maskProps: import("vue-types").VueTypeValidableDef<any>;
    wrapProps: import("vue-types").VueTypeValidableDef<any>;
    getContainer: import("vue-types").VueTypeValidableDef<any>;
    dialogStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    dialogClass: StringConstructor;
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    focusTriggerAfterClose: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    modalRender: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    getOpenCount: PropType<() => number>;
    scrollLocker: PropType<ScrollLocker>;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    mask: {
        type: BooleanConstructor;
        default: any;
    };
    afterClose: FunctionConstructor;
    closable: {
        type: BooleanConstructor;
        default: any;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: any;
    };
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    destroyOnClose: {
        type: BooleanConstructor;
        default: any;
    };
    mousePosition: import("vue-types").VueTypeLooseShape<{
        x: number;
        y: number;
    }>;
    title: import("vue-types").VueTypeValidableDef<any>;
    footer: import("vue-types").VueTypeValidableDef<any>;
    transitionName: StringConstructor;
    maskTransitionName: StringConstructor;
    animation: import("vue-types").VueTypeValidableDef<any>;
    maskAnimation: import("vue-types").VueTypeValidableDef<any>;
    wrapStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    bodyStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    maskStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    prefixCls: StringConstructor;
    wrapClassName: StringConstructor;
    rootClassName: StringConstructor;
    width: (StringConstructor | NumberConstructor)[];
    height: (StringConstructor | NumberConstructor)[];
    zIndex: NumberConstructor;
    bodyProps: import("vue-types").VueTypeValidableDef<any>;
    maskProps: import("vue-types").VueTypeValidableDef<any>;
    wrapProps: import("vue-types").VueTypeValidableDef<any>;
    getContainer: import("vue-types").VueTypeValidableDef<any>;
    dialogStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    dialogClass: StringConstructor;
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    focusTriggerAfterClose: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    modalRender: FunctionConstructor;
}>> & Readonly<{}>, {
    mask: boolean;
    visible: boolean;
    forceRender: boolean;
    maskClosable: boolean;
    keyboard: boolean;
    closable: boolean;
    bodyStyle: import("vue").CSSProperties;
    maskStyle: import("vue").CSSProperties;
    destroyOnClose: boolean;
    wrapStyle: import("vue").CSSProperties;
    dialogStyle: import("vue").CSSProperties;
    focusTriggerAfterClose: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
