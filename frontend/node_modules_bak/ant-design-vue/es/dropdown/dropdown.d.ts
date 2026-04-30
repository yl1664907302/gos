import type { ExtractPropTypes } from 'vue';
import { dropdownProps } from './props';
import type { CustomSlotsType } from '../_util/type';
export type DropdownProps = Partial<ExtractPropTypes<ReturnType<typeof dropdownProps>>>;
declare const Dropdown: import("vue").DefineComponent<ExtractPropTypes<{
    arrow: {
        type: import("vue").PropType<boolean | import("./props").DropdownArrowOptions>;
        default: boolean | import("./props").DropdownArrowOptions;
    };
    trigger: {
        type: import("vue").PropType<import("./props").Trigger | import("./props").Trigger[]>;
    };
    menu: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: import("vue").PropType<import("..").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: import("vue").PropType<import("../_util/type").Key[]>;
            selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
            activeKey: StringConstructor;
            selectable: {
                type: BooleanConstructor;
                default: boolean;
            };
            multiple: {
                type: BooleanConstructor;
                default: boolean;
            };
            tabindex: {
                type: (StringConstructor | NumberConstructor)[];
            };
            motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: import("vue").PropType<import("..").MenuTheme>;
                default: string;
            };
            mode: {
                type: import("vue").PropType<import("..").MenuMode>;
                default: string;
            };
            inlineIndent: {
                type: NumberConstructor;
                default: number;
            };
            subMenuOpenDelay: {
                type: NumberConstructor;
                default: number;
            };
            subMenuCloseDelay: {
                type: NumberConstructor;
                default: number;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: import("vue").PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: import("vue").PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: import("vue").PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
        }>>>;
        default: Partial<ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: import("vue").PropType<import("..").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: import("vue").PropType<import("../_util/type").Key[]>;
            selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
            activeKey: StringConstructor;
            selectable: {
                type: BooleanConstructor;
                default: boolean;
            };
            multiple: {
                type: BooleanConstructor;
                default: boolean;
            };
            tabindex: {
                type: (StringConstructor | NumberConstructor)[];
            };
            motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: import("vue").PropType<import("..").MenuTheme>;
                default: string;
            };
            mode: {
                type: import("vue").PropType<import("..").MenuMode>;
                default: string;
            };
            inlineIndent: {
                type: NumberConstructor;
                default: number;
            };
            subMenuOpenDelay: {
                type: NumberConstructor;
                default: number;
            };
            subMenuCloseDelay: {
                type: NumberConstructor;
                default: number;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: import("vue").PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: import("vue").PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: import("vue").PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
        }>>;
    };
    overlay: import("vue-types").VueTypeValidableDef<any>;
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    danger: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    align: {
        type: import("vue").PropType<import("./props").Align>;
        default: import("./props").Align;
    };
    getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
    prefixCls: StringConstructor;
    transitionName: StringConstructor;
    placement: import("vue").PropType<"top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "topCenter" | "bottomCenter">;
    overlayClassName: StringConstructor;
    overlayStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    forceRender: {
        type: BooleanConstructor;
        default: boolean;
    };
    mouseEnterDelay: NumberConstructor;
    mouseLeaveDelay: NumberConstructor;
    openClassName: StringConstructor;
    minOverlayWidthMatchTrigger: {
        type: BooleanConstructor;
        default: boolean;
    };
    destroyPopupOnHide: {
        type: BooleanConstructor;
        default: boolean;
    };
    onVisibleChange: {
        type: import("vue").PropType<(val: boolean) => void>;
    };
    'onUpdate:visible': {
        type: import("vue").PropType<(val: boolean) => void>;
    };
    onOpenChange: {
        type: import("vue").PropType<(val: boolean) => void>;
    };
    'onUpdate:open': {
        type: import("vue").PropType<(val: boolean) => void>;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    arrow: {
        type: import("vue").PropType<boolean | import("./props").DropdownArrowOptions>;
        default: boolean | import("./props").DropdownArrowOptions;
    };
    trigger: {
        type: import("vue").PropType<import("./props").Trigger | import("./props").Trigger[]>;
    };
    menu: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: import("vue").PropType<import("..").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: import("vue").PropType<import("../_util/type").Key[]>;
            selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
            activeKey: StringConstructor;
            selectable: {
                type: BooleanConstructor;
                default: boolean;
            };
            multiple: {
                type: BooleanConstructor;
                default: boolean;
            };
            tabindex: {
                type: (StringConstructor | NumberConstructor)[];
            };
            motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: import("vue").PropType<import("..").MenuTheme>;
                default: string;
            };
            mode: {
                type: import("vue").PropType<import("..").MenuMode>;
                default: string;
            };
            inlineIndent: {
                type: NumberConstructor;
                default: number;
            };
            subMenuOpenDelay: {
                type: NumberConstructor;
                default: number;
            };
            subMenuCloseDelay: {
                type: NumberConstructor;
                default: number;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: import("vue").PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: import("vue").PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: import("vue").PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
        }>>>;
        default: Partial<ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: import("vue").PropType<import("..").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: import("vue").PropType<import("../_util/type").Key[]>;
            selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
            activeKey: StringConstructor;
            selectable: {
                type: BooleanConstructor;
                default: boolean;
            };
            multiple: {
                type: BooleanConstructor;
                default: boolean;
            };
            tabindex: {
                type: (StringConstructor | NumberConstructor)[];
            };
            motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: import("vue").PropType<import("..").MenuTheme>;
                default: string;
            };
            mode: {
                type: import("vue").PropType<import("..").MenuMode>;
                default: string;
            };
            inlineIndent: {
                type: NumberConstructor;
                default: number;
            };
            subMenuOpenDelay: {
                type: NumberConstructor;
                default: number;
            };
            subMenuCloseDelay: {
                type: NumberConstructor;
                default: number;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: import("vue").PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: import("vue").PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: import("vue").PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
        }>>;
    };
    overlay: import("vue-types").VueTypeValidableDef<any>;
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    danger: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    align: {
        type: import("vue").PropType<import("./props").Align>;
        default: import("./props").Align;
    };
    getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
    prefixCls: StringConstructor;
    transitionName: StringConstructor;
    placement: import("vue").PropType<"top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "topCenter" | "bottomCenter">;
    overlayClassName: StringConstructor;
    overlayStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    forceRender: {
        type: BooleanConstructor;
        default: boolean;
    };
    mouseEnterDelay: NumberConstructor;
    mouseLeaveDelay: NumberConstructor;
    openClassName: StringConstructor;
    minOverlayWidthMatchTrigger: {
        type: BooleanConstructor;
        default: boolean;
    };
    destroyPopupOnHide: {
        type: BooleanConstructor;
        default: boolean;
    };
    onVisibleChange: {
        type: import("vue").PropType<(val: boolean) => void>;
    };
    'onUpdate:visible': {
        type: import("vue").PropType<(val: boolean) => void>;
    };
    onOpenChange: {
        type: import("vue").PropType<(val: boolean) => void>;
    };
    'onUpdate:open': {
        type: import("vue").PropType<(val: boolean) => void>;
    };
}>> & Readonly<{}>, {
    menu: Partial<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        items: import("vue").PropType<import("..").ItemType[]>;
        disabled: BooleanConstructor;
        inlineCollapsed: BooleanConstructor;
        disabledOverflow: BooleanConstructor;
        forceSubMenuRender: BooleanConstructor;
        openKeys: import("vue").PropType<import("../_util/type").Key[]>;
        selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
        activeKey: StringConstructor;
        selectable: {
            type: BooleanConstructor;
            default: boolean;
        };
        multiple: {
            type: BooleanConstructor;
            default: boolean;
        };
        tabindex: {
            type: (StringConstructor | NumberConstructor)[];
        };
        motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
        role: StringConstructor;
        theme: {
            type: import("vue").PropType<import("..").MenuTheme>;
            default: string;
        };
        mode: {
            type: import("vue").PropType<import("..").MenuMode>;
            default: string;
        };
        inlineIndent: {
            type: NumberConstructor;
            default: number;
        };
        subMenuOpenDelay: {
            type: NumberConstructor;
            default: number;
        };
        subMenuCloseDelay: {
            type: NumberConstructor;
            default: number;
        };
        builtinPlacements: {
            type: import("vue").PropType<import("../menu/src/interface").BuiltinPlacements>;
        };
        triggerSubMenuAction: {
            type: import("vue").PropType<import("../menu/src/interface").TriggerSubMenuAction>;
            default: string;
        };
        getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        expandIcon: import("vue").PropType<(p?: {
            [key: string]: any;
            isOpen: boolean;
        }) => any>;
        onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        onSelect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
        onDeselect: import("vue").PropType<import("../menu/src/interface").SelectEventHandler>;
        onClick: import("vue").PropType<import("../menu/src/interface").MenuClickEventHandler>;
        onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
    }>>;
    open: boolean;
    visible: boolean;
    disabled: boolean;
    align: import("./props").Align;
    autofocus: boolean;
    arrow: boolean | import("./props").DropdownArrowOptions;
    forceRender: boolean;
    destroyPopupOnHide: boolean;
    overlayStyle: import("vue").CSSProperties;
    danger: boolean;
    minOverlayWidthMatchTrigger: boolean;
}, CustomSlotsType<{
    default?: any;
    overlay?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Dropdown;
