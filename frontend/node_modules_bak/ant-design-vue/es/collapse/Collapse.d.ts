import type { CollapsibleType } from './commonProps';
import { collapseProps } from './commonProps';
import type { ExtractPropTypes } from 'vue';
import type { CollapsePanelProps } from './CollapsePanel';
import type { CustomSlotsType } from '../_util/type';
export { collapseProps };
export type CollapseProps = Partial<ExtractPropTypes<ReturnType<typeof collapseProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    activeKey: {
        type: import("vue").PropType<import("./commonProps").ActiveKeyType>;
        default: import("./commonProps").ActiveKeyType;
    };
    defaultActiveKey: {
        type: import("vue").PropType<import("./commonProps").ActiveKeyType>;
        default: import("./commonProps").ActiveKeyType;
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
        type: import("vue").PropType<(panelProps: import("./commonProps").PanelProps) => any>;
        default: (panelProps: import("./commonProps").PanelProps) => any;
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
        type: import("vue").PropType<(key: import("../_util/type").Key | import("../_util/type").Key[]) => void>;
        default: (key: import("../_util/type").Key | import("../_util/type").Key[]) => void;
    };
    'onUpdate:activeKey': {
        type: import("vue").PropType<(key: import("../_util/type").Key | import("../_util/type").Key[]) => void>;
        default: (key: import("../_util/type").Key | import("../_util/type").Key[]) => void;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    activeKey: {
        type: import("vue").PropType<import("./commonProps").ActiveKeyType>;
        default: import("./commonProps").ActiveKeyType;
    };
    defaultActiveKey: {
        type: import("vue").PropType<import("./commonProps").ActiveKeyType>;
        default: import("./commonProps").ActiveKeyType;
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
        type: import("vue").PropType<(panelProps: import("./commonProps").PanelProps) => any>;
        default: (panelProps: import("./commonProps").PanelProps) => any;
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
        type: import("vue").PropType<(key: import("../_util/type").Key | import("../_util/type").Key[]) => void>;
        default: (key: import("../_util/type").Key | import("../_util/type").Key[]) => void;
    };
    'onUpdate:activeKey': {
        type: import("vue").PropType<(key: import("../_util/type").Key | import("../_util/type").Key[]) => void>;
        default: (key: import("../_util/type").Key | import("../_util/type").Key[]) => void;
    };
}>> & Readonly<{}>, {
    onChange: (key: import("../_util/type").Key | import("../_util/type").Key[]) => void;
    expandIcon: (panelProps: import("./commonProps").PanelProps) => any;
    activeKey: import("./commonProps").ActiveKeyType;
    'onUpdate:activeKey': (key: import("../_util/type").Key | import("../_util/type").Key[]) => void;
    ghost: boolean;
    bordered: boolean;
    openAnimation: {
        [key: string]: any;
    };
    defaultActiveKey: import("./commonProps").ActiveKeyType;
    destroyInactivePanel: boolean;
    accordion: boolean;
    collapsible: CollapsibleType;
    expandIconPosition: "end" | "start";
}, CustomSlotsType<{
    default?: any;
    expandIcon?: CollapsePanelProps;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
