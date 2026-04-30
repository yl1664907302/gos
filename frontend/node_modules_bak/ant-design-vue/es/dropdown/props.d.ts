import type { CSSProperties, PropType } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
export type Align = {
    points?: [string, string];
    offset?: [number, number];
    targetOffset?: [number, number];
    overflow?: {
        adjustX?: boolean;
        adjustY?: boolean;
    };
    useCssRight?: boolean;
    useCssBottom?: boolean;
    useCssTransform?: boolean;
};
export type Trigger = 'click' | 'hover' | 'contextmenu';
export type DropdownArrowOptions = {
    pointAtCenter?: boolean;
};
declare const dropdownProps: () => {
    arrow: {
        type: PropType<boolean | DropdownArrowOptions>;
        default: boolean | DropdownArrowOptions;
    };
    trigger: {
        type: PropType<Trigger | Trigger[]>;
    };
    menu: {
        type: PropType<Partial<import("vue").ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: PropType<import("../menu").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: PropType<import("../_util/type").Key[]>;
            selectedKeys: PropType<import("../_util/type").Key[]>;
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
            motion: PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: PropType<import("../menu").MenuTheme>;
                default: string;
            };
            mode: {
                type: PropType<import("../menu").MenuMode>;
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
                type: PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: PropType<MouseEventHandler>;
            'onUpdate:openKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': PropType<(key: import("../_util/type").Key) => void>;
        }>>>;
        default: Partial<import("vue").ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: PropType<import("../menu").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: PropType<import("../_util/type").Key[]>;
            selectedKeys: PropType<import("../_util/type").Key[]>;
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
            motion: PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: PropType<import("../menu").MenuTheme>;
                default: string;
            };
            mode: {
                type: PropType<import("../menu").MenuMode>;
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
                type: PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: PropType<MouseEventHandler>;
            'onUpdate:openKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': PropType<(key: import("../_util/type").Key) => void>;
        }>>;
    };
    overlay: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated Please use `open` instead */
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
        type: PropType<Align>;
        default: Align;
    };
    getPopupContainer: PropType<(triggerNode: HTMLElement) => HTMLElement>;
    prefixCls: StringConstructor;
    transitionName: StringConstructor;
    placement: PropType<"top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "topCenter" | "bottomCenter">;
    overlayClassName: StringConstructor;
    overlayStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
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
    /** @deprecated Please use `onOpenChange` instead */
    onVisibleChange: {
        type: PropType<(val: boolean) => void>;
    };
    /** @deprecated Please use `onUpdate:open` instead */
    'onUpdate:visible': {
        type: PropType<(val: boolean) => void>;
    };
    onOpenChange: {
        type: PropType<(val: boolean) => void>;
    };
    'onUpdate:open': {
        type: PropType<(val: boolean) => void>;
    };
};
declare const dropdownButtonProps: () => {
    type: PropType<import("../button/buttonTypes").ButtonType>;
    size: PropType<"small" | "large">;
    htmlType: {
        type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
        default: string;
    };
    href: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    icon: import("vue-types").VueTypeValidableDef<any>;
    title: StringConstructor;
    loading: {
        type: PropType<boolean | {
            delay?: number;
        }>;
        default: () => boolean | {
            delay?: number;
        };
    };
    onClick: {
        type: PropType<MouseEventHandler | MouseEventHandler[]>;
    };
    arrow: {
        type: PropType<boolean | DropdownArrowOptions>;
        default: boolean | DropdownArrowOptions;
    };
    trigger: {
        type: PropType<Trigger | Trigger[]>;
    };
    menu: {
        type: PropType<Partial<import("vue").ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: PropType<import("../menu").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: PropType<import("../_util/type").Key[]>;
            selectedKeys: PropType<import("../_util/type").Key[]>;
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
            motion: PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: PropType<import("../menu").MenuTheme>;
                default: string;
            };
            mode: {
                type: PropType<import("../menu").MenuMode>;
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
                type: PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: PropType<MouseEventHandler>;
            'onUpdate:openKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': PropType<(key: import("../_util/type").Key) => void>;
        }>>>;
        default: Partial<import("vue").ExtractPropTypes<{
            id: StringConstructor;
            prefixCls: StringConstructor;
            items: PropType<import("../menu").ItemType[]>;
            disabled: BooleanConstructor;
            inlineCollapsed: BooleanConstructor;
            disabledOverflow: BooleanConstructor;
            forceSubMenuRender: BooleanConstructor;
            openKeys: PropType<import("../_util/type").Key[]>;
            selectedKeys: PropType<import("../_util/type").Key[]>;
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
            motion: PropType<import("../_util/transition").CSSMotionProps>;
            role: StringConstructor;
            theme: {
                type: PropType<import("../menu").MenuTheme>;
                default: string;
            };
            mode: {
                type: PropType<import("../menu").MenuMode>;
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
                type: PropType<import("../menu/src/interface").BuiltinPlacements>;
            };
            triggerSubMenuAction: {
                type: PropType<import("../menu/src/interface").TriggerSubMenuAction>;
                default: string;
            };
            getPopupContainer: PropType<(node: HTMLElement) => HTMLElement>;
            expandIcon: PropType<(p?: {
                [key: string]: any;
                isOpen: boolean;
            }) => any>;
            onOpenChange: PropType<(keys: import("../_util/type").Key[]) => void>;
            onSelect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onDeselect: PropType<import("../menu/src/interface").SelectEventHandler>;
            onClick: PropType<import("../menu/src/interface").MenuClickEventHandler>;
            onFocus: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onBlur: PropType<import("../_util/EventInterface").FocusEventHandler>;
            onMousedown: PropType<MouseEventHandler>;
            'onUpdate:openKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:selectedKeys': PropType<(keys: import("../_util/type").Key[]) => void>;
            'onUpdate:activeKey': PropType<(key: import("../_util/type").Key) => void>;
        }>>;
    };
    overlay: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated Please use `open` instead */
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    open: {
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
        type: PropType<Align>;
        default: Align;
    };
    getPopupContainer: PropType<(triggerNode: HTMLElement) => HTMLElement>;
    transitionName: StringConstructor;
    placement: PropType<"top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "topCenter" | "bottomCenter">;
    overlayClassName: StringConstructor;
    overlayStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
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
    /** @deprecated Please use `onOpenChange` instead */
    onVisibleChange: {
        type: PropType<(val: boolean) => void>;
    };
    /** @deprecated Please use `onUpdate:open` instead */
    'onUpdate:visible': {
        type: PropType<(val: boolean) => void>;
    };
    onOpenChange: {
        type: PropType<(val: boolean) => void>;
    };
    'onUpdate:open': {
        type: PropType<(val: boolean) => void>;
    };
};
export { dropdownProps, dropdownButtonProps };
export default dropdownProps;
