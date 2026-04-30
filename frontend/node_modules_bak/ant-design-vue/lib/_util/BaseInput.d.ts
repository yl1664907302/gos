import type { PropType } from 'vue';
export interface BaseInputExpose {
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
declare const BaseInput: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    disabled: import("vue-types").VueTypeValidableDef<boolean>;
    type: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    lazy: import("vue-types").VueTypeValidableDef<boolean> & {
        default: boolean;
    } & {
        default: boolean;
    };
    tag: {
        type: PropType<"input" | "textarea">;
        default: string;
    };
    size: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    style: import("vue-types").VueTypeDef<string | {
        [key: string]: any;
    }>;
    class: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("blur" | "change" | "compositionend" | "compositionstart" | "focus" | "input" | "keydown" | "keyup" | "mousedown" | "paste")[], "blur" | "change" | "compositionend" | "compositionstart" | "focus" | "input" | "keydown" | "keyup" | "mousedown" | "paste", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: import("vue-types").VueTypeValidableDef<boolean>;
    type: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    lazy: import("vue-types").VueTypeValidableDef<boolean> & {
        default: boolean;
    } & {
        default: boolean;
    };
    tag: {
        type: PropType<"input" | "textarea">;
        default: string;
    };
    size: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
    style: import("vue-types").VueTypeDef<string | {
        [key: string]: any;
    }>;
    class: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    };
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
    class: string;
    type: string;
    lazy: boolean;
    tag: "input" | "textarea";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default BaseInput;
