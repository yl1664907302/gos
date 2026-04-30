import type { VNode, PropType } from 'vue';
import { type IDialogChildProps } from '../../vc-dialog/IDialogPropTypes';
export interface PreviewProps extends Omit<IDialogChildProps, 'onClose' | 'mask'> {
    onClose?: (e: Element) => void;
    src?: string;
    alt?: string;
    rootClassName?: string;
    icons?: {
        rotateLeft?: VNode;
        rotateRight?: VNode;
        zoomIn?: VNode;
        zoomOut?: VNode;
        close?: VNode;
        left?: VNode;
        right?: VNode;
        flipX?: VNode;
        flipY?: VNode;
    };
}
export declare const previewProps: {
    src: StringConstructor;
    alt: StringConstructor;
    rootClassName: StringConstructor;
    icons: {
        type: PropType<{
            rotateLeft?: VNode;
            rotateRight?: VNode;
            zoomIn?: VNode;
            zoomOut?: VNode;
            close?: VNode;
            left?: VNode;
            right?: VNode;
            flipX?: VNode;
            flipY?: VNode;
        }>;
        default: () => {
            rotateLeft?: VNode;
            rotateRight?: VNode;
            zoomIn?: VNode;
            zoomOut?: VNode;
            close?: VNode;
            left?: VNode;
            right?: VNode;
            flipX?: VNode;
            flipY?: VNode;
        };
    };
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
    getOpenCount: PropType<() => number>;
    focusTriggerAfterClose: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    modalRender: FunctionConstructor;
};
declare const Preview: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    src: StringConstructor;
    alt: StringConstructor;
    rootClassName: StringConstructor;
    icons: {
        type: PropType<{
            rotateLeft?: VNode;
            rotateRight?: VNode;
            zoomIn?: VNode;
            zoomOut?: VNode;
            close?: VNode;
            left?: VNode;
            right?: VNode;
            flipX?: VNode;
            flipY?: VNode;
        }>;
        default: () => {
            rotateLeft?: VNode;
            rotateRight?: VNode;
            zoomIn?: VNode;
            zoomOut?: VNode;
            close?: VNode;
            left?: VNode;
            right?: VNode;
            flipX?: VNode;
            flipY?: VNode;
        };
    };
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
    getOpenCount: PropType<() => number>;
    focusTriggerAfterClose: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    modalRender: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("close" | "afterClose")[], "close" | "afterClose", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    src: StringConstructor;
    alt: StringConstructor;
    rootClassName: StringConstructor;
    icons: {
        type: PropType<{
            rotateLeft?: VNode;
            rotateRight?: VNode;
            zoomIn?: VNode;
            zoomOut?: VNode;
            close?: VNode;
            left?: VNode;
            right?: VNode;
            flipX?: VNode;
            flipY?: VNode;
        }>;
        default: () => {
            rotateLeft?: VNode;
            rotateRight?: VNode;
            zoomIn?: VNode;
            zoomOut?: VNode;
            close?: VNode;
            left?: VNode;
            right?: VNode;
            flipX?: VNode;
            flipY?: VNode;
        };
    };
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
    getOpenCount: PropType<() => number>;
    focusTriggerAfterClose: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    modalRender: FunctionConstructor;
}>> & Readonly<{
    onClose?: (...args: any[]) => any;
    onAfterClose?: (...args: any[]) => any;
}>, {
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
    icons: {
        rotateLeft?: VNode;
        rotateRight?: VNode;
        zoomIn?: VNode;
        zoomOut?: VNode;
        close?: VNode;
        left?: VNode;
        right?: VNode;
        flipX?: VNode;
        flipY?: VNode;
    };
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Preview;
