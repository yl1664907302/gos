import type { RcFile as OriRcFile, UploadRequestOption as RcCustomRequestOptions } from '../vc-upload/interface';
import type { ProgressProps } from '../progress';
import type { VueNode } from '../_util/type';
import type { ExtractPropTypes, CSSProperties, ImgHTMLAttributes } from 'vue';
export interface FileType extends OriRcFile {
    readonly lastModifiedDate: Date;
}
export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';
export interface HttpRequestHeader {
    [key: string]: string;
}
export interface UploadFile<T = any> {
    uid: string;
    size?: number;
    name: string;
    fileName?: string;
    lastModified?: number;
    lastModifiedDate?: Date;
    url?: string;
    status?: UploadFileStatus;
    percent?: number;
    thumbUrl?: string;
    crossOrigin?: ImgHTMLAttributes['crossorigin'];
    originFileObj?: FileType;
    response?: T;
    error?: any;
    linkProps?: any;
    type?: string;
    xhr?: T;
    preview?: string;
}
export interface InternalUploadFile<T = any> extends UploadFile<T> {
    originFileObj: FileType;
}
export interface ShowUploadListInterface {
    showRemoveIcon?: boolean;
    showPreviewIcon?: boolean;
    showDownloadIcon?: boolean;
}
export interface UploadChangeParam<T = UploadFile> {
    file: T;
    fileList: T[];
    event?: {
        percent: number;
    };
}
export interface UploadLocale {
    uploading?: string;
    removeFile?: string;
    downloadFile?: string;
    uploadError?: string;
    previewFile?: string;
}
export type UploadType = 'drag' | 'select';
export type UploadListType = 'text' | 'picture' | 'picture-card';
export type UploadListProgressProps = Omit<ProgressProps, 'percent' | 'type'> & {
    class?: string;
    style?: CSSProperties;
};
export type ItemRender<T = any> = (opt: {
    originNode: VueNode;
    file: UploadFile;
    fileList: Array<UploadFile<T>>;
    actions: {
        download: () => void;
        preview: () => void;
        remove: () => void;
    };
}) => VueNode;
type PreviewFileHandler = (file: FileType | Blob) => PromiseLike<string>;
type TransformFileHandler = (file: FileType) => string | Blob | FileType | PromiseLike<string | Blob | FileType>;
type BeforeUploadValueType = void | boolean | string | Blob | FileType;
declare function uploadProps<T = any>(): {
    capture: {
        type: import("vue").PropType<boolean | "user" | "environment">;
        default: boolean | "user" | "environment";
    };
    type: {
        type: import("vue").PropType<UploadType>;
        default: UploadType;
    };
    name: StringConstructor;
    defaultFileList: {
        type: import("vue").PropType<UploadFile<T>[]>;
        default: UploadFile<T>[];
    };
    fileList: {
        type: import("vue").PropType<UploadFile<T>[]>;
        default: UploadFile<T>[];
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
        type: import("vue").PropType<Record<string, unknown> | ((file: UploadFile<T>) => Record<string, unknown> | Promise<Record<string, unknown>>)>;
        default: Record<string, unknown> | ((file: UploadFile<T>) => Record<string, unknown> | Promise<Record<string, unknown>>);
    };
    method: {
        type: import("vue").PropType<"post" | "POST" | "PUT" | "PATCH" | "put" | "patch">;
        default: "post" | "POST" | "PUT" | "PATCH" | "put" | "patch";
    };
    headers: {
        type: import("vue").PropType<HttpRequestHeader>;
        default: HttpRequestHeader;
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
        type: import("vue").PropType<(file: FileType, FileList: FileType[]) => BeforeUploadValueType | Promise<BeforeUploadValueType>>;
        default: (file: FileType, FileList: FileType[]) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
    };
    onChange: {
        type: import("vue").PropType<(info: UploadChangeParam<UploadFile<T>>) => void>;
        default: (info: UploadChangeParam<UploadFile<T>>) => void;
    };
    'onUpdate:fileList': {
        type: import("vue").PropType<(fileList: UploadChangeParam<UploadFile<T>>['fileList']) => void>;
        default: (fileList: UploadChangeParam<UploadFile<T>>['fileList']) => void;
    };
    onDrop: {
        type: import("vue").PropType<(event: DragEvent) => void>;
        default: (event: DragEvent) => void;
    };
    listType: {
        type: import("vue").PropType<UploadListType>;
        default: UploadListType;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<T>) => void>;
        default: (file: UploadFile<T>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<T>) => void>;
        default: (file: UploadFile<T>) => void;
    };
    onReject: {
        type: import("vue").PropType<(fileList: FileType[]) => void>;
        default: (fileList: FileType[]) => void;
    };
    onRemove: {
        type: import("vue").PropType<(file: UploadFile<T>) => void | boolean | Promise<void | boolean>>;
        default: (file: UploadFile<T>) => void | boolean | Promise<void | boolean>;
    };
    /** @deprecated Please use `onRemove` directly */
    remove: {
        type: import("vue").PropType<(file: UploadFile<T>) => void | boolean | Promise<void | boolean>>;
        default: (file: UploadFile<T>) => void | boolean | Promise<void | boolean>;
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
        type: import("vue").PropType<(options: RcCustomRequestOptions) => void>;
        default: (options: RcCustomRequestOptions) => void;
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
        type: import("vue").PropType<UploadLocale>;
        default: UploadLocale;
    };
    id: StringConstructor;
    previewFile: {
        type: import("vue").PropType<PreviewFileHandler>;
        default: PreviewFileHandler;
    };
    /** @deprecated Please use `beforeUpload` directly */
    transformFile: {
        type: import("vue").PropType<TransformFileHandler>;
        default: TransformFileHandler;
    };
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<T>;
            listType?: UploadListType;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<T>;
            listType?: UploadListType;
        }) => VueNode;
    };
    isImageUrl: {
        type: import("vue").PropType<(file: UploadFile) => boolean>;
        default: (file: UploadFile) => boolean;
    };
    progress: {
        type: import("vue").PropType<UploadListProgressProps>;
        default: UploadListProgressProps;
    };
    itemRender: {
        type: import("vue").PropType<ItemRender<T>>;
        default: ItemRender<T>;
    };
    /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
    maxCount: NumberConstructor;
    height: {
        type: import("vue").PropType<unknown>;
        default: unknown;
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
};
export type UploadProps = Partial<ExtractPropTypes<ReturnType<typeof uploadProps>>>;
export interface UploadState<T = any> {
    fileList: UploadFile<T>[];
    dragState: string;
}
declare function uploadListProps<T = any>(): {
    listType: {
        type: import("vue").PropType<UploadListType>;
        default: UploadListType;
    };
    onPreview: {
        type: import("vue").PropType<(file: UploadFile<T>) => void>;
        default: (file: UploadFile<T>) => void;
    };
    onDownload: {
        type: import("vue").PropType<(file: UploadFile<T>) => void>;
        default: (file: UploadFile<T>) => void;
    };
    onRemove: {
        type: import("vue").PropType<(file: UploadFile<T>) => void | boolean>;
        default: (file: UploadFile<T>) => void | boolean;
    };
    items: {
        type: import("vue").PropType<UploadFile<T>[]>;
        default: UploadFile<T>[];
    };
    progress: {
        type: import("vue").PropType<UploadListProgressProps>;
        default: UploadListProgressProps;
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
    locale: {
        type: import("vue").PropType<UploadLocale>;
        default: UploadLocale;
    };
    previewFile: {
        type: import("vue").PropType<PreviewFileHandler>;
        default: PreviewFileHandler;
    };
    iconRender: {
        type: import("vue").PropType<(opt: {
            file: UploadFile<T>;
            listType?: UploadListType;
        }) => VueNode>;
        default: (opt: {
            file: UploadFile<T>;
            listType?: UploadListType;
        }) => VueNode;
    };
    isImageUrl: {
        type: import("vue").PropType<(file: UploadFile) => boolean>;
        default: (file: UploadFile) => boolean;
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
        type: import("vue").PropType<ItemRender<T>>;
        default: ItemRender<T>;
    };
};
export type UploadListProps = Partial<ExtractPropTypes<ReturnType<typeof uploadListProps>>>;
export { uploadProps, uploadListProps };
