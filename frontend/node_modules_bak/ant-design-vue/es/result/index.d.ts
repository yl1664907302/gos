import type { Plugin, ExtractPropTypes, PropType } from 'vue';
import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';
import type { CustomSlotsType } from '../_util/type';
export declare const IconMap: {
    success: import("@ant-design/icons-vue/lib/icons/CheckCircleFilled").CheckCircleFilledIconType;
    error: import("@ant-design/icons-vue/lib/icons/CloseCircleFilled").CloseCircleFilledIconType;
    info: import("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled").ExclamationCircleFilledIconType;
    warning: import("@ant-design/icons-vue/lib/icons/WarningFilled").WarningFilledIconType;
};
export declare const ExceptionMap: {
    '404': () => import("vue/jsx-runtime").JSX.Element;
    '500': () => import("vue/jsx-runtime").JSX.Element;
    '403': () => import("vue/jsx-runtime").JSX.Element;
};
export type ExceptionStatusType = 403 | 404 | 500 | '403' | '404' | '500';
export type ResultStatusType = ExceptionStatusType | keyof typeof IconMap;
export declare const resultProps: () => {
    prefixCls: StringConstructor;
    icon: import("vue-types").VueTypeValidableDef<any>;
    status: {
        type: PropType<ResultStatusType>;
        default: string;
    };
    title: import("vue-types").VueTypeValidableDef<any>;
    subTitle: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
};
export type ResultProps = Partial<ExtractPropTypes<ReturnType<typeof resultProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        icon: import("vue-types").VueTypeValidableDef<any>;
        status: {
            type: PropType<ResultStatusType>;
            default: string;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        subTitle: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        status: ResultStatusType;
    }, true, {}, CustomSlotsType<{
        title?: any;
        subTitle?: any;
        icon?: any;
        extra?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        icon: import("vue-types").VueTypeValidableDef<any>;
        status: {
            type: PropType<ResultStatusType>;
            default: string;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        subTitle: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        status: ResultStatusType;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    icon: import("vue-types").VueTypeValidableDef<any>;
    status: {
        type: PropType<ResultStatusType>;
        default: string;
    };
    title: import("vue-types").VueTypeValidableDef<any>;
    subTitle: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    status: ResultStatusType;
}, {}, string, CustomSlotsType<{
    title?: any;
    subTitle?: any;
    icon?: any;
    extra?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly PRESENTED_IMAGE_403: typeof unauthorized;
    readonly PRESENTED_IMAGE_404: typeof noFound;
    readonly PRESENTED_IMAGE_500: typeof serverError;
};
export default _default;
