import type { ValueType } from './utils/MiniDecimal';
import type { KeyboardEventHandler } from '../../_util/EventInterface';
import type { CustomSlotsType } from '../../_util/type';
export declare const inputNumberProps: () => {
    /** value will show as string */
    stringMode: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultValue: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    value: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    min: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    max: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    step: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    tabindex: NumberConstructor;
    controls: {
        type: BooleanConstructor;
        default: boolean;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    keyboard: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Parse display value to validate number */
    parser: {
        type: import("vue").PropType<(displayValue: string | undefined) => ValueType>;
        default: (displayValue: string | undefined) => ValueType;
    };
    /** Transform `value` to display value show in input */
    formatter: {
        type: import("vue").PropType<(value: ValueType | undefined, info: {
            userTyping: boolean;
            input: string;
        }) => string>;
        default: (value: ValueType | undefined, info: {
            userTyping: boolean;
            input: string;
        }) => string;
    };
    /** Syntactic sugar of `formatter`. Config precision of display. */
    precision: NumberConstructor;
    /** Syntactic sugar of `formatter`. Config decimal separator of display. */
    decimalSeparator: StringConstructor;
    onInput: {
        type: import("vue").PropType<(text: string) => void>;
        default: (text: string) => void;
    };
    onChange: {
        type: import("vue").PropType<(value: ValueType) => void>;
        default: (value: ValueType) => void;
    };
    onPressEnter: {
        type: import("vue").PropType<KeyboardEventHandler>;
        default: KeyboardEventHandler;
    };
    onStep: {
        type: import("vue").PropType<(value: ValueType, info: {
            offset: ValueType;
            type: 'up' | 'down';
        }) => void>;
        default: (value: ValueType, info: {
            offset: ValueType;
            type: 'up' | 'down';
        }) => void;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
        default: (e: FocusEvent) => void;
    };
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
        default: (e: FocusEvent) => void;
    };
};
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    lazy: BooleanConstructor;
    /** value will show as string */
    stringMode: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultValue: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    value: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    min: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    max: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    step: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    tabindex: NumberConstructor;
    controls: {
        type: BooleanConstructor;
        default: boolean;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    keyboard: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Parse display value to validate number */
    parser: {
        type: import("vue").PropType<(displayValue: string) => ValueType>;
        default: (displayValue: string) => ValueType;
    };
    /** Transform `value` to display value show in input */
    formatter: {
        type: import("vue").PropType<(value: ValueType, info: {
            userTyping: boolean;
            input: string;
        }) => string>;
        default: (value: ValueType, info: {
            userTyping: boolean;
            input: string;
        }) => string;
    };
    /** Syntactic sugar of `formatter`. Config precision of display. */
    precision: NumberConstructor;
    /** Syntactic sugar of `formatter`. Config decimal separator of display. */
    decimalSeparator: StringConstructor;
    onInput: {
        type: import("vue").PropType<(text: string) => void>;
        default: (text: string) => void;
    };
    onChange: {
        type: import("vue").PropType<(value: ValueType) => void>;
        default: (value: ValueType) => void;
    };
    onPressEnter: {
        type: import("vue").PropType<KeyboardEventHandler>;
        default: KeyboardEventHandler;
    };
    onStep: {
        type: import("vue").PropType<(value: ValueType, info: {
            offset: ValueType;
            type: "up" | "down";
        }) => void>;
        default: (value: ValueType, info: {
            offset: ValueType;
            type: "up" | "down";
        }) => void;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
        default: (e: FocusEvent) => void;
    };
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
        default: (e: FocusEvent) => void;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    lazy: BooleanConstructor;
    /** value will show as string */
    stringMode: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultValue: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    value: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    min: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    max: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    step: {
        type: import("vue").PropType<ValueType>;
        default: ValueType;
    };
    tabindex: NumberConstructor;
    controls: {
        type: BooleanConstructor;
        default: boolean;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    keyboard: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Parse display value to validate number */
    parser: {
        type: import("vue").PropType<(displayValue: string) => ValueType>;
        default: (displayValue: string) => ValueType;
    };
    /** Transform `value` to display value show in input */
    formatter: {
        type: import("vue").PropType<(value: ValueType, info: {
            userTyping: boolean;
            input: string;
        }) => string>;
        default: (value: ValueType, info: {
            userTyping: boolean;
            input: string;
        }) => string;
    };
    /** Syntactic sugar of `formatter`. Config precision of display. */
    precision: NumberConstructor;
    /** Syntactic sugar of `formatter`. Config decimal separator of display. */
    decimalSeparator: StringConstructor;
    onInput: {
        type: import("vue").PropType<(text: string) => void>;
        default: (text: string) => void;
    };
    onChange: {
        type: import("vue").PropType<(value: ValueType) => void>;
        default: (value: ValueType) => void;
    };
    onPressEnter: {
        type: import("vue").PropType<KeyboardEventHandler>;
        default: KeyboardEventHandler;
    };
    onStep: {
        type: import("vue").PropType<(value: ValueType, info: {
            offset: ValueType;
            type: "up" | "down";
        }) => void>;
        default: (value: ValueType, info: {
            offset: ValueType;
            type: "up" | "down";
        }) => void;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
        default: (e: FocusEvent) => void;
    };
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
        default: (e: FocusEvent) => void;
    };
}>> & Readonly<{}>, {
    value: ValueType;
    onFocus: (e: FocusEvent) => void;
    onBlur: (e: FocusEvent) => void;
    onChange: (value: ValueType) => void;
    onInput: (text: string) => void;
    disabled: boolean;
    max: ValueType;
    min: ValueType;
    prefixCls: string;
    autofocus: boolean;
    readonly: boolean;
    defaultValue: ValueType;
    step: ValueType;
    lazy: boolean;
    onPressEnter: KeyboardEventHandler;
    keyboard: boolean;
    onStep: (value: ValueType, info: {
        offset: ValueType;
        type: "up" | "down";
    }) => void;
    stringMode: boolean;
    controls: boolean;
    parser: (displayValue: string) => ValueType;
    formatter: (value: ValueType, info: {
        userTyping: boolean;
        input: string;
    }) => string;
}, CustomSlotsType<{
    upHandler: any;
    downHandler: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
