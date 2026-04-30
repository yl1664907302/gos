import type { RcFile, UploadProgressEvent, BeforeUploadFileType } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    capture: import("vue").PropType<boolean | "user" | "environment">;
    multipart: {
        type: BooleanConstructor;
        default: any;
    };
    name: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    componentTag: import("vue").PropType<any>;
    action: import("vue").PropType<import("./interface").Action>;
    method: import("vue").PropType<import("./interface").UploadRequestMethod>;
    directory: {
        type: BooleanConstructor;
        default: any;
    };
    data: import("vue").PropType<Record<string, unknown> | ((file: string | Blob | RcFile) => Record<string, unknown>)>;
    headers: import("vue").PropType<import("./interface").UploadRequestHeader>;
    accept: StringConstructor;
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    onBatchStart: import("vue").PropType<(fileList: {
        file: RcFile;
        parsedFile: string | File | Blob;
    }[]) => void>;
    onReject: import("vue").PropType<(fileList: RcFile[]) => void>;
    onStart: import("vue").PropType<(file: RcFile) => void>;
    onError: import("vue").PropType<(error: Error, ret: Record<string, unknown>, file: RcFile) => void>;
    onSuccess: import("vue").PropType<(response: Record<string, unknown>, file: RcFile, xhr: XMLHttpRequest) => void>;
    onProgress: import("vue").PropType<(event: UploadProgressEvent, file: RcFile) => void>;
    beforeUpload: import("vue").PropType<(file: RcFile, FileList: RcFile[]) => BeforeUploadFileType | Promise<void | BeforeUploadFileType>>;
    customRequest: import("vue").PropType<(option: import("./interface").UploadRequestOption<any>) => void>;
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
    onMouseenter: import("vue").PropType<(e: MouseEvent) => void>;
    onMouseleave: import("vue").PropType<(e: MouseEvent) => void>;
    onClick: import("vue").PropType<(e: MouseEvent | KeyboardEvent) => void>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    capture: import("vue").PropType<boolean | "user" | "environment">;
    multipart: {
        type: BooleanConstructor;
        default: any;
    };
    name: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    componentTag: import("vue").PropType<any>;
    action: import("vue").PropType<import("./interface").Action>;
    method: import("vue").PropType<import("./interface").UploadRequestMethod>;
    directory: {
        type: BooleanConstructor;
        default: any;
    };
    data: import("vue").PropType<Record<string, unknown> | ((file: string | Blob | RcFile) => Record<string, unknown>)>;
    headers: import("vue").PropType<import("./interface").UploadRequestHeader>;
    accept: StringConstructor;
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    onBatchStart: import("vue").PropType<(fileList: {
        file: RcFile;
        parsedFile: string | File | Blob;
    }[]) => void>;
    onReject: import("vue").PropType<(fileList: RcFile[]) => void>;
    onStart: import("vue").PropType<(file: RcFile) => void>;
    onError: import("vue").PropType<(error: Error, ret: Record<string, unknown>, file: RcFile) => void>;
    onSuccess: import("vue").PropType<(response: Record<string, unknown>, file: RcFile, xhr: XMLHttpRequest) => void>;
    onProgress: import("vue").PropType<(event: UploadProgressEvent, file: RcFile) => void>;
    beforeUpload: import("vue").PropType<(file: RcFile, FileList: RcFile[]) => BeforeUploadFileType | Promise<void | BeforeUploadFileType>>;
    customRequest: import("vue").PropType<(option: import("./interface").UploadRequestOption<any>) => void>;
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
    onMouseenter: import("vue").PropType<(e: MouseEvent) => void>;
    onMouseleave: import("vue").PropType<(e: MouseEvent) => void>;
    onClick: import("vue").PropType<(e: MouseEvent | KeyboardEvent) => void>;
}>> & Readonly<{}>, {
    multiple: boolean;
    disabled: boolean;
    multipart: boolean;
    directory: boolean;
    withCredentials: boolean;
    openFileDialogOnClick: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
