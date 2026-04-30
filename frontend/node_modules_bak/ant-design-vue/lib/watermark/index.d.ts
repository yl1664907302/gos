import type { ExtractPropTypes } from 'vue';
export interface WatermarkFontType {
    color?: string;
    fontSize?: number | string;
    fontWeight?: 'normal' | 'light' | 'weight' | number;
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
    fontFamily?: string;
}
export declare const watermarkProps: () => {
    zIndex: NumberConstructor;
    rotate: NumberConstructor;
    width: NumberConstructor;
    height: NumberConstructor;
    image: StringConstructor;
    content: {
        type: import("vue").PropType<string | string[]>;
        default: string | string[];
    };
    font: {
        type: import("vue").PropType<WatermarkFontType>;
        default: WatermarkFontType;
    };
    rootClassName: StringConstructor;
    gap: {
        type: import("vue").PropType<[number, number]>;
        default: [number, number];
    };
    offset: {
        type: import("vue").PropType<[number, number]>;
        default: [number, number];
    };
};
export type WatermarkProps = Partial<ExtractPropTypes<ReturnType<typeof watermarkProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        zIndex: NumberConstructor;
        rotate: NumberConstructor;
        width: NumberConstructor;
        height: NumberConstructor;
        image: StringConstructor;
        content: {
            type: import("vue").PropType<string | string[]>;
            default: string | string[];
        };
        font: {
            type: import("vue").PropType<WatermarkFontType>;
            default: WatermarkFontType;
        };
        rootClassName: StringConstructor;
        gap: {
            type: import("vue").PropType<[number, number]>;
            default: [number, number];
        };
        offset: {
            type: import("vue").PropType<[number, number]>;
            default: [number, number];
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        content: string | string[];
        font: WatermarkFontType;
        gap: [number, number];
        offset: [number, number];
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        zIndex: NumberConstructor;
        rotate: NumberConstructor;
        width: NumberConstructor;
        height: NumberConstructor;
        image: StringConstructor;
        content: {
            type: import("vue").PropType<string | string[]>;
            default: string | string[];
        };
        font: {
            type: import("vue").PropType<WatermarkFontType>;
            default: WatermarkFontType;
        };
        rootClassName: StringConstructor;
        gap: {
            type: import("vue").PropType<[number, number]>;
            default: [number, number];
        };
        offset: {
            type: import("vue").PropType<[number, number]>;
            default: [number, number];
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        content: string | string[];
        font: WatermarkFontType;
        gap: [number, number];
        offset: [number, number];
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    zIndex: NumberConstructor;
    rotate: NumberConstructor;
    width: NumberConstructor;
    height: NumberConstructor;
    image: StringConstructor;
    content: {
        type: import("vue").PropType<string | string[]>;
        default: string | string[];
    };
    font: {
        type: import("vue").PropType<WatermarkFontType>;
        default: WatermarkFontType;
    };
    rootClassName: StringConstructor;
    gap: {
        type: import("vue").PropType<[number, number]>;
        default: [number, number];
    };
    offset: {
        type: import("vue").PropType<[number, number]>;
        default: [number, number];
    };
}>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    content: string | string[];
    font: WatermarkFontType;
    gap: [number, number];
    offset: [number, number];
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
