import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { BasicDataNode } from '.';
import type { EventHandler } from '../_util/EventInterface';
import type { NodeDragEventParams, NodeMouseEventHandler, NodeMouseEventParams } from './contextTypes';
import type { DataNode, Key, FlattenNode, EventDataNode, Direction, FieldNames } from './interface';
export interface CheckInfo {
    event: 'check';
    node: EventDataNode;
    checked: boolean;
    nativeEvent: MouseEvent;
    checkedNodes: DataNode[];
    checkedNodesPositions?: {
        node: DataNode;
        pos: string;
    }[];
    halfCheckedKeys?: Key[];
}
export declare const treeNodeProps: {
    eventKey: (StringConstructor | NumberConstructor)[];
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    /** New added in Tree for easy data access */
    data: {
        type: PropType<DataNode>;
        default: DataNode;
    };
    parent: {
        type: PropType<DataNode>;
        default: DataNode;
    };
    isStart: {
        type: PropType<boolean[]>;
    };
    isEnd: {
        type: PropType<boolean[]>;
    };
    active: {
        type: BooleanConstructor;
        default: any;
    };
    onMousemove: {
        type: PropType<EventHandler>;
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
};
export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>;
export declare const nodeListProps: {
    prefixCls: {
        type: PropType<string>;
    };
    motion: {
        type: PropType<any>;
    };
    focusable: {
        type: PropType<boolean>;
    };
    activeItem: {
        type: PropType<FlattenNode>;
    };
    focused: {
        type: PropType<boolean>;
    };
    tabindex: {
        type: PropType<number>;
    };
    checkable: {
        type: PropType<boolean>;
    };
    selectable: {
        type: PropType<boolean>;
    };
    disabled: {
        type: PropType<boolean>;
    };
    height: {
        type: PropType<number>;
    };
    itemHeight: {
        type: PropType<number>;
    };
    virtual: {
        type: PropType<boolean>;
    };
    onScroll: {
        type: PropType<EventHandler>;
    };
    onKeydown: {
        type: PropType<EventHandler>;
    };
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onActiveChange: {
        type: PropType<(key: Key) => void>;
    };
    onContextmenu: {
        type: PropType<EventHandler>;
    };
    onListChangeStart: {
        type: PropType<() => void>;
    };
    onListChangeEnd: {
        type: PropType<() => void>;
    };
};
export type NodeListProps = Partial<ExtractPropTypes<typeof nodeListProps>>;
export interface AllowDropOptions<TreeDataType extends BasicDataNode = DataNode> {
    dragNode: EventDataNode;
    dropNode: TreeDataType;
    dropPosition: -1 | 0 | 1;
}
export type AllowDrop<TreeDataType extends BasicDataNode = DataNode> = (options: AllowDropOptions<TreeDataType>) => boolean;
export type DraggableFn = (node: DataNode) => boolean;
export type ExpandAction = false | 'click' | 'doubleclick' | 'dblclick';
export declare const treeProps: () => {
    prefixCls: StringConstructor;
    focusable: {
        type: BooleanConstructor;
        default: any;
    };
    activeKey: PropType<Key>;
    tabindex: NumberConstructor;
    children: import("vue-types").VueTypeValidableDef<any>;
    treeData: {
        type: PropType<DataNode[]>;
    };
    fieldNames: {
        type: PropType<FieldNames>;
    };
    showLine: {
        type: PropType<boolean | {
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
    expandAction: PropType<ExpandAction>;
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
        type: PropType<boolean | DraggableFn>;
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
        type: PropType<Key[]>;
    };
    expandedKeys: {
        type: PropType<Key[]>;
    };
    defaultCheckedKeys: {
        type: PropType<Key[]>;
    };
    checkedKeys: {
        type: PropType<Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }>;
    };
    defaultSelectedKeys: {
        type: PropType<Key[]>;
    };
    selectedKeys: {
        type: PropType<Key[]>;
    };
    allowDrop: {
        type: PropType<AllowDrop<DataNode>>;
    };
    dropIndicatorRender: {
        type: PropType<(props: {
            dropPosition: -1 | 0 | 1;
            dropLevelOffset: number;
            indent: number;
            prefixCls: string;
            direction: Direction;
        }) => any>;
    };
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onKeydown: {
        type: PropType<EventHandler>;
    };
    onContextmenu: {
        type: PropType<EventHandler>;
    };
    onClick: {
        type: PropType<NodeMouseEventHandler>;
    };
    onDblclick: {
        type: PropType<NodeMouseEventHandler>;
    };
    onScroll: {
        type: PropType<EventHandler>;
    };
    onExpand: {
        type: PropType<(expandedKeys: Key[], info: {
            node: EventDataNode;
            expanded: boolean;
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onCheck: {
        type: PropType<(checked: Key[] | {
            checked: Key[];
            halfChecked: Key[];
        }, info: CheckInfo) => void>;
    };
    onSelect: {
        type: PropType<(selectedKeys: Key[], info: {
            event: 'select';
            selected: boolean;
            node: EventDataNode;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onLoad: {
        type: PropType<(loadedKeys: Key[], info: {
            event: 'load';
            node: EventDataNode;
        }) => void>;
    };
    loadData: {
        type: PropType<(treeNode: EventDataNode) => Promise<any>>;
    };
    loadedKeys: {
        type: PropType<Key[]>;
    };
    onMouseenter: {
        type: PropType<(info: NodeMouseEventParams) => void>;
    };
    onMouseleave: {
        type: PropType<(info: NodeMouseEventParams) => void>;
    };
    onRightClick: {
        type: PropType<(info: {
            event: MouseEvent;
            node: EventDataNode;
        }) => void>;
    };
    onDragstart: {
        type: PropType<(info: NodeDragEventParams) => void>;
    };
    onDragenter: {
        type: PropType<(info: NodeDragEventParams & {
            expandedKeys: Key[];
        }) => void>;
    };
    onDragover: {
        type: PropType<(info: NodeDragEventParams) => void>;
    };
    onDragleave: {
        type: PropType<(info: NodeDragEventParams) => void>;
    };
    onDragend: {
        type: PropType<(info: NodeDragEventParams) => void>;
    };
    onDrop: {
        type: PropType<(info: NodeDragEventParams & {
            dragNode: EventDataNode;
            dragNodesKeys: Key[];
            dropPosition: number;
            dropToGap: boolean;
        }) => void>;
    };
    /**
     * Used for `rc-tree-select` only.
     * Do not use in your production code directly since this will be refactor.
     */
    onActiveChange: {
        type: PropType<(key: Key) => void>;
    };
    filterTreeNode: {
        type: PropType<(treeNode: EventDataNode) => boolean>;
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
        type: PropType<Direction>;
    };
    rootClassName: StringConstructor;
    rootStyle: PropType<CSSProperties>;
};
export type TreeProps = Partial<ExtractPropTypes<ReturnType<typeof treeProps>>>;
