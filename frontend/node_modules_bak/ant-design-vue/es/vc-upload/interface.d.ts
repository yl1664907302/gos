import type { ExtractPropTypes, PropType } from 'vue';
export type BeforeUploadFileType = File | Blob | boolean | string;
export type Action = string | ((file: RcFile) => string | PromiseLike<string>);
export declare const uploadProps: () => {
    capture: PropType<boolean | "user" | "environment">;
    multipart: {
        type: BooleanConstructor;
        default: any;
    };
    name: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    componentTag: PropType<any>;
    action: PropType<Action>;
    method: PropType<UploadRequestMethod>;
    directory: {
        type: BooleanConstructor;
        default: any;
    };
    data: PropType<Record<string, unknown> | ((file: RcFile | string | Blob) => Record<string, unknown>)>;
    headers: PropType<UploadRequestHeader>;
    accept: StringConstructor;
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    onBatchStart: PropType<(fileList: {
        file: RcFile;
        parsedFile: Exclude<BeforeUploadFileType, boolean>;
    }[]) => void>;
    onReject: PropType<(fileList: RcFile[]) => void>;
    onStart: PropType<(file: RcFile) => void>;
    onError: PropType<(error: Error, ret: Record<string, unknown>, file: RcFile) => void>;
    onSuccess: PropType<(response: Record<string, unknown>, file: RcFile, xhr: XMLHttpRequest) => void>;
    onProgress: PropType<(event: UploadProgressEvent, file: RcFile) => void>;
    beforeUpload: PropType<(file: RcFile, FileList: RcFile[]) => BeforeUploadFileType | Promise<void | BeforeUploadFileType>>;
    customRequest: PropType<(option: UploadRequestOption) => void>;
    withCredentials: {
        type: BooleanConstructor;
        default: any;
    };
    openFileDialogOnClick: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    id: StringConstructor;
    onMouseenter: PropType<(e: MouseEvent) => void>;
    onMouseleave: PropType<(e: MouseEvent) => void>;
    onClick: PropType<(e: MouseEvent | KeyboardEvent) => void>;
};
export type UploadProps = Partial<ExtractPropTypes<ReturnType<typeof uploadProps>>>;
export interface UploadProgressEvent extends Partial<ProgressEvent> {
    percent?: number;
}
export type UploadRequestMethod = 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';
export type UploadRequestHeader = Record<string, string>;
export interface UploadRequestError extends Error {
    status?: number;
    method?: UploadRequestMethod;
    url?: string;
}
export interface UploadRequestOption<T = any> {
    onProgress?: (event: UploadProgressEvent) => void;
    onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
    onSuccess?: (body: T, xhr?: XMLHttpRequest) => void;
    data?: Record<string, unknown>;
    filename?: string;
    file: Exclude<BeforeUploadFileType, File | boolean> | RcFile;
    withCredentials?: boolean;
    action: string;
    headers?: UploadRequestHeader;
    method: UploadRequestMethod;
}
export interface RcFile extends File {
    uid: string;
}
