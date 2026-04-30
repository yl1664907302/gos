import type { Plugin } from 'vue';
import Base from './Base';
import Link from './Link';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';
export type { TypographyProps } from './Typography';
export { Text as TypographyText, Title as TypographyTitle, Paragraph as TypographyParagraph, Link as TypographyLink, };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        direction: import("vue").PropType<import("../config-provider").Direction>;
        component: StringConstructor;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        direction: import("vue").PropType<import("../config-provider").Direction>;
        component: StringConstructor;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    direction: import("vue").PropType<import("../config-provider").Direction>;
    component: StringConstructor;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Text: typeof Text;
    readonly Title: typeof Title;
    readonly Paragraph: typeof Paragraph;
    readonly Link: typeof Link;
    readonly Base: typeof Base;
};
export default _default;
