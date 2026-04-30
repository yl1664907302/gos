import type { UploadFile, UploadChangeParam, ShowUploadListInterface, FileType } from './interface';
import type { VueNode } from '../_util/type';
export declare const LIST_IGNORE: string;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    capture: {
        type: import("vue").PropType<boolean | "user" | "environment">;
        default: boolean | "user" | "environment";
    };
    type: {
        type: import("vue").PropType<import("./interface").UploadType>;
        default: import("./interface").UploadType;
    };
    name: StringConstructor;
    defaultFileList: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    fileList: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    action: {
        type: import("vue").PropType<string | ((file: FileType) => string) | ((file: FileType) => PromiseLike<string>)>;
        default: string | ((file: FileType) => string) | ((file: FileType) => PromiseLike<string>);
    };
    directory: {
        type: BooleanConstructor;
        default: boolean;
    };
    data: {
        type: import("vue").PropType<Record<string, unknown> | ((file: UploadFile<any>) => Record<string, unknown> | Promise<Record<string, unknown>>)>;
        default: Record<string, unknown> | ((file: UploadFile<any>) => Record<string, unknown> | Promise<Record<string, unknown>>);
    };
    method: {
        type: import("vue").PropType<"post" | "POST" | "PUT" | "PATCH" | "put" | "patch">;
        default: "post" | "POST" | "PUT" | "PATCH" | "put" | "patch";
    };
    headers: {
        type: import("vue").PropType<import("./interface").HttpRequestHeader>;
        default: import("./interface").HttpRequestHeader;
    };
    showUploadList: {
        type: import("vue").PropType<boolean | ShowUploadListInterface>;
        default: boolean | ShowUploadListInterface;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    accept: StringConstructor;
    beforeUpload: {
        type: import("vue").PropType<(file: FileType, FileList: FileType[]) => (string | boolean | void | Blob | FileType) | Promise<string | boolean | void | Blob | FileType>>;
        default: (file: FileType, FileList: FileType[]) => (string | boolean | void | Blob | FileType) | Promise<string | boolean | void | Blob | FileType>;
    };
    onChange: {
        type: import("vue").PropType<(info: UploadChangeParam<UploadFile<any>>) => void>;
        default: (info: UploadChangeParam<UploadFile<any>>) => void;
    };
    'onUpdate:fileList': {
        type: import("vue").PropType<(fileList: UploadFile<any>[]) => void>;
        default: (fileList: UploadFile<any>[]) => void;
    };
    onDrop: {
        type: import("vue").PropType<(event: DragEvent) => void>;
        default: (event: DragEvent) => void;
    };
    listType: {
        type: import("vue").PropType<import("./interface").UploadListType>;
        default: import("./interface").UploadListType;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onReject: {
        type: import("vue").PropType<(fileList: FileType[]) => void>;
        default: (fileList: FileType[]) => void;
    };
    onRemove: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean | void | Promise<boolean | void>>;
        default: (file: UploadFile<any>) => boolean | void | Promise<boolean | void>;
    };
    remove: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean | void | Promise<boolean | void>>;
        default: (file: UploadFile<any>) => boolean | void | Promise<boolean | void>;
    };
    supportServerRender: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    customRequest: {
        type: import("vue").PropType<(options: import("../vc-upload/interface").UploadRequestOption<any>) => void>;
        default: (options: import("../vc-upload/interface").UploadRequestOption<any>) => void;
    };
    withCredentials: {
        type: BooleanConstructor;
        default: boolean;
    };
    openFileDialogOnClick: {
        type: BooleanConstructor;
        default: boolean;
    };
    locale: {
        type: import("vue").PropType<import("./interface").UploadLocale>;
        default: import("./interface").UploadLocale;
    };
    id: StringConstructor;
    previewFile: {
        type: import("vue").PropType<(file: Blob | FileType) => PromiseLike<string>>;
        default: (file: Blob | FileType) => PromiseLike<string>;
    };
    transformFile: {
        type: import("vue").PropType<(file: FileType) => string | Blob | FileType | PromiseLike<string | Blob | FileType>>;
        default: (file: FileType) => string | Blob | FileType | PromiseLike<string | Blob | FileType>;
    };
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
            listType?: import("./interface").UploadListType;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
            listType?: import("./interface").UploadListType;
        }) => VueNode;
    };
    isImageUrl: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean>;
        default: (file: UploadFile<any>) => boolean;
    };
    progress: {
        type: import("vue").PropType<import("./interface").UploadListProgressProps>;
        default: import("./interface").UploadListProgressProps;
    };
    itemRender: {
        type: import("vue").PropType<import("./interface").ItemRender<any>>;
        default: import("./interface").ItemRender<any>;
    };
    maxCount: NumberConstructor;
    height: {
        type: import("vue").PropType<unknown>;
        default: unknown;
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
}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    capture: {
        type: import("vue").PropType<boolean | "user" | "environment">;
        default: boolean | "user" | "environment";
    };
    type: {
        type: import("vue").PropType<import("./interface").UploadType>;
        default: import("./interface").UploadType;
    };
    name: StringConstructor;
    defaultFileList: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    fileList: {
        type: import("vue").PropType<UploadFile<any>[]>;
        default: UploadFile<any>[];
    };
    action: {
        type: import("vue").PropType<string | ((file: FileType) => string) | ((file: FileType) => PromiseLike<string>)>;
        default: string | ((file: FileType) => string) | ((file: FileType) => PromiseLike<string>);
    };
    directory: {
        type: BooleanConstructor;
        default: boolean;
    };
    data: {
        type: import("vue").PropType<Record<string, unknown> | ((file: UploadFile<any>) => Record<string, unknown> | Promise<Record<string, unknown>>)>;
        default: Record<string, unknown> | ((file: UploadFile<any>) => Record<string, unknown> | Promise<Record<string, unknown>>);
    };
    method: {
        type: import("vue").PropType<"post" | "POST" | "PUT" | "PATCH" | "put" | "patch">;
        default: "post" | "POST" | "PUT" | "PATCH" | "put" | "patch";
    };
    headers: {
        type: import("vue").PropType<import("./interface").HttpRequestHeader>;
        default: import("./interface").HttpRequestHeader;
    };
    showUploadList: {
        type: import("vue").PropType<boolean | ShowUploadListInterface>;
        default: boolean | ShowUploadListInterface;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    accept: StringConstructor;
    beforeUpload: {
        type: import("vue").PropType<(file: FileType, FileList: FileType[]) => (string | boolean | void | Blob | FileType) | Promise<string | boolean | void | Blob | FileType>>;
        default: (file: FileType, FileList: FileType[]) => (string | boolean | void | Blob | FileType) | Promise<string | boolean | void | Blob | FileType>;
    };
    onChange: {
        type: import("vue").PropType<(info: UploadChangeParam<UploadFile<any>>) => void>;
        default: (info: UploadChangeParam<UploadFile<any>>) => void;
    };
    'onUpdate:fileList': {
        type: import("vue").PropType<(fileList: UploadFile<any>[]) => void>;
        default: (fileList: UploadFile<any>[]) => void;
    };
    onDrop: {
        type: import("vue").PropType<(event: DragEvent) => void>;
        default: (event: DragEvent) => void;
    };
    listType: {
        type: import("vue").PropType<import("./interface").UploadListType>;
        default: import("./interface").UploadListType;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<any>) => void>;
        default: (file: UploadFile<any>) => void;
    };
    onReject: {
        type: import("vue").PropType<(fileList: FileType[]) => void>;
        default: (fileList: FileType[]) => void;
    };
    onRemove: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean | void | Promise<boolean | void>>;
        default: (file: UploadFile<any>) => boolean | void | Promise<boolean | void>;
    };
    remove: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean | void | Promise<boolean | void>>;
        default: (file: UploadFile<any>) => boolean | void | Promise<boolean | void>;
    };
    supportServerRender: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    customRequest: {
        type: import("vue").PropType<(options: import("../vc-upload/interface").UploadRequestOption<any>) => void>;
        default: (options: import("../vc-upload/interface").UploadRequestOption<any>) => void;
    };
    withCredentials: {
        type: BooleanConstructor;
        default: boolean;
    };
    openFileDialogOnClick: {
        type: BooleanConstructor;
        default: boolean;
    };
    locale: {
        type: import("vue").PropType<import("./interface").UploadLocale>;
        default: import("./interface").UploadLocale;
    };
    id: StringConstructor;
    previewFile: {
        type: import("vue").PropType<(file: Blob | FileType) => PromiseLike<string>>;
        default: (file: Blob | FileType) => PromiseLike<string>;
    };
    transformFile: {
        type: import("vue").PropType<(file: FileType) => string | Blob | FileType | PromiseLike<string | Blob | FileType>>;
        default: (file: FileType) => string | Blob | FileType | PromiseLike<string | Blob | FileType>;
    };
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<any>;
            listType?: import("./interface").UploadListType;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<any>;
            listType?: import("./interface").UploadListType;
        }) => VueNode;
    };
    isImageUrl: {
        type: import("vue").PropType<(file: UploadFile<any>) => boolean>;
        default: (file: UploadFile<any>) => boolean;
    };
    progress: {
        type: import("vue").PropType<import("./interface").UploadListProgressProps>;
        default: import("./interface").UploadListProgressProps;
    };
    itemRender: {
        type: import("vue").PropType<import("./interface").ItemRender<any>>;
        default: import("./interface").ItemRender<any>;
    };
    maxCount: NumberConstructor;
    height: {
        type: import("vue").PropType<unknown>;
        default: unknown;
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
}>> & Readonly<{}>, {
    progress: import("./interface").UploadListProgressProps;
    type: import("./interface").UploadType;
    height: unknown;
    data: Record<string, unknown> | ((file: UploadFile<any>) => Record<string, unknown> | Promise<Record<string, unknown>>);
    onDrop: (event: DragEvent) => void;
    onChange: (info: UploadChangeParam<UploadFile<any>>) => void;
    multiple: boolean;
    disabled: boolean;
    method: "post" | "POST" | "PUT" | "PATCH" | "put" | "patch";
    remove: (file: UploadFile<any>) => boolean | void | Promise<boolean | void>;
    locale: import("./interface").UploadLocale;
    action: string | ((file: FileType) => string) | ((file: FileType) => PromiseLike<string>);
    capture: boolean | "user" | "environment";
    iconRender: (opt: {
        file: UploadFile<any>;
        listType?: import("./interface").UploadListType;
    }) => VueNode;
    onRemove: (file: UploadFile<any>) => boolean | void | Promise<boolean | void>;
    removeIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    itemRender: import("./interface").ItemRender<any>;
    directory: boolean;
    headers: import("./interface").HttpRequestHeader;
    onReject: (fileList: FileType[]) => void;
    beforeUpload: (file: FileType, FileList: FileType[]) => (string | boolean | void | Blob | FileType) | Promise<string | boolean | void | Blob | FileType>;
    customRequest: (options: import("../vc-upload/interface").UploadRequestOption<any>) => void;
    withCredentials: boolean;
    openFileDialogOnClick: boolean;
    fileList: UploadFile<any>[];
    defaultFileList: UploadFile<any>[];
    showUploadList: boolean | ShowUploadListInterface;
    'onUpdate:fileList': (fileList: UploadFile<any>[]) => void;
    listType: import("./interface").UploadListType;
    onPreview: (file: UploadFile<any>) => void;
    onDownload: (file: UploadFile<any>) => void;
    supportServerRender: boolean;
    previewFile: (file: Blob | FileType) => PromiseLike<string>;
    transformFile: (file: FileType) => string | Blob | FileType | PromiseLike<string | Blob | FileType>;
    isImageUrl: (file: UploadFile<any>) => boolean;
    downloadIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
    previewIcon: (opt: {
        file: UploadFile<any>;
    }) => VueNode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
