import type { HTMLAttributes, PropType } from 'vue';
import type { Direction } from '../config-provider';
export interface TypographyProps extends HTMLAttributes {
    direction?: Direction;
    prefixCls?: string;
}
export interface InternalTypographyProps extends TypographyProps {
    component?: string;
}
export declare const typographyProps: () => {
    prefixCls: StringConstructor;
    direction: PropType<Direction>;
    component: StringConstructor;
};
declare const Typography: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    direction: PropType<Direction>;
    component: StringConstructor;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    direction: PropType<Direction>;
    component: StringConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Typography;
