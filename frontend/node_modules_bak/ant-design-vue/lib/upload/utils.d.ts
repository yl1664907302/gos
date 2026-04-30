import type { FileType, UploadFile, InternalUploadFile } from './interface';
export declare function file2Obj(file: FileType): InternalUploadFile;
/** Upload fileList. Replace file if exist or just push into it. */
export declare function updateFileList(file: UploadFile<any>, fileList: UploadFile<any>[]): UploadFile<any>[];
export declare function getFileItem(file: FileType, fileList: UploadFile[]): UploadFile<any>;
export declare function removeFileItem(file: UploadFile, fileList: UploadFile[]): UploadFile<any>[];
export declare const isImageUrl: (file: UploadFile) => boolean;
export declare function previewImage(file: File | Blob): Promise<string>;
