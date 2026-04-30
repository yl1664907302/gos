import type { CSSProperties, PropType } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
export type ContentRef = {
    focus: () => void;
    changeActive: (next: boolean) => void;
};
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    motionName: StringConstructor;
    ariaId: StringConstructor;
    onVisibleChanged: PropType<(visible: boolean) => void>;
    onMousedown: PropType<MouseEventHandler>;
    onMouseup: PropType<MouseEventHandler>;
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
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maskStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
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
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    dialogClass: StringConstructor;
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getOpenCount: PropType<() => number>;
    focusTriggerAfterClose: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    modalRender: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    motionName: StringConstructor;
    ariaId: StringConstructor;
    onVisibleChanged: PropType<(visible: boolean) => void>;
    onMousedown: PropType<MouseEventHandler>;
    onMouseup: PropType<MouseEventHandler>;
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
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maskStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
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
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    dialogClass: StringConstructor;
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getOpenCount: PropType<() => number>;
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
    bodyStyle: CSSProperties;
    maskStyle: CSSProperties;
    destroyOnClose: boolean;
    wrapStyle: CSSProperties;
    dialogStyle: CSSProperties;
    focusTriggerAfterClose: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
