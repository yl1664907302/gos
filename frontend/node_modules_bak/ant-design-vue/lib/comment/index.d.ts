import type { ExtractPropTypes } from 'vue';
import type { CustomSlotsType, VueNode } from '../_util/type';
export declare const commentProps: () => {
    actions: ArrayConstructor;
    /** The element to display as the comment author. */
    author: import("vue-types").VueTypeValidableDef<any>;
    /** The element to display as the comment avatar - generally an antd Avatar */
    avatar: import("vue-types").VueTypeValidableDef<any>;
    /** The main content of the comment */
    content: import("vue-types").VueTypeValidableDef<any>;
    /** Comment prefix defaults to '.ant-comment' */
    prefixCls: StringConstructor;
    /** A datetime element containing the time to be displayed */
    datetime: import("vue-types").VueTypeValidableDef<any>;
};
export type CommentProps = Partial<ExtractPropTypes<ReturnType<typeof commentProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        actions: ArrayConstructor;
        /** The element to display as the comment author. */
        author: import("vue-types").VueTypeValidableDef<any>;
        /** The element to display as the comment avatar - generally an antd Avatar */
        avatar: import("vue-types").VueTypeValidableDef<any>;
        /** The main content of the comment */
        content: import("vue-types").VueTypeValidableDef<any>;
        /** Comment prefix defaults to '.ant-comment' */
        prefixCls: StringConstructor;
        /** A datetime element containing the time to be displayed */
        datetime: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, CustomSlotsType<{
        actions: any;
        author: any;
        avatar: any;
        content: any;
        datetime: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        actions: ArrayConstructor;
        /** The element to display as the comment author. */
        author: import("vue-types").VueTypeValidableDef<any>;
        /** The element to display as the comment avatar - generally an antd Avatar */
        avatar: import("vue-types").VueTypeValidableDef<any>;
        /** The main content of the comment */
        content: import("vue-types").VueTypeValidableDef<any>;
        /** Comment prefix defaults to '.ant-comment' */
        prefixCls: StringConstructor;
        /** A datetime element containing the time to be displayed */
        datetime: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    actions: ArrayConstructor;
    /** The element to display as the comment author. */
    author: import("vue-types").VueTypeValidableDef<any>;
    /** The element to display as the comment avatar - generally an antd Avatar */
    avatar: import("vue-types").VueTypeValidableDef<any>;
    /** The main content of the comment */
    content: import("vue-types").VueTypeValidableDef<any>;
    /** Comment prefix defaults to '.ant-comment' */
    prefixCls: StringConstructor;
    /** A datetime element containing the time to be displayed */
    datetime: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, CustomSlotsType<{
    actions: any;
    author: any;
    avatar: any;
    content: any;
    datetime: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
