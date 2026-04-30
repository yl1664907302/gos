import type { VNodeTypes, PropType, ComputedRef, Ref } from 'vue';
import type { Locale } from '.';
export type LocaleComponentName = Exclude<keyof Locale, 'locale'>;
export interface LocaleReceiverProps {
    componentName?: string;
    defaultLocale?: Locale | Function;
    children: (locale: Locale, localeCode?: string, fullLocale?: Locale) => VNodeTypes;
}
interface LocaleInterface {
    [key: string]: any;
}
export interface LocaleReceiverContext {
    antLocale?: LocaleInterface;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    componentName: PropType<LocaleComponentName>;
    defaultLocale: {
        type: (ObjectConstructor | FunctionConstructor)[];
    };
    children: {
        type: PropType<(locale: any, localeCode?: string, fullLocale?: object) => VNodeTypes>;
    };
}>, () => VNodeTypes | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    componentName: PropType<LocaleComponentName>;
    defaultLocale: {
        type: (ObjectConstructor | FunctionConstructor)[];
    };
    children: {
        type: PropType<(locale: any, localeCode?: string, fullLocale?: object) => VNodeTypes>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
export declare function useLocaleReceiver<T extends LocaleComponentName>(componentName: T, defaultLocale?: Locale[T] | Function | ComputedRef<Locale[T] | Function>, propsLocale?: Ref<Locale[T]>): [ComputedRef<Locale[T]>];
