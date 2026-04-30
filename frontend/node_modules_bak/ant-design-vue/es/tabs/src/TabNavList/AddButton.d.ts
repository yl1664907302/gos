import type { PropType } from 'vue';
import type { EditableConfig, TabsLocale } from '../interface';
export interface AddButtonProps {
    prefixCls: string;
    editable?: EditableConfig;
    locale?: TabsLocale;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    editable: {
        type: PropType<EditableConfig>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    editable: {
        type: PropType<EditableConfig>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
}>> & Readonly<{}>, {
    locale: TabsLocale;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
