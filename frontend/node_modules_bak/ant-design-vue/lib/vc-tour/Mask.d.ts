import type { CSSProperties } from 'vue';
import type { PosInfo } from './hooks/useTarget';
export interface MaskProps {
    prefixCls?: string;
    pos: PosInfo;
    rootClassName?: string;
    showMask?: boolean;
    style?: CSSProperties;
    fill?: string;
    open?: boolean;
    animated?: boolean | {
        placeholder: boolean;
    };
    zIndex?: number;
}
declare const Mask: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
    };
    pos: {
        type: import("vue").PropType<PosInfo>;
        default: PosInfo;
    };
    rootClassName: {
        type: StringConstructor;
    };
    showMask: {
        type: BooleanConstructor;
        default: boolean;
    };
    fill: {
        type: StringConstructor;
        default: string;
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    animated: {
        type: import("vue").PropType<boolean | {
            placeholder: boolean;
        }>;
        default: boolean | {
            placeholder: boolean;
        };
    };
    zIndex: {
        type: NumberConstructor;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
    };
    pos: {
        type: import("vue").PropType<PosInfo>;
        default: PosInfo;
    };
    rootClassName: {
        type: StringConstructor;
    };
    showMask: {
        type: BooleanConstructor;
        default: boolean;
    };
    fill: {
        type: StringConstructor;
        default: string;
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    animated: {
        type: import("vue").PropType<boolean | {
            placeholder: boolean;
        }>;
        default: boolean | {
            placeholder: boolean;
        };
    };
    zIndex: {
        type: NumberConstructor;
    };
}>> & Readonly<{}>, {
    fill: string;
    open: boolean;
    pos: PosInfo;
    showMask: boolean;
    animated: boolean | {
        placeholder: boolean;
    };
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Mask;
