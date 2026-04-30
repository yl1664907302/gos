import type { Key } from '../_util/type';
export type CollapsibleType = 'header' | 'icon' | 'disabled';
export type ActiveKeyType = Array<string | number> | string | number;
export interface PanelProps {
    isActive?: boolean;
    header?: any;
    showArrow?: boolean;
    forceRender?: boolean;
    /** @deprecated Use `collapsible="disabled"` instead */
    disabled?: boolean;
    extra?: any;
    collapsible?: CollapsibleType;
}
declare const collapseProps: () => {
    prefixCls: StringConstructor;
    activeKey: {
        type: import("vue").PropType<ActiveKeyType>;
        default: ActiveKeyType;
    };
    defaultActiveKey: {
        type: import("vue").PropType<ActiveKeyType>;
        default: ActiveKeyType;
    };
    accordion: {
        type: BooleanConstructor;
        default: boolean;
    };
    destroyInactivePanel: {
        type: BooleanConstructor;
        default: boolean;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    expandIcon: {
        type: import("vue").PropType<(panelProps: PanelProps) => any>;
        default: (panelProps: PanelProps) => any;
    };
    openAnimation: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    expandIconPosition: {
        type: import("vue").PropType<"end" | "start">;
        default: "end" | "start";
    };
    collapsible: {
        type: import("vue").PropType<CollapsibleType>;
        default: CollapsibleType;
    };
    ghost: {
        type: BooleanConstructor;
        default: boolean;
    };
    onChange: {
        type: import("vue").PropType<(key: Key | Key[]) => void>;
        default: (key: Key | Key[]) => void;
    };
    'onUpdate:activeKey': {
        type: import("vue").PropType<(key: Key | Key[]) => void>;
        default: (key: Key | Key[]) => void;
    };
};
declare const collapsePanelProps: () => {
    openAnimation: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    prefixCls: StringConstructor;
    header: import("vue-types").VueTypeValidableDef<any>;
    headerClass: StringConstructor;
    showArrow: {
        type: BooleanConstructor;
        default: boolean;
    };
    isActive: {
        type: BooleanConstructor;
        default: boolean;
    };
    destroyInactivePanel: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** @deprecated Use `collapsible="disabled"` instead */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    accordion: {
        type: BooleanConstructor;
        default: boolean;
    };
    forceRender: {
        type: BooleanConstructor;
        default: boolean;
    };
    expandIcon: {
        type: import("vue").PropType<(panelProps: PanelProps) => any>;
        default: (panelProps: PanelProps) => any;
    };
    extra: import("vue-types").VueTypeValidableDef<any>;
    panelKey: {
        type: import("vue").PropType<string | number>;
        default: string | number;
    };
    collapsible: {
        type: import("vue").PropType<CollapsibleType>;
        default: CollapsibleType;
    };
    role: StringConstructor;
    onItemClick: {
        type: import("vue").PropType<(panelKey: Key) => void>;
        default: (panelKey: Key) => void;
    };
};
export { collapseProps, collapsePanelProps };
