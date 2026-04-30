import type { PropType } from 'vue';
export interface BaseInputInnerExpose {
    focus: () => void;
    blur: () => void;
    input: HTMLInputElement | HTMLTextAreaElement | null;
    setSelectionRange: (start: number, end: number, direction?: 'forward' | 'backward' | 'none') => void;
    select: () => void;
    getSelectionStart: () => number | null;
    getSelectionEnd: () => number | null;
    getScrollTop: () => number | null;
    setScrollTop: (scrollTop: number) => void;
}
declare const BaseInputInner: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    disabled: import("vue-types").VueTypeValidableDef<boolean>;
    type: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    tag: {
        type: PropType<"input" | "textarea">;
        default: string;
    };
    size: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    onChange: PropType<(e: Event) => void>;
    onInput: PropType<(e: Event) => void>;
    onBlur: PropType<(e: Event) => void>;
    onFocus: PropType<(e: Event) => void>;
    onKeydown: PropType<(e: Event) => void>;
    onCompositionstart: PropType<(e: Event) => void>;
    onCompositionend: PropType<(e: Event) => void>;
    onKeyup: PropType<(e: Event) => void>;
    onPaste: PropType<(e: Event) => void>;
    onMousedown: PropType<(e: Event) => void>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("blur" | "change" | "compositionend" | "compositionstart" | "focus" | "input" | "keydown" | "keyup" | "mousedown" | "paste")[], "blur" | "change" | "compositionend" | "compositionstart" | "focus" | "input" | "keydown" | "keyup" | "mousedown" | "paste", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: import("vue-types").VueTypeValidableDef<boolean>;
    type: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    tag: {
        type: PropType<"input" | "textarea">;
        default: string;
    };
    size: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    onChange: PropType<(e: Event) => void>;
    onInput: PropType<(e: Event) => void>;
    onBlur: PropType<(e: Event) => void>;
    onFocus: PropType<(e: Event) => void>;
    onKeydown: PropType<(e: Event) => void>;
    onCompositionstart: PropType<(e: Event) => void>;
    onCompositionend: PropType<(e: Event) => void>;
    onKeyup: PropType<(e: Event) => void>;
    onPaste: PropType<(e: Event) => void>;
    onMousedown: PropType<(e: Event) => void>;
}>> & Readonly<{
    onPaste?: (...args: any[]) => any;
    onCompositionend?: (...args: any[]) => any;
    onCompositionstart?: (...args: any[]) => any;
    onFocus?: (...args: any[]) => any;
    onBlur?: (...args: any[]) => any;
    onChange?: (...args: any[]) => any;
    onInput?: (...args: any[]) => any;
    onKeydown?: (...args: any[]) => any;
    onKeyup?: (...args: any[]) => any;
    onMousedown?: (...args: any[]) => any;
}>, {
    size: string;
    type: string;
    tag: "input" | "textarea";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default BaseInputInner;
