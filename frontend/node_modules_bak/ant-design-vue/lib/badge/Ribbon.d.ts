import type { CustomSlotsType, LiteralUnion } from '../_util/type';
import type { PresetColorType } from '../_util/colors';
import type { PropType, ExtractPropTypes } from 'vue';
export declare const ribbonProps: () => {
    prefix: StringConstructor;
    color: {
        type: PropType<LiteralUnion<PresetColorType>>;
    };
    text: import("vue-types").VueTypeValidableDef<any>;
    placement: {
        type: PropType<"end" | "start">;
        default: string;
    };
};
export type RibbonProps = Partial<ExtractPropTypes<ReturnType<typeof ribbonProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefix: StringConstructor;
    color: {
        type: PropType<LiteralUnion<PresetColorType>>;
    };
    text: import("vue-types").VueTypeValidableDef<any>;
    placement: {
        type: PropType<"end" | "start">;
        default: string;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefix: StringConstructor;
    color: {
        type: PropType<LiteralUnion<PresetColorType>>;
    };
    text: import("vue-types").VueTypeValidableDef<any>;
    placement: {
        type: PropType<"end" | "start">;
        default: string;
    };
}>> & Readonly<{}>, {
    placement: "end" | "start";
}, CustomSlotsType<{
    text: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
