declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    eventKey: (StringConstructor | NumberConstructor)[];
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    data: {
        type: import("vue").PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    parent: {
        type: import("vue").PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    isStart: {
        type: import("vue").PropType<boolean[]>;
    };
    isEnd: {
        type: import("vue").PropType<boolean[]>;
    };
    active: {
        type: BooleanConstructor;
        default: any;
    };
    onMousemove: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    isLeaf: {
        type: BooleanConstructor;
        default: any;
    };
    checkable: {
        type: BooleanConstructor;
        default: any;
    };
    selectable: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    disableCheckbox: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    domRef: {
        type: import("vue").PropType<(arg: any) => void>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    eventKey: (StringConstructor | NumberConstructor)[];
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    data: {
        type: import("vue").PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    parent: {
        type: import("vue").PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    isStart: {
        type: import("vue").PropType<boolean[]>;
    };
    isEnd: {
        type: import("vue").PropType<boolean[]>;
    };
    active: {
        type: BooleanConstructor;
        default: any;
    };
    onMousemove: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    isLeaf: {
        type: BooleanConstructor;
        default: any;
    };
    checkable: {
        type: BooleanConstructor;
        default: any;
    };
    selectable: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    disableCheckbox: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    domRef: {
        type: import("vue").PropType<(arg: any) => void>;
    };
}>> & Readonly<{}>, {
    data: import("./interface").DataNode;
    active: boolean;
    disabled: boolean;
    selectable: boolean;
    checkable: boolean;
    disableCheckbox: boolean;
    isLeaf: boolean;
    parent: import("./interface").DataNode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
