import type { FlattenNode } from './interface';
import type { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    active: BooleanConstructor;
    motion: ObjectConstructor;
    motionNodes: {
        type: PropType<FlattenNode[]>;
    };
    onMotionStart: FunctionConstructor;
    onMotionEnd: FunctionConstructor;
    motionType: StringConstructor;
    eventKey: (StringConstructor | NumberConstructor)[];
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    data: {
        type: PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    parent: {
        type: PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    isStart: {
        type: PropType<boolean[]>;
    };
    isEnd: {
        type: PropType<boolean[]>;
    };
    onMousemove: {
        type: PropType<import("../_util/EventInterface").EventHandler>;
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
        type: PropType<(arg: any) => void>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    active: BooleanConstructor;
    motion: ObjectConstructor;
    motionNodes: {
        type: PropType<FlattenNode[]>;
    };
    onMotionStart: FunctionConstructor;
    onMotionEnd: FunctionConstructor;
    motionType: StringConstructor;
    eventKey: (StringConstructor | NumberConstructor)[];
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    data: {
        type: PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    parent: {
        type: PropType<import("./interface").DataNode>;
        default: import("./interface").DataNode;
    };
    isStart: {
        type: PropType<boolean[]>;
    };
    isEnd: {
        type: PropType<boolean[]>;
    };
    onMousemove: {
        type: PropType<import("../_util/EventInterface").EventHandler>;
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
        type: PropType<(arg: any) => void>;
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
