export interface ImageSettings {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
    x?: number;
    y?: number;
}
export declare const qrProps: () => {
    size: {
        type: NumberConstructor;
        default: number;
    };
    value: {
        type: StringConstructor;
        required: boolean;
    };
    type: {
        type: import("vue").PropType<"canvas" | "svg">;
        default: "canvas" | "svg";
    };
    color: StringConstructor;
    bgColor: StringConstructor;
    includeMargin: BooleanConstructor;
    imageSettings: {
        type: import("vue").PropType<ImageSettings>;
        default: ImageSettings;
    };
};
export declare const qrcodeProps: () => {
    errorLevel: {
        type: import("vue").PropType<"M" | "H" | "Q" | "L">;
        default: "M" | "H" | "Q" | "L";
    };
    icon: StringConstructor;
    iconSize: {
        type: NumberConstructor;
        default: number;
    };
    status: {
        type: import("vue").PropType<"active" | "loading" | "expired" | "scanned">;
        default: "active" | "loading" | "expired" | "scanned";
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    size: {
        type: NumberConstructor;
        default: number;
    };
    value: {
        type: StringConstructor;
        required: boolean;
    };
    type: {
        type: import("vue").PropType<"canvas" | "svg">;
        default: "canvas" | "svg";
    };
    color: StringConstructor;
    bgColor: StringConstructor;
    includeMargin: BooleanConstructor;
    imageSettings: {
        type: import("vue").PropType<ImageSettings>;
        default: ImageSettings;
    };
};
export interface QRCodeCanvasColor {
    dark?: string;
    light?: string;
}
export interface QRCodeCanvasOptions {
    version?: number;
    errorCorrectionLevel?: string;
    maskPattern?: number;
    toSJISFunc?: Function;
    margin?: number;
    scale?: number;
    small?: boolean;
    width: number;
    color?: QRCodeCanvasColor;
}
