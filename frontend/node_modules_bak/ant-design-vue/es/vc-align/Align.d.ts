import type { PropType } from 'vue';
import type { AlignType, AlignResult, TargetType } from './interface';
type OnAlign = (source: HTMLElement, result: AlignResult) => void;
export interface AlignProps {
    align: AlignType;
    target: TargetType;
    onAlign?: OnAlign;
    monitorBufferTime?: number;
    monitorWindowResize?: boolean;
    disabled?: boolean;
}
export declare const alignProps: {
    align: PropType<AlignType>;
    target: PropType<TargetType>;
    onAlign: PropType<OnAlign>;
    monitorBufferTime: NumberConstructor;
    monitorWindowResize: BooleanConstructor;
    disabled: BooleanConstructor;
};
export interface RefAlign {
    forceAlign: () => void;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    align: PropType<AlignType>;
    target: PropType<TargetType>;
    onAlign: PropType<OnAlign>;
    monitorBufferTime: NumberConstructor;
    monitorWindowResize: BooleanConstructor;
    disabled: BooleanConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "align"[], "align", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    align: PropType<AlignType>;
    target: PropType<TargetType>;
    onAlign: PropType<OnAlign>;
    monitorBufferTime: NumberConstructor;
    monitorWindowResize: BooleanConstructor;
    disabled: BooleanConstructor;
}>> & Readonly<{
    onAlign?: (...args: any[]) => any;
}>, {
    disabled: boolean;
    monitorWindowResize: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
