import type { Plugin } from 'vue';
export declare const AppProps: () => {
    rootClassName: StringConstructor;
    message: {
        type: import("vue").PropType<import("../message/interface").ConfigOptions>;
        default: import("../message/interface").ConfigOptions;
    };
    notification: {
        type: import("vue").PropType<import("../notification/interface").NotificationConfig>;
        default: import("../notification/interface").NotificationConfig;
    };
};
declare const useApp: () => import("./context").useAppProps;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        rootClassName: StringConstructor;
        message: {
            type: import("vue").PropType<import("../message/interface").ConfigOptions>;
            default: import("../message/interface").ConfigOptions;
        };
        notification: {
            type: import("vue").PropType<import("../notification/interface").NotificationConfig>;
            default: import("../notification/interface").NotificationConfig;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        message: import("../message/interface").ConfigOptions;
        notification: import("../notification/interface").NotificationConfig;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        rootClassName: StringConstructor;
        message: {
            type: import("vue").PropType<import("../message/interface").ConfigOptions>;
            default: import("../message/interface").ConfigOptions;
        };
        notification: {
            type: import("vue").PropType<import("../notification/interface").NotificationConfig>;
            default: import("../notification/interface").NotificationConfig;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        message: import("../message/interface").ConfigOptions;
        notification: import("../notification/interface").NotificationConfig;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    rootClassName: StringConstructor;
    message: {
        type: import("vue").PropType<import("../message/interface").ConfigOptions>;
        default: import("../message/interface").ConfigOptions;
    };
    notification: {
        type: import("vue").PropType<import("../notification/interface").NotificationConfig>;
        default: import("../notification/interface").NotificationConfig;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    message: import("../message/interface").ConfigOptions;
    notification: import("../notification/interface").NotificationConfig;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly useApp: typeof useApp;
};
export default _default;
