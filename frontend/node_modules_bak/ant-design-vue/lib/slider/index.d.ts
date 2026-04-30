import type { CSSProperties, VNodeTypes, ExtractPropTypes } from 'vue';
import type { VueNode, CustomSlotsType } from '../_util/type';
import type { TooltipPlacement } from '../tooltip/Tooltip';
import type { FocusEventHandler } from '../_util/EventInterface';
export type SliderValue = number | [number, number];
export interface SliderMarks {
    [key: number]: VueNode | {
        style: CSSProperties;
        label: any;
    };
}
interface HandleGeneratorInfo {
    value?: number;
    dragging?: boolean;
    index: number;
}
export interface SliderRange {
    draggableTrack?: boolean;
}
export type HandleGeneratorFn = (config: {
    tooltipPrefixCls?: string;
    prefixCls?: string;
    info: HandleGeneratorInfo;
}) => VNodeTypes;
type Value = [number, number] | number;
export declare const sliderProps: () => {
    id: StringConstructor;
    prefixCls: StringConstructor;
    tooltipPrefixCls: StringConstructor;
    range: {
        type: import("vue").PropType<boolean | SliderRange>;
        default: boolean | SliderRange;
    };
    reverse: {
        type: BooleanConstructor;
        default: boolean;
    };
    min: NumberConstructor;
    max: NumberConstructor;
    step: {
        type: import("vue").PropType<number>;
        default: number;
    };
    marks: {
        type: import("vue").PropType<SliderMarks>;
        default: SliderMarks;
    };
    dots: {
        type: BooleanConstructor;
        default: boolean;
    };
    value: {
        type: import("vue").PropType<Value>;
        default: Value;
    };
    defaultValue: {
        type: import("vue").PropType<Value>;
        default: Value;
    };
    included: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
    tipFormatter: {
        type: import("vue").PropType<(value?: number) => any>;
        default: (value?: number) => any;
    };
    tooltipOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** @deprecated `tooltipVisible` is deprecated. Please use `tooltipOpen` instead. */
    tooltipVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    tooltipPlacement: {
        type: import("vue").PropType<TooltipPlacement>;
        default: TooltipPlacement;
    };
    getTooltipPopupContainer: {
        type: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
        default: (triggerNode: HTMLElement) => HTMLElement;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    handleStyle: {
        type: import("vue").PropType<CSSProperties | CSSProperties[]>;
        default: CSSProperties | CSSProperties[];
    };
    trackStyle: {
        type: import("vue").PropType<CSSProperties | CSSProperties[]>;
        default: CSSProperties | CSSProperties[];
    };
    onChange: {
        type: import("vue").PropType<(value: Value) => void>;
        default: (value: Value) => void;
    };
    onAfterChange: {
        type: import("vue").PropType<(value: Value) => void>;
        default: (value: Value) => void;
    };
    onFocus: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: Value) => void>;
        default: (value: Value) => void;
    };
};
export type SliderProps = Partial<ExtractPropTypes<ReturnType<typeof sliderProps>>>;
export type Visibles = {
    [index: number]: boolean;
};
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        tooltipPrefixCls: StringConstructor;
        range: {
            type: import("vue").PropType<boolean | SliderRange>;
            default: boolean | SliderRange;
        };
        reverse: {
            type: BooleanConstructor;
            default: boolean;
        };
        min: NumberConstructor;
        max: NumberConstructor;
        step: {
            type: import("vue").PropType<number>;
            default: number;
        };
        marks: {
            type: import("vue").PropType<SliderMarks>;
            default: SliderMarks;
        };
        dots: {
            type: BooleanConstructor;
            default: boolean;
        };
        value: {
            type: import("vue").PropType<Value>;
            default: Value;
        };
        defaultValue: {
            type: import("vue").PropType<Value>;
            default: Value;
        };
        included: {
            type: BooleanConstructor;
            default: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        vertical: {
            type: BooleanConstructor;
            default: boolean;
        };
        tipFormatter: {
            type: import("vue").PropType<(value?: number) => any>;
            default: (value?: number) => any;
        };
        tooltipOpen: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** @deprecated `tooltipVisible` is deprecated. Please use `tooltipOpen` instead. */
        tooltipVisible: {
            type: BooleanConstructor;
            default: boolean;
        };
        tooltipPlacement: {
            type: import("vue").PropType<TooltipPlacement>;
            default: TooltipPlacement;
        };
        getTooltipPopupContainer: {
            type: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
            default: (triggerNode: HTMLElement) => HTMLElement;
        };
        autofocus: {
            type: BooleanConstructor;
            default: boolean;
        };
        handleStyle: {
            type: import("vue").PropType<CSSProperties | CSSProperties[]>;
            default: CSSProperties | CSSProperties[];
        };
        trackStyle: {
            type: import("vue").PropType<CSSProperties | CSSProperties[]>;
            default: CSSProperties | CSSProperties[];
        };
        onChange: {
            type: import("vue").PropType<(value: Value) => void>;
            default: (value: Value) => void;
        };
        onAfterChange: {
            type: import("vue").PropType<(value: Value) => void>;
            default: (value: Value) => void;
        };
        onFocus: {
            type: import("vue").PropType<FocusEventHandler>;
            default: FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<FocusEventHandler>;
            default: FocusEventHandler;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: Value) => void>;
            default: (value: Value) => void;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        value: Value;
        vertical: boolean;
        trackStyle: CSSProperties | CSSProperties[];
        dots: boolean;
        reverse: boolean;
        onFocus: FocusEventHandler;
        onBlur: FocusEventHandler;
        onChange: (value: Value) => void;
        range: boolean | SliderRange;
        disabled: boolean;
        autofocus: boolean;
        defaultValue: Value;
        'onUpdate:value': (value: Value) => void;
        step: number;
        included: boolean;
        marks: SliderMarks;
        handleStyle: CSSProperties | CSSProperties[];
        onAfterChange: (value: Value) => void;
        tipFormatter: (value?: number) => any;
        tooltipOpen: boolean;
        tooltipVisible: boolean;
        tooltipPlacement: TooltipPlacement;
        getTooltipPopupContainer: (triggerNode: HTMLElement) => HTMLElement;
    }, true, {}, CustomSlotsType<{
        mark?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        tooltipPrefixCls: StringConstructor;
        range: {
            type: import("vue").PropType<boolean | SliderRange>;
            default: boolean | SliderRange;
        };
        reverse: {
            type: BooleanConstructor;
            default: boolean;
        };
        min: NumberConstructor;
        max: NumberConstructor;
        step: {
            type: import("vue").PropType<number>;
            default: number;
        };
        marks: {
            type: import("vue").PropType<SliderMarks>;
            default: SliderMarks;
        };
        dots: {
            type: BooleanConstructor;
            default: boolean;
        };
        value: {
            type: import("vue").PropType<Value>;
            default: Value;
        };
        defaultValue: {
            type: import("vue").PropType<Value>;
            default: Value;
        };
        included: {
            type: BooleanConstructor;
            default: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        vertical: {
            type: BooleanConstructor;
            default: boolean;
        };
        tipFormatter: {
            type: import("vue").PropType<(value?: number) => any>;
            default: (value?: number) => any;
        };
        tooltipOpen: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** @deprecated `tooltipVisible` is deprecated. Please use `tooltipOpen` instead. */
        tooltipVisible: {
            type: BooleanConstructor;
            default: boolean;
        };
        tooltipPlacement: {
            type: import("vue").PropType<TooltipPlacement>;
            default: TooltipPlacement;
        };
        getTooltipPopupContainer: {
            type: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
            default: (triggerNode: HTMLElement) => HTMLElement;
        };
        autofocus: {
            type: BooleanConstructor;
            default: boolean;
        };
        handleStyle: {
            type: import("vue").PropType<CSSProperties | CSSProperties[]>;
            default: CSSProperties | CSSProperties[];
        };
        trackStyle: {
            type: import("vue").PropType<CSSProperties | CSSProperties[]>;
            default: CSSProperties | CSSProperties[];
        };
        onChange: {
            type: import("vue").PropType<(value: Value) => void>;
            default: (value: Value) => void;
        };
        onAfterChange: {
            type: import("vue").PropType<(value: Value) => void>;
            default: (value: Value) => void;
        };
        onFocus: {
            type: import("vue").PropType<FocusEventHandler>;
            default: FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<FocusEventHandler>;
            default: FocusEventHandler;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: Value) => void>;
            default: (value: Value) => void;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, {
        value: Value;
        vertical: boolean;
        trackStyle: CSSProperties | CSSProperties[];
        dots: boolean;
        reverse: boolean;
        onFocus: FocusEventHandler;
        onBlur: FocusEventHandler;
        onChange: (value: Value) => void;
        range: boolean | SliderRange;
        disabled: boolean;
        autofocus: boolean;
        defaultValue: Value;
        'onUpdate:value': (value: Value) => void;
        step: number;
        included: boolean;
        marks: SliderMarks;
        handleStyle: CSSProperties | CSSProperties[];
        onAfterChange: (value: Value) => void;
        tipFormatter: (value?: number) => any;
        tooltipOpen: boolean;
        tooltipVisible: boolean;
        tooltipPlacement: TooltipPlacement;
        getTooltipPopupContainer: (triggerNode: HTMLElement) => HTMLElement;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    id: StringConstructor;
    prefixCls: StringConstructor;
    tooltipPrefixCls: StringConstructor;
    range: {
        type: import("vue").PropType<boolean | SliderRange>;
        default: boolean | SliderRange;
    };
    reverse: {
        type: BooleanConstructor;
        default: boolean;
    };
    min: NumberConstructor;
    max: NumberConstructor;
    step: {
        type: import("vue").PropType<number>;
        default: number;
    };
    marks: {
        type: import("vue").PropType<SliderMarks>;
        default: SliderMarks;
    };
    dots: {
        type: BooleanConstructor;
        default: boolean;
    };
    value: {
        type: import("vue").PropType<Value>;
        default: Value;
    };
    defaultValue: {
        type: import("vue").PropType<Value>;
        default: Value;
    };
    included: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
    tipFormatter: {
        type: import("vue").PropType<(value?: number) => any>;
        default: (value?: number) => any;
    };
    tooltipOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** @deprecated `tooltipVisible` is deprecated. Please use `tooltipOpen` instead. */
    tooltipVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    tooltipPlacement: {
        type: import("vue").PropType<TooltipPlacement>;
        default: TooltipPlacement;
    };
    getTooltipPopupContainer: {
        type: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
        default: (triggerNode: HTMLElement) => HTMLElement;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    handleStyle: {
        type: import("vue").PropType<CSSProperties | CSSProperties[]>;
        default: CSSProperties | CSSProperties[];
    };
    trackStyle: {
        type: import("vue").PropType<CSSProperties | CSSProperties[]>;
        default: CSSProperties | CSSProperties[];
    };
    onChange: {
        type: import("vue").PropType<(value: Value) => void>;
        default: (value: Value) => void;
    };
    onAfterChange: {
        type: import("vue").PropType<(value: Value) => void>;
        default: (value: Value) => void;
    };
    onFocus: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: Value) => void>;
        default: (value: Value) => void;
    };
}>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    value: Value;
    vertical: boolean;
    trackStyle: CSSProperties | CSSProperties[];
    dots: boolean;
    reverse: boolean;
    onFocus: FocusEventHandler;
    onBlur: FocusEventHandler;
    onChange: (value: Value) => void;
    range: boolean | SliderRange;
    disabled: boolean;
    autofocus: boolean;
    defaultValue: Value;
    'onUpdate:value': (value: Value) => void;
    step: number;
    included: boolean;
    marks: SliderMarks;
    handleStyle: CSSProperties | CSSProperties[];
    onAfterChange: (value: Value) => void;
    tipFormatter: (value?: number) => any;
    tooltipOpen: boolean;
    tooltipVisible: boolean;
    tooltipPlacement: TooltipPlacement;
    getTooltipPopupContainer: (triggerNode: HTMLElement) => HTMLElement;
}, {}, string, CustomSlotsType<{
    mark?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
