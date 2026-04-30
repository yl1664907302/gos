import type { Plugin } from 'vue';
import { collapseProps } from './Collapse';
import CollapsePanel, { collapsePanelProps } from './CollapsePanel';
export type { CollapseProps } from './Collapse';
export type { CollapsePanelProps } from './CollapsePanel';
export { CollapsePanel, collapseProps, collapsePanelProps };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<import("./commonProps").CollapsibleType>;
            default: import("./commonProps").CollapsibleType;
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
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
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
        collapsible: import("./commonProps").CollapsibleType;
        expandIconPosition: "end" | "start";
    }, true, {}, import("../_util/type").CustomSlotsType<{
        default?: any;
        expandIcon?: Partial<import("vue").ExtractPropTypes<{
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
                type: import("vue").PropType<(panelProps: import("./commonProps").PanelProps) => any>;
                default: (panelProps: import("./commonProps").PanelProps) => any;
            };
            extra: import("vue-types").VueTypeValidableDef<any>;
            panelKey: {
                type: import("vue").PropType<string | number>;
                default: string | number;
            };
            collapsible: {
                type: import("vue").PropType<import("./commonProps").CollapsibleType>;
                default: import("./commonProps").CollapsibleType;
            };
            role: StringConstructor;
            onItemClick: {
                type: import("vue").PropType<(panelKey: import("../_util/type").Key) => void>;
                default: (panelKey: import("../_util/type").Key) => void;
            };
        }>>;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<import("./commonProps").CollapsibleType>;
            default: import("./commonProps").CollapsibleType;
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
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
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
        collapsible: import("./commonProps").CollapsibleType;
        expandIconPosition: "end" | "start";
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<import("./commonProps").CollapsibleType>;
        default: import("./commonProps").CollapsibleType;
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
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
    collapsible: import("./commonProps").CollapsibleType;
    expandIconPosition: "end" | "start";
}, {}, string, import("../_util/type").CustomSlotsType<{
    default?: any;
    expandIcon?: Partial<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<(panelProps: import("./commonProps").PanelProps) => any>;
            default: (panelProps: import("./commonProps").PanelProps) => any;
        };
        extra: import("vue-types").VueTypeValidableDef<any>;
        panelKey: {
            type: import("vue").PropType<string | number>;
            default: string | number;
        };
        collapsible: {
            type: import("vue").PropType<import("./commonProps").CollapsibleType>;
            default: import("./commonProps").CollapsibleType;
        };
        role: StringConstructor;
        onItemClick: {
            type: import("vue").PropType<(panelKey: import("../_util/type").Key) => void>;
            default: (panelKey: import("../_util/type").Key) => void;
        };
    }>>;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Panel: typeof CollapsePanel;
};
export default _default;
