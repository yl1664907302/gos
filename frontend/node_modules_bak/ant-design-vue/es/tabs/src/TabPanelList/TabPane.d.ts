import type { ExtractPropTypes } from 'vue';
import type { CustomSlotsType } from '../../../_util/type';
declare const tabPaneProps: () => {
    tab: import("vue-types").VueTypeValidableDef<any>;
    disabled: {
        type: BooleanConstructor;
    };
    forceRender: {
        type: BooleanConstructor;
    };
    closable: {
        type: BooleanConstructor;
    };
    animated: {
        type: BooleanConstructor;
    };
    active: {
        type: BooleanConstructor;
    };
    destroyInactiveTabPane: {
        type: BooleanConstructor;
    };
    prefixCls: {
        type: StringConstructor;
    };
    tabKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    id: {
        type: StringConstructor;
    };
};
export type TabPaneProps = Partial<ExtractPropTypes<ReturnType<typeof tabPaneProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    tab: import("vue-types").VueTypeValidableDef<any>;
    disabled: {
        type: BooleanConstructor;
    };
    forceRender: {
        type: BooleanConstructor;
    };
    closable: {
        type: BooleanConstructor;
    };
    animated: {
        type: BooleanConstructor;
    };
    active: {
        type: BooleanConstructor;
    };
    destroyInactiveTabPane: {
        type: BooleanConstructor;
    };
    prefixCls: {
        type: StringConstructor;
    };
    tabKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    id: {
        type: StringConstructor;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    tab: import("vue-types").VueTypeValidableDef<any>;
    disabled: {
        type: BooleanConstructor;
    };
    forceRender: {
        type: BooleanConstructor;
    };
    closable: {
        type: BooleanConstructor;
    };
    animated: {
        type: BooleanConstructor;
    };
    active: {
        type: BooleanConstructor;
    };
    destroyInactiveTabPane: {
        type: BooleanConstructor;
    };
    prefixCls: {
        type: StringConstructor;
    };
    tabKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    id: {
        type: StringConstructor;
    };
}>> & Readonly<{}>, {
    active: boolean;
    disabled: boolean;
    forceRender: boolean;
    animated: boolean;
    closable: boolean;
    destroyInactiveTabPane: boolean;
}, CustomSlotsType<{
    closeIcon: any;
    tab: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
