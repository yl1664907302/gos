import type { PropType, Ref, ComputedRef } from 'vue';
import { type ImagePreviewType } from './Image';
import type { PreviewProps } from './Preview';
export interface PreviewGroupPreview extends Omit<ImagePreviewType, 'icons' | 'mask' | 'maskClassName'> {
    /**
     * If Preview the show img index
     * @default 0
     */
    current?: number;
}
export interface GroupConsumerProps {
    previewPrefixCls?: string;
    icons?: PreviewProps['icons'];
    preview?: boolean | PreviewGroupPreview;
}
export interface GroupConsumerValue extends GroupConsumerProps {
    isPreviewGroup?: Ref<boolean | undefined>;
    previewUrls: ComputedRef<Map<number, string>>;
    setPreviewUrls: (id: number, url: string, canPreview?: boolean) => void;
    current: Ref<number>;
    setCurrent: (current: number) => void;
    setShowPreview: (isShowPreview: boolean) => void;
    setMousePosition: (mousePosition: null | {
        x: number;
        y: number;
    }) => void;
    registerImage: (id: number, url: string, canPreview?: boolean) => () => void;
    rootClassName?: string;
}
export declare const context: {
    provide: (val: GroupConsumerValue) => void;
    inject: () => GroupConsumerValue;
};
export declare const imageGroupProps: () => {
    previewPrefixCls: StringConstructor;
    preview: {
        type: PropType<boolean | ImagePreviewType>;
        default: boolean | ImagePreviewType;
    };
    icons: {
        type: PropType<{
            rotateLeft?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            rotateRight?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            zoomIn?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            zoomOut?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            close?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            left?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            right?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            flipX?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            flipY?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
        }>;
        default: () => {};
    };
};
declare const Group: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    previewPrefixCls: StringConstructor;
    preview: {
        type: PropType<boolean | ImagePreviewType>;
        default: boolean | ImagePreviewType;
    };
    icons: {
        type: PropType<{
            rotateLeft?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            rotateRight?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            zoomIn?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            zoomOut?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            close?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            left?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            right?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            flipX?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            flipY?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
        }>;
        default: () => {};
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    previewPrefixCls: StringConstructor;
    preview: {
        type: PropType<boolean | ImagePreviewType>;
        default: boolean | ImagePreviewType;
    };
    icons: {
        type: PropType<{
            rotateLeft?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            rotateRight?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            zoomIn?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            zoomOut?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            close?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            left?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            right?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            flipX?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
            flipY?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
                [key: string]: any;
            }>;
        }>;
        default: () => {};
    };
}>> & Readonly<{}>, {
    preview: boolean | ImagePreviewType;
    icons: {
        rotateLeft?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        rotateRight?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        zoomIn?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        zoomOut?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        close?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        left?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        right?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        flipX?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
        flipY?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>;
    };
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Group;
