import type { ExtractPropTypes } from 'vue';
import type { DataNode, EventDataNode, FieldNames, Key } from '../vc-tree/interface';
import type { TreeNodeProps } from '../vc-tree/props';
import type { CustomSlotsType } from '../_util/type';
export interface AntdTreeNodeAttribute {
    eventKey: string;
    prefixCls: string;
    class: string;
    expanded: boolean;
    selected: boolean;
    checked: boolean;
    halfChecked: boolean;
    children: any;
    title: any;
    pos: string;
    dragOver: boolean;
    dragOverGapTop: boolean;
    dragOverGapBottom: boolean;
    isLeaf: boolean;
    selectable: boolean;
    disabled: boolean;
    disableCheckbox: boolean;
}
export type AntTreeNodeProps = TreeNodeProps;
export type TreeDataItem = DataNode;
export interface AntTreeNodeBaseEvent {
    node: EventDataNode;
    nativeEvent: MouseEvent;
}
export interface AntTreeNodeCheckedEvent extends AntTreeNodeBaseEvent {
    event: 'check';
    checked?: boolean;
    checkedNodes?: DataNode[];
}
export interface AntTreeNodeSelectedEvent extends AntTreeNodeBaseEvent {
    event: 'select';
    selected?: boolean;
    selectedNodes?: DataNode[];
}
export interface AntTreeNodeExpandedEvent extends AntTreeNodeBaseEvent {
    expanded?: boolean;
}
export interface AntTreeNodeMouseEvent {
    node: EventDataNode;
    event: DragEvent;
}
export interface AntTreeNodeDragEnterEvent extends AntTreeNodeMouseEvent {
    expandedKeys: Key[];
}
export interface AntTreeNodeDropEvent {
    node: EventDataNode;
    dragNode: EventDataNode;
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap?: boolean;
    event: MouseEvent;
}
export declare const treeProps: () => {
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    /** 是否支持多选 */
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否自动展开父节点 */
    autoExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否支持选中 */
    checkable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否禁用树 */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开所有树节点 */
    defaultExpandAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开对应树节点 */
    defaultExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）展开指定的树节点 */
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）选中复选框的树节点 */
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
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）设置选中的树节点 */
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** 默认选中的树节点 */
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
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: {
        type: import("vue").PropType<FieldNames>;
        default: FieldNames;
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
        type: import("vue").PropType<FieldNames>;
    };
    expandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
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
export type TreeProps = Partial<ExtractPropTypes<ReturnType<typeof treeProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    /** 是否支持多选 */
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否自动展开父节点 */
    autoExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否支持选中 */
    checkable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否禁用树 */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开所有树节点 */
    defaultExpandAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开对应树节点 */
    defaultExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）展开指定的树节点 */
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）选中复选框的树节点 */
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
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）设置选中的树节点 */
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** 默认选中的树节点 */
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
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: {
        type: import("vue").PropType<FieldNames>;
        default: FieldNames;
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
        type: import("vue").PropType<FieldNames>;
    };
    expandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
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
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    showLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    /** 是否支持多选 */
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否自动展开父节点 */
    autoExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否支持选中 */
    checkable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否禁用树 */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开所有树节点 */
    defaultExpandAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开对应树节点 */
    defaultExpandParent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）展开指定的树节点 */
    expandedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）选中复选框的树节点 */
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
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** （受控）设置选中的树节点 */
    selectedKeys: {
        type: import("vue").PropType<Key[]>;
        default: Key[];
    };
    /** 默认选中的树节点 */
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
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: {
        type: import("vue").PropType<FieldNames>;
        default: FieldNames;
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
        type: import("vue").PropType<FieldNames>;
    };
    expandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
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
    checkStrictly: boolean;
    defaultExpandParent: boolean;
    autoExpandParent: boolean;
    defaultExpandAll: boolean;
    defaultExpandedKeys: Key[];
    defaultCheckedKeys: Key[];
    defaultSelectedKeys: Key[];
    replaceFields: FieldNames;
    blockNode: boolean;
    'onUpdate:checkedKeys': (keys: Key[]) => void;
    'onUpdate:expandedKeys': (keys: Key[]) => void;
}, CustomSlotsType<{
    icon?: any;
    title?: any;
    switcherIcon?: any;
    titleRender?: any;
    default?: any;
    leafIcon?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
