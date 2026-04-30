import type { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    disabled: BooleanConstructor;
    onResize: PropType<(size: {
        width: number;
        height: number;
        offsetWidth: number;
        offsetHeight: number;
    }, element: HTMLElement) => void>;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "resize"[], "resize", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: BooleanConstructor;
    onResize: PropType<(size: {
        width: number;
        height: number;
        offsetWidth: number;
        offsetHeight: number;
    }, element: HTMLElement) => void>;
}>> & Readonly<{
    onResize?: (...args: any[]) => any;
}>, {
    disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
