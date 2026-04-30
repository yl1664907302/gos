import type { ExtractPropTypes } from 'vue';
export declare const flexProps: () => {
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
    wrap: {
        type: import("vue").PropType<import("csstype").Property.FlexWrap>;
        default: import("csstype").Property.FlexWrap;
    };
    justify: {
        type: import("vue").PropType<import("csstype").Property.JustifyContent>;
        default: import("csstype").Property.JustifyContent;
    };
    align: {
        type: import("vue").PropType<import("csstype").Property.AlignItems>;
        default: import("csstype").Property.AlignItems;
    };
    flex: {
        type: import("vue").PropType<import("csstype").Property.Flex<string | number>>;
        default: import("csstype").Property.Flex<string | number>;
    };
    gap: {
        type: import("vue").PropType<string | number | (string & {})>;
        default: string | number | (string & {});
    };
    component: {
        default: any;
        type: import("vue").PropType<any>;
    };
};
export type FlexProps = Partial<ExtractPropTypes<ReturnType<typeof flexProps>> & HTMLElement>;
