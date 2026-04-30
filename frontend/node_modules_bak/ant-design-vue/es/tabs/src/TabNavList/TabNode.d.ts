import type { Tab, EditableConfig } from '../interface';
import type { PropType } from 'vue';
import type { FocusEventHandler } from '../../../_util/EventInterface';
export interface TabNodeProps {
    id: string;
    prefixCls: string;
    tab: Tab;
    active: boolean;
    closable?: boolean;
    editable?: EditableConfig;
    onClick?: (e: MouseEvent | KeyboardEvent) => void;
    onResize?: (width: number, height: number, left: number, top: number) => void;
    renderWrapper?: (node: any) => any;
    removeAriaLabel?: string;
    onRemove: () => void;
    onFocus: FocusEventHandler;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    id: {
        type: PropType<string>;
    };
    prefixCls: {
        type: PropType<string>;
    };
    tab: {
        type: PropType<Tab & {
            closeIcon?: () => any;
        }>;
    };
    active: {
        type: BooleanConstructor;
    };
    closable: {
        type: BooleanConstructor;
    };
    editable: {
        type: PropType<EditableConfig>;
    };
    onClick: {
        type: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    };
    onResize: {
        type: PropType<(width: number, height: number, left: number, top: number) => void>;
    };
    renderWrapper: {
        type: PropType<(node: any) => any>;
    };
    removeAriaLabel: {
        type: StringConstructor;
    };
    onFocus: {
        type: PropType<FocusEventHandler>;
    };
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("click" | "focus" | "resize" | "remove")[], "click" | "focus" | "resize" | "remove", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: PropType<string>;
    };
    prefixCls: {
        type: PropType<string>;
    };
    tab: {
        type: PropType<Tab & {
            closeIcon?: () => any;
        }>;
    };
    active: {
        type: BooleanConstructor;
    };
    closable: {
        type: BooleanConstructor;
    };
    editable: {
        type: PropType<EditableConfig>;
    };
    onClick: {
        type: PropType<(e: MouseEvent | KeyboardEvent) => void>;
    };
    onResize: {
        type: PropType<(width: number, height: number, left: number, top: number) => void>;
    };
    renderWrapper: {
        type: PropType<(node: any) => any>;
    };
    removeAriaLabel: {
        type: StringConstructor;
    };
    onFocus: {
        type: PropType<FocusEventHandler>;
    };
}>> & Readonly<{
    onClick?: (...args: any[]) => any;
    onFocus?: (...args: any[]) => any;
    onResize?: (...args: any[]) => any;
    onRemove?: (...args: any[]) => any;
}>, {
    active: boolean;
    closable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
