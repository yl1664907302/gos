import useCacheToken from './hooks/useCacheToken';
import type { CSSInterpolation, CSSObject } from './hooks/useStyleRegister';
import useStyleRegister, { extractStyle } from './hooks/useStyleRegister';
import Keyframes from './Keyframes';
import type { Linter } from './linters';
import { legacyNotSelectorLinter, logicalPropertiesLinter, parentSelectorLinter } from './linters';
import type { StyleContextProps, StyleProviderProps } from './StyleContext';
import { createCache, useStyleInject, useStyleProvider, StyleProvider } from './StyleContext';
import type { DerivativeFunc, TokenType } from './theme';
import { createTheme, Theme } from './theme';
import type { Transformer } from './transformers/interface';
import legacyLogicalPropertiesTransformer from './transformers/legacyLogicalProperties';
import px2remTransformer from './transformers/px2rem';
declare const cssinjs: {
    Theme: typeof Theme;
    createTheme: typeof createTheme;
    useStyleRegister: typeof useStyleRegister;
    useCacheToken: typeof useCacheToken;
    createCache: typeof createCache;
    useStyleInject: () => import("vue").ShallowRef<Partial<StyleContextProps>, Partial<StyleContextProps>>;
    useStyleProvider: (props: import("./StyleContext").UseStyleProviderProps) => import("vue").ShallowRef<Partial<StyleContextProps>, Partial<StyleContextProps>>;
    Keyframes: typeof Keyframes;
    extractStyle: typeof extractStyle;
    legacyLogicalPropertiesTransformer: Transformer;
    px2remTransformer: (options?: import("./transformers/px2rem").Options) => Transformer;
    logicalPropertiesLinter: Linter;
    legacyNotSelectorLinter: Linter;
    parentSelectorLinter: Linter;
    StyleProvider: {
        new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
            autoClear: {
                type: BooleanConstructor;
                default: boolean;
            };
            mock: {
                type: import("vue").PropType<"server" | "client">;
                default: "server" | "client";
            };
            cache: {
                type: import("vue").PropType<import("./Cache").default>;
                default: import("./Cache").default;
            };
            defaultCache: {
                type: BooleanConstructor;
                default: boolean;
            };
            hashPriority: {
                type: import("vue").PropType<import("./StyleContext").HashPriority>;
                default: import("./StyleContext").HashPriority;
            };
            container: {
                type: import("vue").PropType<Element | ShadowRoot>;
                default: Element | ShadowRoot;
            };
            ssrInline: {
                type: BooleanConstructor;
                default: boolean;
            };
            transformers: {
                type: import("vue").PropType<Transformer[]>;
                default: Transformer[];
            };
            linters: {
                type: import("vue").PropType<Linter[]>;
                default: Linter[];
            };
        }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
            autoClear: boolean;
            mock: "server" | "client";
            cache: import("./Cache").default;
            defaultCache: boolean;
            hashPriority: import("./StyleContext").HashPriority;
            container: Element | ShadowRoot;
            ssrInline: boolean;
            transformers: Transformer[];
            linters: Linter[];
        }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import("vue").ExtractPropTypes<{
            autoClear: {
                type: BooleanConstructor;
                default: boolean;
            };
            mock: {
                type: import("vue").PropType<"server" | "client">;
                default: "server" | "client";
            };
            cache: {
                type: import("vue").PropType<import("./Cache").default>;
                default: import("./Cache").default;
            };
            defaultCache: {
                type: BooleanConstructor;
                default: boolean;
            };
            hashPriority: {
                type: import("vue").PropType<import("./StyleContext").HashPriority>;
                default: import("./StyleContext").HashPriority;
            };
            container: {
                type: import("vue").PropType<Element | ShadowRoot>;
                default: Element | ShadowRoot;
            };
            ssrInline: {
                type: BooleanConstructor;
                default: boolean;
            };
            transformers: {
                type: import("vue").PropType<Transformer[]>;
                default: Transformer[];
            };
            linters: {
                type: import("vue").PropType<Linter[]>;
                default: Linter[];
            };
        }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[], {}, {}, {}, {
            autoClear: boolean;
            mock: "server" | "client";
            cache: import("./Cache").default;
            defaultCache: boolean;
            hashPriority: import("./StyleContext").HashPriority;
            container: Element | ShadowRoot;
            ssrInline: boolean;
            transformers: Transformer[];
            linters: Linter[];
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
        autoClear: {
            type: BooleanConstructor;
            default: boolean;
        };
        mock: {
            type: import("vue").PropType<"server" | "client">;
            default: "server" | "client";
        };
        cache: {
            type: import("vue").PropType<import("./Cache").default>;
            default: import("./Cache").default;
        };
        defaultCache: {
            type: BooleanConstructor;
            default: boolean;
        };
        hashPriority: {
            type: import("vue").PropType<import("./StyleContext").HashPriority>;
            default: import("./StyleContext").HashPriority;
        };
        container: {
            type: import("vue").PropType<Element | ShadowRoot>;
            default: Element | ShadowRoot;
        };
        ssrInline: {
            type: BooleanConstructor;
            default: boolean;
        };
        transformers: {
            type: import("vue").PropType<Transformer[]>;
            default: Transformer[];
        };
        linters: {
            type: import("vue").PropType<Linter[]>;
            default: Linter[];
        };
    }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
        autoClear: boolean;
        mock: "server" | "client";
        cache: import("./Cache").default;
        defaultCache: boolean;
        hashPriority: import("./StyleContext").HashPriority;
        container: Element | ShadowRoot;
        ssrInline: boolean;
        transformers: Transformer[];
        linters: Linter[];
    }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
};
export { Theme, createTheme, useStyleRegister, useCacheToken, createCache, useStyleInject, useStyleProvider, Keyframes, extractStyle, legacyLogicalPropertiesTransformer, px2remTransformer, logicalPropertiesLinter, legacyNotSelectorLinter, parentSelectorLinter, StyleProvider, };
export type { TokenType, CSSObject, CSSInterpolation, DerivativeFunc, Transformer, Linter, StyleContextProps, StyleProviderProps, };
export declare const _experimental: {
    supportModernCSS: () => boolean;
};
export default cssinjs;
