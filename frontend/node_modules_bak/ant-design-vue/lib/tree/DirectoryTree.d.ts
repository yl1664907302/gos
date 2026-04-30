import type { ExtractPropTypes } from 'vue';
import type { AntdTreeNodeAttribute } from './Tree';
import type { DataNode, EventDataNode, Key } from '../vc-tree/interface';
import type { CustomSlotsType } from '../_util/type';
export type ExpandAction = false | 'click' | 'doubleclick' | 'dblclick';
export declare const directoryTreeProps: () => {
    expandAction: {
        type: import("vue").PropType<ExpandAction>;
        default: ExpandAction;
    };
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkable: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    checkedKeys: {
        type: import("vue").PropType<Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }>;
        default: Key[] | {
            checked: Key[];
            halfChecked: Key[];
        };
    };
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    defaultSelectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    draggable: {
        type: BooleanConstructor;
        default: boolean;
    };
    showIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    icon: {
        type: import("vue").PropType<(nodeProps: AntdTreeNodeAttribute) => any>;
        default: (nodeProps: AntdTreeNodeAttribute) => any;
    };
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    prefixCls: StringConstructor;
    replaceFields: {
        type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
        default: import("../vc-tree/interface").FieldNames;
    };
    blockNode: {
        type: BooleanConstructor;
        default: boolean;
    };
    openAnimation: import("vue-types").VueTypeValidableDef<any>;
    onDoubleclick: {
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
    };
    'onUpdate:selectedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:checkedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:expandedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    focusable: {
        type: BooleanConstructor;
        default: any;
    };
    activeKey: import("vue").PropType<Key>;
    tabindex: NumberConstructor;
    children: import("vue-types").VueTypeValidableDef<any>;
    treeData: {
        type: import("vue").PropType<DataNode[]>;
    };
    fieldNames: {
        type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
    };
    allowDrop: {
        type: import("vue").PropType<import("../vc-tree/props").AllowDrop<DataNode>>;
    };
    dropIndicatorRender: {
        type: import("vue").PropType<(props: {
            dropPosition: 0 | 1 | -1;
            dropLevelOffset: number;
            indent: number;
            prefixCls: string;
            direction: import("../vc-tree/interface").Direction;
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
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
    };
    onDblclick: {
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
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
        }, info: import("../vc-tree/props").CheckInfo) => void>;
    };
    onSelect: {
        type: import("vue").PropType<(selectedKeys: Key[], info: {
            event: "select";
            selected: boolean;
            node: EventDataNode;
            selectedNodes: DataNode[];
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
    onMouseenter: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeMouseEventParams) => void>;
    };
    onMouseleave: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeMouseEventParams) => void>;
    };
    onRightClick: {
        type: import("vue").PropType<(info: {
            event: MouseEvent;
            node: EventDataNode;
        }) => void>;
    };
    onDragstart: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragenter: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
            expandedKeys: Key[];
        }) => void>;
    };
    onDragover: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragleave: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragend: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDrop: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
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
    height: NumberConstructor;
    itemHeight: NumberConstructor;
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    direction: {
        type: import("vue").PropType<import("../vc-tree/interface").Direction>;
    };
    rootClassName: StringConstructor;
    rootStyle: import("vue").PropType<import("vue").CSSProperties>;
};
export type DirectoryTreeProps = Partial<ExtractPropTypes<ReturnType<typeof directoryTreeProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    expandAction: {
        type: import("vue").PropType<ExpandAction>;
        default: ExpandAction;
    };
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkable: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    checkedKeys: {
        type: import("vue").PropType<Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }>;
        default: Key[] | {
            checked: Key[];
            halfChecked: Key[];
        };
    };
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    defaultSelectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    draggable: {
        type: BooleanConstructor;
        default: boolean;
    };
    showIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    icon: {
        type: import("vue").PropType<(nodeProps: AntdTreeNodeAttribute) => any>;
        default: (nodeProps: AntdTreeNodeAttribute) => any;
    };
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    prefixCls: StringConstructor;
    replaceFields: {
        type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
        default: import("../vc-tree/interface").FieldNames;
    };
    blockNode: {
        type: BooleanConstructor;
        default: boolean;
    };
    openAnimation: import("vue-types").VueTypeValidableDef<any>;
    onDoubleclick: {
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
    };
    'onUpdate:selectedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:checkedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:expandedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    focusable: {
        type: BooleanConstructor;
        default: any;
    };
    activeKey: import("vue").PropType<Key>;
    tabindex: NumberConstructor;
    children: import("vue-types").VueTypeValidableDef<any>;
    treeData: {
        type: import("vue").PropType<DataNode[]>;
    };
    fieldNames: {
        type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
    };
    allowDrop: {
        type: import("vue").PropType<import("../vc-tree/props").AllowDrop<DataNode>>;
    };
    dropIndicatorRender: {
        type: import("vue").PropType<(props: {
            dropPosition: 0 | 1 | -1;
            dropLevelOffset: number;
            indent: number;
            prefixCls: string;
            direction: import("../vc-tree/interface").Direction;
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
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
    };
    onDblclick: {
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
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
        }, info: import("../vc-tree/props").CheckInfo) => void>;
    };
    onSelect: {
        type: import("vue").PropType<(selectedKeys: Key[], info: {
            event: "select";
            selected: boolean;
            node: EventDataNode;
            selectedNodes: DataNode[];
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
    onMouseenter: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeMouseEventParams) => void>;
    };
    onMouseleave: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeMouseEventParams) => void>;
    };
    onRightClick: {
        type: import("vue").PropType<(info: {
            event: MouseEvent;
            node: EventDataNode;
        }) => void>;
    };
    onDragstart: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragenter: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
            expandedKeys: Key[];
        }) => void>;
    };
    onDragover: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragleave: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragend: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDrop: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
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
    height: NumberConstructor;
    itemHeight: NumberConstructor;
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    direction: {
        type: import("vue").PropType<import("../vc-tree/interface").Direction>;
    };
    rootClassName: StringConstructor;
    rootStyle: import("vue").PropType<import("vue").CSSProperties>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    expandAction: {
        type: import("vue").PropType<ExpandAction>;
        default: ExpandAction;
    };
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkable: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    checkedKeys: {
        type: import("vue").PropType<Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }>;
        default: Key[] | {
            checked: Key[];
            halfChecked: Key[];
        };
    };
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    defaultSelectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    draggable: {
        type: BooleanConstructor;
        default: boolean;
    };
    showIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    icon: {
        type: import("vue").PropType<(nodeProps: AntdTreeNodeAttribute) => any>;
        default: (nodeProps: AntdTreeNodeAttribute) => any;
    };
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    prefixCls: StringConstructor;
    replaceFields: {
        type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
        default: import("../vc-tree/interface").FieldNames;
    };
    blockNode: {
        type: BooleanConstructor;
        default: boolean;
    };
    openAnimation: import("vue-types").VueTypeValidableDef<any>;
    onDoubleclick: {
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
    };
    'onUpdate:selectedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:checkedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:expandedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    focusable: {
        type: BooleanConstructor;
        default: any;
    };
    activeKey: import("vue").PropType<Key>;
    tabindex: NumberConstructor;
    children: import("vue-types").VueTypeValidableDef<any>;
    treeData: {
        type: import("vue").PropType<DataNode[]>;
    };
    fieldNames: {
        type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
    };
    allowDrop: {
        type: import("vue").PropType<import("../vc-tree/props").AllowDrop<DataNode>>;
    };
    dropIndicatorRender: {
        type: import("vue").PropType<(props: {
            dropPosition: 0 | 1 | -1;
            dropLevelOffset: number;
            indent: number;
            prefixCls: string;
            direction: import("../vc-tree/interface").Direction;
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
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
    };
    onDblclick: {
        type: import("vue").PropType<import("../vc-tree/contextTypes").NodeMouseEventHandler>;
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
        }, info: import("../vc-tree/props").CheckInfo) => void>;
    };
    onSelect: {
        type: import("vue").PropType<(selectedKeys: Key[], info: {
            event: "select";
            selected: boolean;
            node: EventDataNode;
            selectedNodes: DataNode[];
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
    onMouseenter: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeMouseEventParams) => void>;
    };
    onMouseleave: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeMouseEventParams) => void>;
    };
    onRightClick: {
        type: import("vue").PropType<(info: {
            event: MouseEvent;
            node: EventDataNode;
        }) => void>;
    };
    onDragstart: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragenter: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
            expandedKeys: Key[];
        }) => void>;
    };
    onDragover: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragleave: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragend: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDrop: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
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
    height: NumberConstructor;
    itemHeight: NumberConstructor;
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    direction: {
        type: import("vue").PropType<import("../vc-tree/interface").Direction>;
    };
    rootClassName: StringConstructor;
    rootStyle: import("vue").PropType<import("vue").CSSProperties>;
}>> & Readonly<{}>, {
    draggable: boolean;
    icon: (nodeProps: AntdTreeNodeAttribute) => any;
    multiple: boolean;
    disabled: boolean;
    virtual: boolean;
    selectedKeys: Key[];
    selectable: boolean;
    'onUpdate:selectedKeys': (keys: Key[]) => void;
    checkable: boolean;
    expandedKeys: Key[];
    loadedKeys: Key[];
    checkedKeys: Key[] | {
        checked: Key[];
        halfChecked: Key[];
    };
    showIcon: boolean;
    focusable: boolean;
    showLine: boolean | {
        showLeafIcon: boolean;
    };
    expandAction: ExpandAction;
    checkStrictly: boolean;
    defaultExpandParent: boolean;
    autoExpandParent: boolean;
    defaultExpandAll: boolean;
    defaultExpandedKeys: Key[];
    defaultCheckedKeys: Key[];
    defaultSelectedKeys: Key[];
    replaceFields: import("../vc-tree/interface").FieldNames;
    blockNode: boolean;
    'onUpdate:checkedKeys': (keys: Key[]) => void;
    'onUpdate:expandedKeys': (keys: Key[]) => void;
}, CustomSlotsType<{
    icon?: any;
    title?: any;
    switcherIcon?: any;
    titleRender?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
