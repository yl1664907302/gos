import type { App } from 'vue';
import DirectoryTree from './DirectoryTree';
export type { EventDataNode, DataNode } from '../vc-tree/interface';
export type { TreeProps, AntTreeNodeMouseEvent, AntTreeNodeExpandedEvent, AntTreeNodeCheckedEvent, AntTreeNodeSelectedEvent, AntTreeNodeDragEnterEvent, AntTreeNodeDropEvent, AntdTreeNodeAttribute, TreeDataItem, } from './Tree';
export type { ExpandAction as DirectoryTreeExpandAction, DirectoryTreeProps, } from './DirectoryTree';
declare const TreeNode: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    eventKey: (StringConstructor | NumberConstructor)[];
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    data: {
        type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
        default: import("../vc-tree/interface").DataNode;
    };
    parent: {
        type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
        default: import("../vc-tree/interface").DataNode;
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
        type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
        default: import("../vc-tree/interface").DataNode;
    };
    parent: {
        type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
        default: import("../vc-tree/interface").DataNode;
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
    data: import("../vc-tree/interface").DataNode;
    active: boolean;
    disabled: boolean;
    selectable: boolean;
    checkable: boolean;
    disableCheckbox: boolean;
    isLeaf: boolean;
    parent: import("../vc-tree/interface").DataNode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export { DirectoryTree, TreeNode };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        expandedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        checkedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }>;
            default: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            };
        };
        defaultCheckedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        defaultSelectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectable: {
            type: BooleanConstructor;
            default: boolean;
        };
        loadedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
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
            type: import("vue").PropType<(nodeProps: import("./Tree").AntdTreeNodeAttribute) => any>;
            default: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
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
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:checkedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:expandedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        focusable: {
            type: BooleanConstructor;
            default: any;
        };
        activeKey: import("vue").PropType<import("../vc-tree/interface").Key>;
        tabindex: NumberConstructor;
        children: import("vue-types").VueTypeValidableDef<any>;
        treeData: {
            type: import("vue").PropType<import("../vc-tree/interface").DataNode[]>;
        };
        fieldNames: {
            type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
        };
        expandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
        allowDrop: {
            type: import("vue").PropType<import("../vc-tree/props").AllowDrop<import("../vc-tree/interface").DataNode>>;
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
            type: import("vue").PropType<(expandedKeys: import("../vc-tree/interface").Key[], info: {
                node: import("../vc-tree/interface").EventDataNode;
                expanded: boolean;
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onCheck: {
            type: import("vue").PropType<(checked: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }, info: import("../vc-tree/props").CheckInfo) => void>;
        };
        onSelect: {
            type: import("vue").PropType<(selectedKeys: import("../vc-tree/interface").Key[], info: {
                event: "select";
                selected: boolean;
                node: import("../vc-tree/interface").EventDataNode;
                selectedNodes: import("../vc-tree/interface").DataNode[];
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onLoad: {
            type: import("vue").PropType<(loadedKeys: import("../vc-tree/interface").Key[], info: {
                event: "load";
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        loadData: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => Promise<any>>;
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
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        onDragstart: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
        };
        onDragenter: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
                expandedKeys: import("../vc-tree/interface").Key[];
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
                dragNode: import("../vc-tree/interface").EventDataNode;
                dragNodesKeys: import("../vc-tree/interface").Key[];
                dropPosition: number;
                dropToGap: boolean;
            }) => void>;
        };
        onActiveChange: {
            type: import("vue").PropType<(key: import("../vc-tree/interface").Key) => void>;
        };
        filterTreeNode: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => boolean>;
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
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        draggable: boolean;
        icon: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
        multiple: boolean;
        disabled: boolean;
        virtual: boolean;
        selectedKeys: import("../vc-tree/interface").Key[];
        selectable: boolean;
        'onUpdate:selectedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
        checkable: boolean;
        expandedKeys: import("../vc-tree/interface").Key[];
        loadedKeys: import("../vc-tree/interface").Key[];
        checkedKeys: import("../vc-tree/interface").Key[] | {
            checked: import("../vc-tree/interface").Key[];
            halfChecked: import("../vc-tree/interface").Key[];
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
        defaultExpandedKeys: import("../vc-tree/interface").Key[];
        defaultCheckedKeys: import("../vc-tree/interface").Key[];
        defaultSelectedKeys: import("../vc-tree/interface").Key[];
        replaceFields: import("../vc-tree/interface").FieldNames;
        blockNode: boolean;
        'onUpdate:checkedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
        'onUpdate:expandedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        icon?: any;
        title?: any;
        switcherIcon?: any;
        titleRender?: any;
        default?: any;
        leafIcon?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        expandedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        checkedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }>;
            default: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            };
        };
        defaultCheckedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        defaultSelectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectable: {
            type: BooleanConstructor;
            default: boolean;
        };
        loadedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
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
            type: import("vue").PropType<(nodeProps: import("./Tree").AntdTreeNodeAttribute) => any>;
            default: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
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
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:checkedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:expandedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        focusable: {
            type: BooleanConstructor;
            default: any;
        };
        activeKey: import("vue").PropType<import("../vc-tree/interface").Key>;
        tabindex: NumberConstructor;
        children: import("vue-types").VueTypeValidableDef<any>;
        treeData: {
            type: import("vue").PropType<import("../vc-tree/interface").DataNode[]>;
        };
        fieldNames: {
            type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
        };
        expandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
        allowDrop: {
            type: import("vue").PropType<import("../vc-tree/props").AllowDrop<import("../vc-tree/interface").DataNode>>;
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
            type: import("vue").PropType<(expandedKeys: import("../vc-tree/interface").Key[], info: {
                node: import("../vc-tree/interface").EventDataNode;
                expanded: boolean;
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onCheck: {
            type: import("vue").PropType<(checked: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }, info: import("../vc-tree/props").CheckInfo) => void>;
        };
        onSelect: {
            type: import("vue").PropType<(selectedKeys: import("../vc-tree/interface").Key[], info: {
                event: "select";
                selected: boolean;
                node: import("../vc-tree/interface").EventDataNode;
                selectedNodes: import("../vc-tree/interface").DataNode[];
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onLoad: {
            type: import("vue").PropType<(loadedKeys: import("../vc-tree/interface").Key[], info: {
                event: "load";
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        loadData: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => Promise<any>>;
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
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        onDragstart: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
        };
        onDragenter: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
                expandedKeys: import("../vc-tree/interface").Key[];
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
                dragNode: import("../vc-tree/interface").EventDataNode;
                dragNodesKeys: import("../vc-tree/interface").Key[];
                dropPosition: number;
                dropToGap: boolean;
            }) => void>;
        };
        onActiveChange: {
            type: import("vue").PropType<(key: import("../vc-tree/interface").Key) => void>;
        };
        filterTreeNode: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => boolean>;
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
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        draggable: boolean;
        icon: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
        multiple: boolean;
        disabled: boolean;
        virtual: boolean;
        selectedKeys: import("../vc-tree/interface").Key[];
        selectable: boolean;
        'onUpdate:selectedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
        checkable: boolean;
        expandedKeys: import("../vc-tree/interface").Key[];
        loadedKeys: import("../vc-tree/interface").Key[];
        checkedKeys: import("../vc-tree/interface").Key[] | {
            checked: import("../vc-tree/interface").Key[];
            halfChecked: import("../vc-tree/interface").Key[];
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
        defaultExpandedKeys: import("../vc-tree/interface").Key[];
        defaultCheckedKeys: import("../vc-tree/interface").Key[];
        defaultSelectedKeys: import("../vc-tree/interface").Key[];
        replaceFields: import("../vc-tree/interface").FieldNames;
        blockNode: boolean;
        'onUpdate:checkedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
        'onUpdate:expandedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
        default: import("../vc-tree/interface").Key[];
    };
    expandedKeys: {
        type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
        default: import("../vc-tree/interface").Key[];
    };
    checkedKeys: {
        type: import("vue").PropType<import("../vc-tree/interface").Key[] | {
            checked: import("../vc-tree/interface").Key[];
            halfChecked: import("../vc-tree/interface").Key[];
        }>;
        default: import("../vc-tree/interface").Key[] | {
            checked: import("../vc-tree/interface").Key[];
            halfChecked: import("../vc-tree/interface").Key[];
        };
    };
    defaultCheckedKeys: {
        type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
        default: import("../vc-tree/interface").Key[];
    };
    selectedKeys: {
        type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
        default: import("../vc-tree/interface").Key[];
    };
    defaultSelectedKeys: {
        type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
        default: import("../vc-tree/interface").Key[];
    };
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadedKeys: {
        type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
        default: import("../vc-tree/interface").Key[];
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
        type: import("vue").PropType<(nodeProps: import("./Tree").AntdTreeNodeAttribute) => any>;
        default: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
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
        type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
        default: (keys: import("../vc-tree/interface").Key[]) => void;
    };
    'onUpdate:checkedKeys': {
        type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
        default: (keys: import("../vc-tree/interface").Key[]) => void;
    };
    'onUpdate:expandedKeys': {
        type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
        default: (keys: import("../vc-tree/interface").Key[]) => void;
    };
    focusable: {
        type: BooleanConstructor;
        default: any;
    };
    activeKey: import("vue").PropType<import("../vc-tree/interface").Key>;
    tabindex: NumberConstructor;
    children: import("vue-types").VueTypeValidableDef<any>;
    treeData: {
        type: import("vue").PropType<import("../vc-tree/interface").DataNode[]>;
    };
    fieldNames: {
        type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
    };
    expandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
    allowDrop: {
        type: import("vue").PropType<import("../vc-tree/props").AllowDrop<import("../vc-tree/interface").DataNode>>;
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
        type: import("vue").PropType<(expandedKeys: import("../vc-tree/interface").Key[], info: {
            node: import("../vc-tree/interface").EventDataNode;
            expanded: boolean;
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onCheck: {
        type: import("vue").PropType<(checked: import("../vc-tree/interface").Key[] | {
            checked: import("../vc-tree/interface").Key[];
            halfChecked: import("../vc-tree/interface").Key[];
        }, info: import("../vc-tree/props").CheckInfo) => void>;
    };
    onSelect: {
        type: import("vue").PropType<(selectedKeys: import("../vc-tree/interface").Key[], info: {
            event: "select";
            selected: boolean;
            node: import("../vc-tree/interface").EventDataNode;
            selectedNodes: import("../vc-tree/interface").DataNode[];
            nativeEvent: MouseEvent;
        }) => void>;
    };
    onLoad: {
        type: import("vue").PropType<(loadedKeys: import("../vc-tree/interface").Key[], info: {
            event: "load";
            node: import("../vc-tree/interface").EventDataNode;
        }) => void>;
    };
    loadData: {
        type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => Promise<any>>;
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
            node: import("../vc-tree/interface").EventDataNode;
        }) => void>;
    };
    onDragstart: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
    };
    onDragenter: {
        type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
            expandedKeys: import("../vc-tree/interface").Key[];
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
            dragNode: import("../vc-tree/interface").EventDataNode;
            dragNodesKeys: import("../vc-tree/interface").Key[];
            dropPosition: number;
            dropToGap: boolean;
        }) => void>;
    };
    onActiveChange: {
        type: import("vue").PropType<(key: import("../vc-tree/interface").Key) => void>;
    };
    filterTreeNode: {
        type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => boolean>;
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
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    draggable: boolean;
    icon: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
    multiple: boolean;
    disabled: boolean;
    virtual: boolean;
    selectedKeys: import("../vc-tree/interface").Key[];
    selectable: boolean;
    'onUpdate:selectedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
    checkable: boolean;
    expandedKeys: import("../vc-tree/interface").Key[];
    loadedKeys: import("../vc-tree/interface").Key[];
    checkedKeys: import("../vc-tree/interface").Key[] | {
        checked: import("../vc-tree/interface").Key[];
        halfChecked: import("../vc-tree/interface").Key[];
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
    defaultExpandedKeys: import("../vc-tree/interface").Key[];
    defaultCheckedKeys: import("../vc-tree/interface").Key[];
    defaultSelectedKeys: import("../vc-tree/interface").Key[];
    replaceFields: import("../vc-tree/interface").FieldNames;
    blockNode: boolean;
    'onUpdate:checkedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
    'onUpdate:expandedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
}, {}, string, import("../_util/type").CustomSlotsType<{
    icon?: any;
    title?: any;
    switcherIcon?: any;
    titleRender?: any;
    default?: any;
    leafIcon?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    DirectoryTree: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        expandAction: {
            type: import("vue").PropType<import("./DirectoryTree").ExpandAction>;
            default: import("./DirectoryTree").ExpandAction;
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
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        expandedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        checkedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }>;
            default: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            };
        };
        defaultCheckedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        defaultSelectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectable: {
            type: BooleanConstructor;
            default: boolean;
        };
        loadedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
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
            type: import("vue").PropType<(nodeProps: import("./Tree").AntdTreeNodeAttribute) => any>;
            default: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
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
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:checkedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:expandedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        focusable: {
            type: BooleanConstructor;
            default: any;
        };
        activeKey: import("vue").PropType<import("../vc-tree/interface").Key>;
        tabindex: NumberConstructor;
        children: import("vue-types").VueTypeValidableDef<any>;
        treeData: {
            type: import("vue").PropType<import("../vc-tree/interface").DataNode[]>;
        };
        fieldNames: {
            type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
        };
        allowDrop: {
            type: import("vue").PropType<import("../vc-tree/props").AllowDrop<import("../vc-tree/interface").DataNode>>;
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
            type: import("vue").PropType<(expandedKeys: import("../vc-tree/interface").Key[], info: {
                node: import("../vc-tree/interface").EventDataNode;
                expanded: boolean;
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onCheck: {
            type: import("vue").PropType<(checked: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }, info: import("../vc-tree/props").CheckInfo) => void>;
        };
        onSelect: {
            type: import("vue").PropType<(selectedKeys: import("../vc-tree/interface").Key[], info: {
                event: "select";
                selected: boolean;
                node: import("../vc-tree/interface").EventDataNode;
                selectedNodes: import("../vc-tree/interface").DataNode[];
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onLoad: {
            type: import("vue").PropType<(loadedKeys: import("../vc-tree/interface").Key[], info: {
                event: "load";
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        loadData: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => Promise<any>>;
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
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        onDragstart: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
        };
        onDragenter: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
                expandedKeys: import("../vc-tree/interface").Key[];
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
                dragNode: import("../vc-tree/interface").EventDataNode;
                dragNodesKeys: import("../vc-tree/interface").Key[];
                dropPosition: number;
                dropToGap: boolean;
            }) => void>;
        };
        onActiveChange: {
            type: import("vue").PropType<(key: import("../vc-tree/interface").Key) => void>;
        };
        filterTreeNode: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => boolean>;
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
    }>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        expandAction: {
            type: import("vue").PropType<import("./DirectoryTree").ExpandAction>;
            default: import("./DirectoryTree").ExpandAction;
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
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        expandedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        checkedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }>;
            default: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            };
        };
        defaultCheckedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        defaultSelectedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
        };
        selectable: {
            type: BooleanConstructor;
            default: boolean;
        };
        loadedKeys: {
            type: import("vue").PropType<import("../vc-tree/interface").Key[]>;
            default: import("../vc-tree/interface").Key[];
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
            type: import("vue").PropType<(nodeProps: import("./Tree").AntdTreeNodeAttribute) => any>;
            default: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
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
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:checkedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        'onUpdate:expandedKeys': {
            type: import("vue").PropType<(keys: import("../vc-tree/interface").Key[]) => void>;
            default: (keys: import("../vc-tree/interface").Key[]) => void;
        };
        focusable: {
            type: BooleanConstructor;
            default: any;
        };
        activeKey: import("vue").PropType<import("../vc-tree/interface").Key>;
        tabindex: NumberConstructor;
        children: import("vue-types").VueTypeValidableDef<any>;
        treeData: {
            type: import("vue").PropType<import("../vc-tree/interface").DataNode[]>;
        };
        fieldNames: {
            type: import("vue").PropType<import("../vc-tree/interface").FieldNames>;
        };
        allowDrop: {
            type: import("vue").PropType<import("../vc-tree/props").AllowDrop<import("../vc-tree/interface").DataNode>>;
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
            type: import("vue").PropType<(expandedKeys: import("../vc-tree/interface").Key[], info: {
                node: import("../vc-tree/interface").EventDataNode;
                expanded: boolean;
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onCheck: {
            type: import("vue").PropType<(checked: import("../vc-tree/interface").Key[] | {
                checked: import("../vc-tree/interface").Key[];
                halfChecked: import("../vc-tree/interface").Key[];
            }, info: import("../vc-tree/props").CheckInfo) => void>;
        };
        onSelect: {
            type: import("vue").PropType<(selectedKeys: import("../vc-tree/interface").Key[], info: {
                event: "select";
                selected: boolean;
                node: import("../vc-tree/interface").EventDataNode;
                selectedNodes: import("../vc-tree/interface").DataNode[];
                nativeEvent: MouseEvent;
            }) => void>;
        };
        onLoad: {
            type: import("vue").PropType<(loadedKeys: import("../vc-tree/interface").Key[], info: {
                event: "load";
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        loadData: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => Promise<any>>;
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
                node: import("../vc-tree/interface").EventDataNode;
            }) => void>;
        };
        onDragstart: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams) => void>;
        };
        onDragenter: {
            type: import("vue").PropType<(info: import("../vc-tree/contextTypes").NodeDragEventParams & {
                expandedKeys: import("../vc-tree/interface").Key[];
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
                dragNode: import("../vc-tree/interface").EventDataNode;
                dragNodesKeys: import("../vc-tree/interface").Key[];
                dropPosition: number;
                dropToGap: boolean;
            }) => void>;
        };
        onActiveChange: {
            type: import("vue").PropType<(key: import("../vc-tree/interface").Key) => void>;
        };
        filterTreeNode: {
            type: import("vue").PropType<(treeNode: import("../vc-tree/interface").EventDataNode) => boolean>;
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
        icon: (nodeProps: import("./Tree").AntdTreeNodeAttribute) => any;
        multiple: boolean;
        disabled: boolean;
        virtual: boolean;
        selectedKeys: import("../vc-tree/interface").Key[];
        selectable: boolean;
        'onUpdate:selectedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
        checkable: boolean;
        expandedKeys: import("../vc-tree/interface").Key[];
        loadedKeys: import("../vc-tree/interface").Key[];
        checkedKeys: import("../vc-tree/interface").Key[] | {
            checked: import("../vc-tree/interface").Key[];
            halfChecked: import("../vc-tree/interface").Key[];
        };
        showIcon: boolean;
        focusable: boolean;
        showLine: boolean | {
            showLeafIcon: boolean;
        };
        expandAction: import("./DirectoryTree").ExpandAction;
        checkStrictly: boolean;
        defaultExpandParent: boolean;
        autoExpandParent: boolean;
        defaultExpandAll: boolean;
        defaultExpandedKeys: import("../vc-tree/interface").Key[];
        defaultCheckedKeys: import("../vc-tree/interface").Key[];
        defaultSelectedKeys: import("../vc-tree/interface").Key[];
        replaceFields: import("../vc-tree/interface").FieldNames;
        blockNode: boolean;
        'onUpdate:checkedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
        'onUpdate:expandedKeys': (keys: import("../vc-tree/interface").Key[]) => void;
    }, import("../_util/type").CustomSlotsType<{
        icon?: any;
        title?: any;
        switcherIcon?: any;
        titleRender?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    TreeNode: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        eventKey: (StringConstructor | NumberConstructor)[];
        prefixCls: StringConstructor;
        title: import("vue-types").VueTypeValidableDef<any>;
        data: {
            type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
            default: import("../vc-tree/interface").DataNode;
        };
        parent: {
            type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
            default: import("../vc-tree/interface").DataNode;
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
            type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
            default: import("../vc-tree/interface").DataNode;
        };
        parent: {
            type: import("vue").PropType<import("../vc-tree/interface").DataNode>;
            default: import("../vc-tree/interface").DataNode;
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
        data: import("../vc-tree/interface").DataNode;
        active: boolean;
        disabled: boolean;
        selectable: boolean;
        checkable: boolean;
        disableCheckbox: boolean;
        isLeaf: boolean;
        parent: import("../vc-tree/interface").DataNode;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    install: (app: App) => App<any>;
};
export default _default;
