import type { ExtractPropTypes } from 'vue';
import type { ItemRender, UploadFile, UploadListProgressProps, UploadListType, UploadLocale } from '../interface';
import type { VueNode } from '../../_util/type';
export declare const listItemProps: () => {
    prefixCls: StringConstructor;
    locale: {
        type: import("vue").PropType<UploadLocale>;
        default: UploadLocale;
    };
    file: {
        type: import("vue").PropType<UploadFile<any>>;
        default: UploadFile<any>;
    };
    items: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    listType: {
        type: import("vue").PropType<UploadListType>;
        default: UploadListType;
    };
    isImgUrl: {
        type: import("vue").PropType<(file: UploadFile) => boolean>;
        default: (file: UploadFile) => boolean;
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
            file: UploadFile;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile;
        }) => VueNode;
    };
    downloadIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile;
        }) => VueNode;
    };
    previewIcon: {
        type: import("vue").PropType<(opt: {
            file: UploadFile;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile;
        }) => VueNode;
    };
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile;
        }) => VueNode;
    };
    actionIconRender: {
        type: import("vue").PropType<(opt: {
            customIcon: VueNode;
            callback: () => void;
            prefixCls: string;
            title?: string | undefined;
        }) => VueNode>;
        default: (opt: {
            customIcon: VueNode;
            callback: () => void;
            prefixCls: string;
            title?: string | undefined;
        }) => VueNode;
    };
    itemRender: {
        type: import("vue").PropType<ItemRender<any>>;
        default: ItemRender<any>;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile, e: Event) => void>;
        default: (file: UploadFile, e: Event) => void;
    };
    onClose: {
        type: import("vue").PropType<(file: UploadFile) => void>;
        default: (file: UploadFile) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile) => void>;
        default: (file: UploadFile) => void;
    };
    progress: {
        type: import("vue").PropType<UploadListProgressProps>;
        default: UploadListProgressProps;
    };
};
export type ListItemProps = Partial<ExtractPropTypes<ReturnType<typeof listItemProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    locale: {
        type: import("vue").PropType<UploadLocale>;
        default: UploadLocale;
    };
    file: {
        type: import("vue").PropType<UploadFile<any>>;
        default: UploadFile<any>;
    };
    items: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    listType: {
        type: import("vue").PropType<UploadListType>;
        default: UploadListType;
    };
    isImgUrl: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean>;
        default: (file: UploadFile<any>) => boolean;
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
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    actionIconRender: {
        type: import("vue").PropType<(opt: {
            customIcon: VueNode;
            callback: () => void;
            prefixCls: string;
            title?: string;
        }) => VueNode>;
        default: (opt: {
            customIcon: VueNode;
            callback: () => void;
            prefixCls: string;
            title?: string;
        }) => VueNode;
    };
    itemRender: {
        type: import("vue").PropType<ItemRender<any>>;
        default: ItemRender<any>;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<any>, e: Event) => void>;
        default: (file: UploadFile<any>, e: Event) => void;
    };
    onClose: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    progress: {
        type: import("vue").PropType<UploadListProgressProps>;
        default: UploadListProgressProps;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    locale: {
        type: import("vue").PropType<UploadLocale>;
        default: UploadLocale;
    };
    file: {
        type: import("vue").PropType<UploadFile<any>>;
        default: UploadFile<any>;
    };
    items: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    listType: {
        type: import("vue").PropType<UploadListType>;
        default: UploadListType;
    };
    isImgUrl: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean>;
        default: (file: UploadFile<any>) => boolean;
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
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
        }) => VueNode;
    };
    actionIconRender: {
        type: import("vue").PropType<(opt: {
            customIcon: VueNode;
            callback: () => void;
            prefixCls: string;
            title?: string;
        }) => VueNode>;
        default: (opt: {
            customIcon: VueNode;
            callback: () => void;
            prefixCls: string;
            title?: string;
        }) => VueNode;
    };
    itemRender: {
        type: import("vue").PropType<ItemRender<any>>;
        default: ItemRender<any>;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<any>, e: Event) => void>;
        default: (file: UploadFile<any>, e: Event) => void;
    };
    onClose: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    progress: {
        type: import("vue").PropType<UploadListProgressProps>;
        default: UploadListProgressProps;
    };
}>> & Readonly<{}>, {
    progress: UploadListProgressProps;
    onClose: (file: UploadFile<any>) => void;
    locale: UploadLocale;
    file: UploadFile<any>;
    items: UploadFile<any>[];
    iconRender: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    removeIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    itemRender: ItemRender<any>;
    listType: UploadListType;
    onPreview: (file: UploadFile<any>, e: Event) => void;
    onDownload: (file: UploadFile<any>) => void;
    downloadIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    previewIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    showRemoveIcon: boolean;
    showDownloadIcon: boolean;
    showPreviewIcon: boolean;
    isImgUrl: (file: UploadFile<any>) => boolean;
    actionIconRender: (opt: {
        customIcon: VueNode;
        callback: () => void;
        prefixCls: string;
        title?: string;
    }) => VueNode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
