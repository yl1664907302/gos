/** @private Test usage only */
export declare function getOpenCount(): number;
export type GetContainer = string | HTMLElement | (() => HTMLElement);
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    wrapperClassName: StringConstructor;
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getContainer: import("vue-types").VueTypeValidableDef<any>;
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    autoLock: {
        type: BooleanConstructor;
        default: boolean;
    };
    didUpdate: FunctionConstructor;
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    wrapperClassName: StringConstructor;
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getContainer: import("vue-types").VueTypeValidableDef<any>;
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    autoLock: {
        type: BooleanConstructor;
        default: boolean;
    };
    didUpdate: FunctionConstructor;
}>> & Readonly<{}>, {
    visible: boolean;
    forceRender: boolean;
    autoLock: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
