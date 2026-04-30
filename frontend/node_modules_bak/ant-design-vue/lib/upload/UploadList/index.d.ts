import type { UploadFile } from '../interface';
import type { VueNode } from '../../_util/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    listType: {
        type: import("vue").PropType<import("../interface").UploadListType>;
        default: import("../interface").UploadListType;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onRemove: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean | void>;
        default: (file: UploadFile<any>) => boolean | void;
    };
    items: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    progress: {
        type: import("vue").PropType<import("../interface").UploadListProgressProps>;
        default: import("../interface").UploadListProgressProps;
    };
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    showRemoveIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    showDownloadIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    showPreviewIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    removeIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    downloadIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    previewIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    locale: {
        type: import("vue").PropType<import("../interface").UploadLocale>;
        default: import("../interface").UploadLocale;
    };
    previewFile: {
        type: import("vue").PropType<(file: Blob | import("../interface").FileType) => PromiseLike<string>>;
        default: (file: Blob | import("../interface").FileType) => PromiseLike<string>;
    };
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
            listType?: import("../interface").UploadListType;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
            listType?: import("../interface").UploadListType;
        }) => VueNode;
    };
    isImageUrl: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean>;
        default: (file: UploadFile<any>) => boolean;
    };
    appendAction: {
        type: import("vue").PropType<() => VueNode>;
        default: () => VueNode;
    };
    appendActionVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    itemRender: {
        type: import("vue").PropType<import("../interface").ItemRender<any>>;
        default: import("../interface").ItemRender<any>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    listType: {
        type: import("vue").PropType<import("../interface").UploadListType>;
        default: import("../interface").UploadListType;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onRemove: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean | void>;
        default: (file: UploadFile<any>) => boolean | void;
    };
    items: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    progress: {
        type: import("vue").PropType<import("../interface").UploadListProgressProps>;
        default: import("../interface").UploadListProgressProps;
    };
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    showRemoveIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    showDownloadIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    showPreviewIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    removeIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    downloadIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    previewIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    locale: {
        type: import("vue").PropType<import("../interface").UploadLocale>;
        default: import("../interface").UploadLocale;
    };
    previewFile: {
        type: import("vue").PropType<(file: Blob | import("../interface").FileType) => PromiseLike<string>>;
        default: (file: Blob | import("../interface").FileType) => PromiseLike<string>;
    };
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
            listType?: import("../interface").UploadListType;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
            listType?: import("../interface").UploadListType;
        }) => VueNode;
    };
    isImageUrl: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean>;
        default: (file: UploadFile<any>) => boolean;
    };
    appendAction: {
        type: import("vue").PropType<() => VueNode>;
        default: () => VueNode;
    };
    appendActionVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    itemRender: {
        type: import("vue").PropType<import("../interface").ItemRender<any>>;
        default: import("../interface").ItemRender<any>;
    };
}>> & Readonly<{}>, {
    progress: import("../interface").UploadListProgressProps;
    prefixCls: string;
    locale: import("../interface").UploadLocale;
    items: UploadFile<any>[];
    iconRender: (opt: {
        file: UploadFile<any>;
        listType?: import("../interface").UploadListType;
    }) => VueNode;
    onRemove: (file: UploadFile<any>) => boolean | void;
    removeIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    itemRender: import("../interface").ItemRender<any>;
    listType: import("../interface").UploadListType;
    onPreview: (file: UploadFile<any>) => void;
    onDownload: (file: UploadFile<any>) => void;
    previewFile: (file: Blob | import("../interface").FileType) => PromiseLike<string>;
    isImageUrl: (file: UploadFile<any>) => boolean;
    downloadIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    previewIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    showRemoveIcon: boolean;
    showDownloadIcon: boolean;
    showPreviewIcon: boolean;
    appendAction: () => VueNode;
    appendActionVisible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
