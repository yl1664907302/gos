import type { NodeMouseEventHandler } from './contextTypes';
import type { Key, EventDataNode } from './interface';
import type { CheckInfo, DraggableFn } from './props';
export type DraggableConfig = {
    icon?: any;
    nodeDraggable?: DraggableFn;
};
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    focusable: {
        type: BooleanConstructor;
        default: any;
    };
    activeKey: import("vue").PropType<Key>;
    tabindex: NumberConstructor;
    children: import("vue-types").VueTypeValidableDef<any>;
    treeData: {
        type: import("vue").PropType<import("./interface").DataNode[]>;
    };
    fieldNames: {
        type: import("vue").PropType<import("./interface").FieldNames>;
    };
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: any;
    };
    showIcon: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    selectable: {
        type: BooleanConstructor;
        default: any;
    };
    expandAction: import("vue").PropType<import("./props").ExpandAction>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    checkable: {
        type: BooleanConstructor;
        default: any;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: any;
    };
    draggable: {
        type: import("vue").PropType<boolean | DraggableFn>;
    };
    defaultExpandParent: {
        type: BooleanConstructor;
        default: any;
    };
    autoExpandParent: {
        type: BooleanConstructor;
        default: any;
    };
    defaultExpandAll: {
        type: BooleanConstructor;
        default: any;
    };
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    checkedKeys: {
        type: import("vue").PropType<Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }>;
    };
    defaultSelectedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    allowDrop: {
        type: import("vue").PropType<import("./props").AllowDrop<import("./interface").DataNode>>;
    };
    dropIndicatorRender: {
        type: import("vue").PropType<(props: {
            dropPosition: 0 | 1 | -1;
            dropLevelOffset: number;
            indent: number;
            prefixCls: string;
            direction: import("./interface").Direction;
        }) => any>;
    };
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onKeydown: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onClick: {
        type: import("vue").PropType<NodeMouseEventHandler>;
    };
    onDblclick: {
        type: import("vue").PropType<NodeMouseEventHandler>;
    };
    onScroll: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onExpand: {
        type: import("vue").PropType<(expandedKeys: Key[], info: {
            node: EventDataNode;
            expanded: boolean;
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onCheck: {
        type: import("vue").PropType<(checked: Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }, info: CheckInfo) => void>;
    };
    onSelect: {
        type: import("vue").PropType<(selectedKeys: Key[], info: {
            event: "select";
            selected: boolean;
            node: EventDataNode;
            selectedNodes: import("./interface").DataNode[];
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onLoad: {
        type: import("vue").PropType<(loadedKeys: Key[], info: {
            event: "load";
            node: EventDataNode;
        }) => void>;
    };
    loadData: {
        type: import("vue").PropType<(treeNode: EventDataNode) => Promise<any>>;
    };
    loadedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    onMouseenter: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeMouseEventParams) => void>;
    };
    onMouseleave: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeMouseEventParams) => void>;
    };
    onRightClick: {
        type: import("vue").PropType<(info: {
            event: MouseEvent;
            node: EventDataNode;
        }) => void>;
    };
    onDragstart: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDragenter: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams & {
            expandedKeys: Key[];
        }) => void>;
    };
    onDragover: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDragleave: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDragend: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDrop: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams & {
            dragNode: EventDataNode;
            dragNodesKeys: Key[];
            dropPosition: number;
            dropToGap: boolean;
        }) => void>;
    };
    onActiveChange: {
        type: import("vue").PropType<(key: Key) => void>;
    };
    filterTreeNode: {
        type: import("vue").PropType<(treeNode: EventDataNode) => boolean>;
    };
    motion: import("vue-types").VueTypeValidableDef<any>;
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    height: NumberConstructor;
    itemHeight: NumberConstructor;
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    direction: {
        type: import("vue").PropType<import("./interface").Direction>;
    };
    rootClassName: StringConstructor;
    rootStyle: import("vue").PropType<import("vue").CSSProperties>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    focusable: {
        type: BooleanConstructor;
        default: any;
    };
    activeKey: import("vue").PropType<Key>;
    tabindex: NumberConstructor;
    children: import("vue-types").VueTypeValidableDef<any>;
    treeData: {
        type: import("vue").PropType<import("./interface").DataNode[]>;
    };
    fieldNames: {
        type: import("vue").PropType<import("./interface").FieldNames>;
    };
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: any;
    };
    showIcon: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    selectable: {
        type: BooleanConstructor;
        default: any;
    };
    expandAction: import("vue").PropType<import("./props").ExpandAction>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    checkable: {
        type: BooleanConstructor;
        default: any;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: any;
    };
    draggable: {
        type: import("vue").PropType<boolean | DraggableFn>;
    };
    defaultExpandParent: {
        type: BooleanConstructor;
        default: any;
    };
    autoExpandParent: {
        type: BooleanConstructor;
        default: any;
    };
    defaultExpandAll: {
        type: BooleanConstructor;
        default: any;
    };
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    checkedKeys: {
        type: import("vue").PropType<Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }>;
    };
    defaultSelectedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    allowDrop: {
        type: import("vue").PropType<import("./props").AllowDrop<import("./interface").DataNode>>;
    };
    dropIndicatorRender: {
        type: import("vue").PropType<(props: {
            dropPosition: 0 | 1 | -1;
            dropLevelOffset: number;
            indent: number;
            prefixCls: string;
            direction: import("./interface").Direction;
        }) => any>;
    };
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onKeydown: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onClick: {
        type: import("vue").PropType<NodeMouseEventHandler>;
    };
    onDblclick: {
        type: import("vue").PropType<NodeMouseEventHandler>;
    };
    onScroll: {
        type: import("vue").PropType<import("../_util/EventInterface").EventHandler>;
    };
    onExpand: {
        type: import("vue").PropType<(expandedKeys: Key[], info: {
            node: EventDataNode;
            expanded: boolean;
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onCheck: {
        type: import("vue").PropType<(checked: Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }, info: CheckInfo) => void>;
    };
    onSelect: {
        type: import("vue").PropType<(selectedKeys: Key[], info: {
            event: "select";
            selected: boolean;
            node: EventDataNode;
            selectedNodes: import("./interface").DataNode[];
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onLoad: {
        type: import("vue").PropType<(loadedKeys: Key[], info: {
            event: "load";
            node: EventDataNode;
        }) => void>;
    };
    loadData: {
        type: import("vue").PropType<(treeNode: EventDataNode) => Promise<any>>;
    };
    loadedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    onMouseenter: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeMouseEventParams) => void>;
    };
    onMouseleave: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeMouseEventParams) => void>;
    };
    onRightClick: {
        type: import("vue").PropType<(info: {
            event: MouseEvent;
            node: EventDataNode;
        }) => void>;
    };
    onDragstart: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDragenter: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams & {
            expandedKeys: Key[];
        }) => void>;
    };
    onDragover: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDragleave: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDragend: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams) => void>;
    };
    onDrop: {
        type: import("vue").PropType<(info: import("./contextTypes").NodeDragEventParams & {
            dragNode: EventDataNode;
            dragNodesKeys: Key[];
            dropPosition: number;
            dropToGap: boolean;
        }) => void>;
    };
    onActiveChange: {
        type: import("vue").PropType<(key: Key) => void>;
    };
    filterTreeNode: {
        type: import("vue").PropType<(treeNode: EventDataNode) => boolean>;
    };
    motion: import("vue-types").VueTypeValidableDef<any>;
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    height: NumberConstructor;
    itemHeight: NumberConstructor;
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    direction: {
        type: import("vue").PropType<import("./interface").Direction>;
    };
    rootClassName: StringConstructor;
    rootStyle: import("vue").PropType<import("vue").CSSProperties>;
}>> & Readonly<{}>, {
    multiple: boolean;
    disabled: boolean;
    virtual: boolean;
    selectable: boolean;
    checkable: boolean;
    showIcon: boolean;
    focusable: boolean;
    showLine: boolean | {
        showLeafIcon: boolean;
    };
    checkStrictly: boolean;
    defaultExpandParent: boolean;
    autoExpandParent: boolean;
    defaultExpandAll: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
