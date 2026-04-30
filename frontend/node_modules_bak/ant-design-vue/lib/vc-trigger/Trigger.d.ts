declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    action: import("vue-types").VueTypeDef<string | string[]> & {
        default: string | (() => string[]);
    };
    showAction: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    hideAction: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    getPopupClassNameFromAlign: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    onPopupVisibleChange: import("vue").PropType<(open: boolean) => void>;
    afterPopupVisibleChange: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    popup: import("vue-types").VueTypeValidableDef<any>;
    arrow: import("vue-types").VueTypeValidableDef<boolean> & {
        default: boolean;
    } & {
        default: boolean;
    };
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    popupClassName: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    popupPlacement: StringConstructor;
    builtinPlacements: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    popupTransitionName: StringConstructor;
    popupAnimation: import("vue-types").VueTypeValidableDef<any>;
    mouseEnterDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    mouseLeaveDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    zIndex: NumberConstructor;
    focusDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    blurDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    getPopupContainer: FunctionConstructor;
    getDocument: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    destroyPopupOnHide: {
        type: BooleanConstructor;
        default: boolean;
    };
    mask: {
        type: BooleanConstructor;
        default: boolean;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: boolean;
    };
    popupAlign: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    } & {
        default: () => {
            [key: string]: any;
        };
    };
    popupVisible: {
        type: BooleanConstructor;
        default: any;
    };
    defaultPopupVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    maskTransitionName: StringConstructor;
    maskAnimation: StringConstructor;
    stretch: StringConstructor;
    alignPoint: {
        type: BooleanConstructor;
        default: any;
    };
    autoDestroy: {
        type: BooleanConstructor;
        default: boolean;
    };
    mobile: ObjectConstructor;
    getTriggerDOMNode: import("vue").PropType<(d?: HTMLElement) => HTMLElement>;
}>, {
    vcTriggerContext: {
        onPopupMouseDown?: (...args: any[]) => void;
        onPopupMouseenter?: (...args: any[]) => void;
        onPopupMouseleave?: (...args: any[]) => void;
    };
    popupRef: import("vue").ShallowRef<any, any>;
    setPopupRef: (val: any) => void;
    triggerRef: import("vue").ShallowRef<any, any>;
    align: import("vue").ComputedRef<{
        [key: string]: any;
    }>;
    focusTime: any;
    clickOutsideHandler: any;
    contextmenuOutsideHandler1: any;
    contextmenuOutsideHandler2: any;
    touchOutsideHandler: any;
    attachId: any;
    delayTimer: any;
    hasPopupMouseDown: boolean;
    preClickTime: any;
    preTouchTime: any;
    mouseDownTimeout: any;
    childOriginEvents: {};
}, {
    prevPopupVisible: any;
    sPopupVisible: any;
    point: any;
}, {}, {
    updatedCal(): void;
    onMouseenter(e: any): void;
    onMouseMove(e: any): void;
    onMouseleave(e: any): void;
    onPopupMouseenter(): void;
    onPopupMouseleave(e: any): void;
    onFocus(e: any): void;
    onMousedown(e: any): void;
    onTouchstart(e: any): void;
    onBlur(e: any): void;
    onContextmenu(e: any): void;
    onContextmenuClose(): void;
    onClick(event: any): void;
    onPopupMouseDown(...args: any[]): void;
    onDocumentClick(event: any): void;
    getPopupDomNode(): any;
    getRootDomNode(): any;
    handleGetPopupClassFromAlign(align: any): string;
    getPopupAlign(): any;
    getComponent(): import("vue/jsx-runtime").JSX.Element;
    attachParent(popupContainer: any): void;
    getContainer(): any;
    setPopupVisible(sPopupVisible: boolean, event?: any): void;
    setPoint(point: any): void;
    handlePortalUpdate(): void;
    delaySetPopupVisible(visible: boolean, delayS: number, event?: any): void;
    clearDelayTimer(): void;
    clearOutsideHandler(): void;
    createTwoChains(event: string): any;
    isClickToShow(): boolean;
    isContextMenuOnly(): boolean;
    isContextmenuToShow(): boolean;
    isClickToHide(): boolean;
    isMouseEnterToShow(): boolean;
    isMouseLeaveToHide(): boolean;
    isFocusToShow(): boolean;
    isBlurToHide(): boolean;
    forcePopupAlign(): void;
    fireEvents(type: string, e: Event): void;
    close(): void;
}, {
    methods: {
        setState(state: {}, callback: () => any): void;
        __emit(): void;
    };
}, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    action: import("vue-types").VueTypeDef<string | string[]> & {
        default: string | (() => string[]);
    };
    showAction: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    hideAction: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    getPopupClassNameFromAlign: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    onPopupVisibleChange: import("vue").PropType<(open: boolean) => void>;
    afterPopupVisibleChange: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    popup: import("vue-types").VueTypeValidableDef<any>;
    arrow: import("vue-types").VueTypeValidableDef<boolean> & {
        default: boolean;
    } & {
        default: boolean;
    };
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    popupClassName: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    popupPlacement: StringConstructor;
    builtinPlacements: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    popupTransitionName: StringConstructor;
    popupAnimation: import("vue-types").VueTypeValidableDef<any>;
    mouseEnterDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    mouseLeaveDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    zIndex: NumberConstructor;
    focusDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    blurDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    getPopupContainer: FunctionConstructor;
    getDocument: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    destroyPopupOnHide: {
        type: BooleanConstructor;
        default: boolean;
    };
    mask: {
        type: BooleanConstructor;
        default: boolean;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: boolean;
    };
    popupAlign: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    } & {
        default: () => {
            [key: string]: any;
        };
    };
    popupVisible: {
        type: BooleanConstructor;
        default: any;
    };
    defaultPopupVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    maskTransitionName: StringConstructor;
    maskAnimation: StringConstructor;
    stretch: StringConstructor;
    alignPoint: {
        type: BooleanConstructor;
        default: any;
    };
    autoDestroy: {
        type: BooleanConstructor;
        default: boolean;
    };
    mobile: ObjectConstructor;
    getTriggerDOMNode: import("vue").PropType<(d?: HTMLElement) => HTMLElement>;
}>> & Readonly<{}>, {
    mask: boolean;
    prefixCls: string;
    action: string | string[];
    showAction: any;
    hideAction: any;
    getPopupClassNameFromAlign: any;
    afterPopupVisibleChange: (...args: any[]) => any;
    arrow: boolean;
    popupStyle: import("vue").CSSProperties;
    popupClassName: string;
    builtinPlacements: {
        [key: string]: any;
    };
    mouseEnterDelay: number;
    mouseLeaveDelay: number;
    focusDelay: number;
    blurDelay: number;
    getDocument: (...args: any[]) => any;
    forceRender: boolean;
    destroyPopupOnHide: boolean;
    maskClosable: boolean;
    popupAlign: {
        [key: string]: any;
    };
    popupVisible: boolean;
    defaultPopupVisible: boolean;
    alignPoint: boolean;
    autoDestroy: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
