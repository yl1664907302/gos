import type { ExtractPropTypes, ImgHTMLAttributes, Plugin } from 'vue';
import { imageProps } from '../vc-image/src/Image';
import PreviewGroup from './PreviewGroup';
export type ImageProps = Partial<ExtractPropTypes<ReturnType<typeof imageProps>> & Omit<ImgHTMLAttributes, 'placeholder' | 'onClick'>>;
export { imageProps };
export { PreviewGroup as ImagePreviewGroup };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        src: StringConstructor;
        wrapperClassName: StringConstructor;
        wrapperStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        rootClassName: StringConstructor;
        prefixCls: StringConstructor;
        previewPrefixCls: StringConstructor;
        width: (StringConstructor | NumberConstructor)[];
        height: (StringConstructor | NumberConstructor)[];
        previewMask: {
            type: import("vue").PropType<false | (() => any)>;
            default: any;
        };
        placeholder: import("vue-types").VueTypeValidableDef<any>;
        fallback: StringConstructor;
        preview: {
            type: import("vue").PropType<boolean | import("../vc-image").ImagePreviewType>;
            default: boolean | import("../vc-image").ImagePreviewType;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        };
        onError: {
            type: import("vue").PropType<OnErrorEventHandlerNonNull>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        preview: boolean | import("../vc-image").ImagePreviewType;
        wrapperStyle: import("vue").CSSProperties;
        previewMask: false | (() => any);
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        src: StringConstructor;
        wrapperClassName: StringConstructor;
        wrapperStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        rootClassName: StringConstructor;
        prefixCls: StringConstructor;
        previewPrefixCls: StringConstructor;
        width: (StringConstructor | NumberConstructor)[];
        height: (StringConstructor | NumberConstructor)[];
        previewMask: {
            type: import("vue").PropType<false | (() => any)>;
            default: any;
        };
        placeholder: import("vue-types").VueTypeValidableDef<any>;
        fallback: StringConstructor;
        preview: {
            type: import("vue").PropType<boolean | import("../vc-image").ImagePreviewType>;
            default: boolean | import("../vc-image").ImagePreviewType;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        };
        onError: {
            type: import("vue").PropType<OnErrorEventHandlerNonNull>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        preview: boolean | import("../vc-image").ImagePreviewType;
        wrapperStyle: import("vue").CSSProperties;
        previewMask: false | (() => any);
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    src: StringConstructor;
    wrapperClassName: StringConstructor;
    wrapperStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    rootClassName: StringConstructor;
    prefixCls: StringConstructor;
    previewPrefixCls: StringConstructor;
    width: (StringConstructor | NumberConstructor)[];
    height: (StringConstructor | NumberConstructor)[];
    previewMask: {
        type: import("vue").PropType<false | (() => any)>;
        default: any;
    };
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    fallback: StringConstructor;
    preview: {
        type: import("vue").PropType<boolean | import("../vc-image").ImagePreviewType>;
        default: boolean | import("../vc-image").ImagePreviewType;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
    };
    onError: {
        type: import("vue").PropType<OnErrorEventHandlerNonNull>;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    preview: boolean | import("../vc-image").ImagePreviewType;
    wrapperStyle: import("vue").CSSProperties;
    previewMask: false | (() => any);
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly PreviewGroup: typeof PreviewGroup;
};
export default _default;
