declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
}>> & Readonly<{}>, {
    disabled: boolean;
    forceRender: boolean;
    onItemClick: (panelKey: import("../_util/type").Key) => void;
    expandIcon: (panelProps: import("./commonProps").PanelProps) => any;
    openAnimation: {
        [key: string]: any;
    };
    showArrow: boolean;
    isActive: boolean;
    destroyInactivePanel: boolean;
    accordion: boolean;
    panelKey: string | number;
    collapsible: import("./commonProps").CollapsibleType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
