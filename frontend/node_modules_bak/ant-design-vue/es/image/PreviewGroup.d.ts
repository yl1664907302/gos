import type { PreviewGroupPreview } from '../vc-image/src/PreviewGroup';
import type { ExtractPropTypes } from 'vue';
export declare const icons: {
    rotateLeft: import("vue/jsx-runtime").JSX.Element;
    rotateRight: import("vue/jsx-runtime").JSX.Element;
    zoomIn: import("vue/jsx-runtime").JSX.Element;
    zoomOut: import("vue/jsx-runtime").JSX.Element;
    close: import("vue/jsx-runtime").JSX.Element;
    left: import("vue/jsx-runtime").JSX.Element;
    right: import("vue/jsx-runtime").JSX.Element;
    flipX: import("vue/jsx-runtime").JSX.Element;
    flipY: import("vue/jsx-runtime").JSX.Element;
};
declare const previewGroupProps: () => {
    previewPrefixCls: StringConstructor;
    preview: {
        default: boolean | PreviewGroupPreview;
        type: import("vue").PropType<boolean | PreviewGroupPreview>;
    };
};
export type ImageGroupProps = Partial<ExtractPropTypes<ReturnType<typeof previewGroupProps>>>;
declare const InternalPreviewGroup: import("vue").DefineComponent<ExtractPropTypes<{
    previewPrefixCls: StringConstructor;
    preview: {
        default: boolean | PreviewGroupPreview;
        type: import("vue").PropType<boolean | PreviewGroupPreview>;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    previewPrefixCls: StringConstructor;
    preview: {
        default: boolean | PreviewGroupPreview;
        type: import("vue").PropType<boolean | PreviewGroupPreview>;
    };
}>> & Readonly<{}>, {
    preview: boolean | PreviewGroupPreview;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default InternalPreviewGroup;
