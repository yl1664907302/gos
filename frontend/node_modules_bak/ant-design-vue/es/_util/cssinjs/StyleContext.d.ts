import type { ShallowRef, ExtractPropTypes, Ref } from 'vue';
import CacheEntity from './Cache';
import type { Linter } from './linters/interface';
import type { Transformer } from './transformers/interface';
export declare const ATTR_TOKEN = "data-token-hash";
export declare const ATTR_MARK = "data-css-hash";
export declare const ATTR_CACHE_PATH = "data-cache-path";
export declare const CSS_IN_JS_INSTANCE = "__cssinjs_instance__";
export declare function createCache(): CacheEntity;
export type HashPriority = 'low' | 'high';
export interface StyleContextProps {
    autoClear?: boolean;
    /** @private Test only. Not work in production. */
    mock?: 'server' | 'client';
    /**
     * Only set when you need ssr to extract style on you own.
     * If not provided, it will auto create <style /> on the end of Provider in server side.
     */
    cache: CacheEntity;
    /** Tell children that this context is default generated context */
    defaultCache: boolean;
    /** Use `:where` selector to reduce hashId css selector priority */
    hashPriority?: HashPriority;
    /** Tell cssinjs where to inject style in */
    container?: Element | ShadowRoot;
    /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
    ssrInline?: boolean;
    /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
    transformers?: Transformer[];
    /**
     * Linters to lint css before inject in document.
     * Styles will be linted after transforming.
     * Please note that `linters` do not support dynamic update.
     */
    linters?: Linter[];
}
export type UseStyleProviderProps = Partial<StyleContextProps> | Ref<Partial<StyleContextProps>>;
export declare const useStyleInject: () => ShallowRef<Partial<StyleContextProps>, Partial<StyleContextProps>>;
export declare const useStyleProvider: (props: UseStyleProviderProps) => ShallowRef<Partial<StyleContextProps>, Partial<StyleContextProps>>;
export declare const styleProviderProps: () => {
    autoClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** @private Test only. Not work in production. */
    mock: {
        type: import("vue").PropType<"server" | "client">;
        default: "server" | "client";
    };
    /**
     * Only set when you need ssr to extract style on you own.
     * If not provided, it will auto create <style /> on the end of Provider in server side.
     */
    cache: {
        type: import("vue").PropType<CacheEntity>;
        default: CacheEntity;
    };
    /** Tell children that this context is default generated context */
    defaultCache: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Use `:where` selector to reduce hashId css selector priority */
    hashPriority: {
        type: import("vue").PropType<HashPriority>;
        default: HashPriority;
    };
    /** Tell cssinjs where to inject style in */
    container: {
        type: import("vue").PropType<Element | ShadowRoot>;
        default: Element | ShadowRoot;
    };
    /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
    ssrInline: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
    transformers: {
        type: import("vue").PropType<Transformer[]>;
        default: Transformer[];
    };
    /**
     * Linters to lint css before inject in document.
     * Styles will be linted after transforming.
     * Please note that `linters` do not support dynamic update.
     */
    linters: {
        type: import("vue").PropType<Linter[]>;
        default: Linter[];
    };
};
export type StyleProviderProps = Partial<ExtractPropTypes<ReturnType<typeof styleProviderProps>>>;
export declare const StyleProvider: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        autoClear: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** @private Test only. Not work in production. */
        mock: {
            type: import("vue").PropType<"server" | "client">;
            default: "server" | "client";
        };
        /**
         * Only set when you need ssr to extract style on you own.
         * If not provided, it will auto create <style /> on the end of Provider in server side.
         */
        cache: {
            type: import("vue").PropType<CacheEntity>;
            default: CacheEntity;
        };
        /** Tell children that this context is default generated context */
        defaultCache: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** Use `:where` selector to reduce hashId css selector priority */
        hashPriority: {
            type: import("vue").PropType<HashPriority>;
            default: HashPriority;
        };
        /** Tell cssinjs where to inject style in */
        container: {
            type: import("vue").PropType<Element | ShadowRoot>;
            default: Element | ShadowRoot;
        };
        /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
        ssrInline: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
        transformers: {
            type: import("vue").PropType<Transformer[]>;
            default: Transformer[];
        };
        /**
         * Linters to lint css before inject in document.
         * Styles will be linted after transforming.
         * Please note that `linters` do not support dynamic update.
         */
        linters: {
            type: import("vue").PropType<Linter[]>;
            default: Linter[];
        };
    }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        autoClear: boolean;
        mock: "server" | "client";
        cache: CacheEntity;
        defaultCache: boolean;
        hashPriority: HashPriority;
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
    }, Readonly<ExtractPropTypes<{
        autoClear: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** @private Test only. Not work in production. */
        mock: {
            type: import("vue").PropType<"server" | "client">;
            default: "server" | "client";
        };
        /**
         * Only set when you need ssr to extract style on you own.
         * If not provided, it will auto create <style /> on the end of Provider in server side.
         */
        cache: {
            type: import("vue").PropType<CacheEntity>;
            default: CacheEntity;
        };
        /** Tell children that this context is default generated context */
        defaultCache: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** Use `:where` selector to reduce hashId css selector priority */
        hashPriority: {
            type: import("vue").PropType<HashPriority>;
            default: HashPriority;
        };
        /** Tell cssinjs where to inject style in */
        container: {
            type: import("vue").PropType<Element | ShadowRoot>;
            default: Element | ShadowRoot;
        };
        /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
        ssrInline: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
        transformers: {
            type: import("vue").PropType<Transformer[]>;
            default: Transformer[];
        };
        /**
         * Linters to lint css before inject in document.
         * Styles will be linted after transforming.
         * Please note that `linters` do not support dynamic update.
         */
        linters: {
            type: import("vue").PropType<Linter[]>;
            default: Linter[];
        };
    }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, {
        autoClear: boolean;
        mock: "server" | "client";
        cache: CacheEntity;
        defaultCache: boolean;
        hashPriority: HashPriority;
        container: Element | ShadowRoot;
        ssrInline: boolean;
        transformers: Transformer[];
        linters: Linter[];
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    autoClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** @private Test only. Not work in production. */
    mock: {
        type: import("vue").PropType<"server" | "client">;
        default: "server" | "client";
    };
    /**
     * Only set when you need ssr to extract style on you own.
     * If not provided, it will auto create <style /> on the end of Provider in server side.
     */
    cache: {
        type: import("vue").PropType<CacheEntity>;
        default: CacheEntity;
    };
    /** Tell children that this context is default generated context */
    defaultCache: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Use `:where` selector to reduce hashId css selector priority */
    hashPriority: {
        type: import("vue").PropType<HashPriority>;
        default: HashPriority;
    };
    /** Tell cssinjs where to inject style in */
    container: {
        type: import("vue").PropType<Element | ShadowRoot>;
        default: Element | ShadowRoot;
    };
    /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
    ssrInline: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
    transformers: {
        type: import("vue").PropType<Transformer[]>;
        default: Transformer[];
    };
    /**
     * Linters to lint css before inject in document.
     * Styles will be linted after transforming.
     * Please note that `linters` do not support dynamic update.
     */
    linters: {
        type: import("vue").PropType<Linter[]>;
        default: Linter[];
    };
}>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    autoClear: boolean;
    mock: "server" | "client";
    cache: CacheEntity;
    defaultCache: boolean;
    hashPriority: HashPriority;
    container: Element | ShadowRoot;
    ssrInline: boolean;
    transformers: Transformer[];
    linters: Linter[];
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
declare const _default: {
    useStyleInject: () => ShallowRef<Partial<StyleContextProps>, Partial<StyleContextProps>>;
    useStyleProvider: (props: UseStyleProviderProps) => ShallowRef<Partial<StyleContextProps>, Partial<StyleContextProps>>;
    StyleProvider: {
        new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
            autoClear: {
                type: BooleanConstructor;
                default: boolean;
            };
            /** @private Test only. Not work in production. */
            mock: {
                type: import("vue").PropType<"server" | "client">;
                default: "server" | "client";
            };
            /**
             * Only set when you need ssr to extract style on you own.
             * If not provided, it will auto create <style /> on the end of Provider in server side.
             */
            cache: {
                type: import("vue").PropType<CacheEntity>;
                default: CacheEntity;
            };
            /** Tell children that this context is default generated context */
            defaultCache: {
                type: BooleanConstructor;
                default: boolean;
            };
            /** Use `:where` selector to reduce hashId css selector priority */
            hashPriority: {
                type: import("vue").PropType<HashPriority>;
                default: HashPriority;
            };
            /** Tell cssinjs where to inject style in */
            container: {
                type: import("vue").PropType<Element | ShadowRoot>;
                default: Element | ShadowRoot;
            };
            /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
            ssrInline: {
                type: BooleanConstructor;
                default: boolean;
            };
            /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
            transformers: {
                type: import("vue").PropType<Transformer[]>;
                default: Transformer[];
            };
            /**
             * Linters to lint css before inject in document.
             * Styles will be linted after transforming.
             * Please note that `linters` do not support dynamic update.
             */
            linters: {
                type: import("vue").PropType<Linter[]>;
                default: Linter[];
            };
        }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
            autoClear: boolean;
            mock: "server" | "client";
            cache: CacheEntity;
            defaultCache: boolean;
            hashPriority: HashPriority;
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
        }, Readonly<ExtractPropTypes<{
            autoClear: {
                type: BooleanConstructor;
                default: boolean;
            };
            /** @private Test only. Not work in production. */
            mock: {
                type: import("vue").PropType<"server" | "client">;
                default: "server" | "client";
            };
            /**
             * Only set when you need ssr to extract style on you own.
             * If not provided, it will auto create <style /> on the end of Provider in server side.
             */
            cache: {
                type: import("vue").PropType<CacheEntity>;
                default: CacheEntity;
            };
            /** Tell children that this context is default generated context */
            defaultCache: {
                type: BooleanConstructor;
                default: boolean;
            };
            /** Use `:where` selector to reduce hashId css selector priority */
            hashPriority: {
                type: import("vue").PropType<HashPriority>;
                default: HashPriority;
            };
            /** Tell cssinjs where to inject style in */
            container: {
                type: import("vue").PropType<Element | ShadowRoot>;
                default: Element | ShadowRoot;
            };
            /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
            ssrInline: {
                type: BooleanConstructor;
                default: boolean;
            };
            /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
            transformers: {
                type: import("vue").PropType<Transformer[]>;
                default: Transformer[];
            };
            /**
             * Linters to lint css before inject in document.
             * Styles will be linted after transforming.
             * Please note that `linters` do not support dynamic update.
             */
            linters: {
                type: import("vue").PropType<Linter[]>;
                default: Linter[];
            };
        }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[], {}, {}, {}, {
            autoClear: boolean;
            mock: "server" | "client";
            cache: CacheEntity;
            defaultCache: boolean;
            hashPriority: HashPriority;
            container: Element | ShadowRoot;
            ssrInline: boolean;
            transformers: Transformer[];
            linters: Linter[];
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
        autoClear: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** @private Test only. Not work in production. */
        mock: {
            type: import("vue").PropType<"server" | "client">;
            default: "server" | "client";
        };
        /**
         * Only set when you need ssr to extract style on you own.
         * If not provided, it will auto create <style /> on the end of Provider in server side.
         */
        cache: {
            type: import("vue").PropType<CacheEntity>;
            default: CacheEntity;
        };
        /** Tell children that this context is default generated context */
        defaultCache: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** Use `:where` selector to reduce hashId css selector priority */
        hashPriority: {
            type: import("vue").PropType<HashPriority>;
            default: HashPriority;
        };
        /** Tell cssinjs where to inject style in */
        container: {
            type: import("vue").PropType<Element | ShadowRoot>;
            default: Element | ShadowRoot;
        };
        /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
        ssrInline: {
            type: BooleanConstructor;
            default: boolean;
        };
        /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
        transformers: {
            type: import("vue").PropType<Transformer[]>;
            default: Transformer[];
        };
        /**
         * Linters to lint css before inject in document.
         * Styles will be linted after transforming.
         * Please note that `linters` do not support dynamic update.
         */
        linters: {
            type: import("vue").PropType<Linter[]>;
            default: Linter[];
        };
    }>> & Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
        autoClear: boolean;
        mock: "server" | "client";
        cache: CacheEntity;
        defaultCache: boolean;
        hashPriority: HashPriority;
        container: Element | ShadowRoot;
        ssrInline: boolean;
        transformers: Transformer[];
        linters: Linter[];
    }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
};
export default _default;
