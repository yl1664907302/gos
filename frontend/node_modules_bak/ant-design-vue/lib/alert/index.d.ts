import type { ExtractPropTypes, PropType } from 'vue';
import type { NodeMouseEventHandler } from '../vc-tree/contextTypes';
declare const AlertTypes: ["success", "info", "warning", "error"];
export type AlertType = (typeof AlertTypes)[number];
export declare const alertProps: () => {
    /**
     * Type of Alert styles, options: `success`, `info`, `warning`, `error`
     */
    type: import("vue-types").VueTypeDef<"error" | "success" | "warning" | "info">;
    /** Whether Alert can be closed */
    closable: {
        type: BooleanConstructor;
        default: any;
    };
    /** Close text to show */
    closeText: import("vue-types").VueTypeValidableDef<any>;
    /** Content of Alert */
    message: import("vue-types").VueTypeValidableDef<any>;
    /** Additional content of Alert */
    description: import("vue-types").VueTypeValidableDef<any>;
    /** Trigger when animation ending of Alert */
    afterClose: PropType<() => void>;
    /** Whether to show icon */
    showIcon: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    banner: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    onClose: PropType<NodeMouseEventHandler>;
};
export type AlertProps = Partial<ExtractPropTypes<ReturnType<typeof alertProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        /**
         * Type of Alert styles, options: `success`, `info`, `warning`, `error`
         */
        type: import("vue-types").VueTypeDef<"error" | "success" | "warning" | "info">;
        /** Whether Alert can be closed */
        closable: {
            type: BooleanConstructor;
            default: any;
        };
        /** Close text to show */
        closeText: import("vue-types").VueTypeValidableDef<any>;
        /** Content of Alert */
        message: import("vue-types").VueTypeValidableDef<any>;
        /** Additional content of Alert */
        description: import("vue-types").VueTypeValidableDef<any>;
        /** Trigger when animation ending of Alert */
        afterClose: PropType<() => void>;
        /** Whether to show icon */
        showIcon: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        banner: {
            type: BooleanConstructor;
            default: any;
        };
        icon: import("vue-types").VueTypeValidableDef<any>;
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        onClose: PropType<NodeMouseEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        showIcon: boolean;
        closable: boolean;
        banner: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        /**
         * Type of Alert styles, options: `success`, `info`, `warning`, `error`
         */
        type: import("vue-types").VueTypeDef<"error" | "success" | "warning" | "info">;
        /** Whether Alert can be closed */
        closable: {
            type: BooleanConstructor;
            default: any;
        };
        /** Close text to show */
        closeText: import("vue-types").VueTypeValidableDef<any>;
        /** Content of Alert */
        message: import("vue-types").VueTypeValidableDef<any>;
        /** Additional content of Alert */
        description: import("vue-types").VueTypeValidableDef<any>;
        /** Trigger when animation ending of Alert */
        afterClose: PropType<() => void>;
        /** Whether to show icon */
        showIcon: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        banner: {
            type: BooleanConstructor;
            default: any;
        };
        icon: import("vue-types").VueTypeValidableDef<any>;
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        onClose: PropType<NodeMouseEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        showIcon: boolean;
        closable: boolean;
        banner: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    /**
     * Type of Alert styles, options: `success`, `info`, `warning`, `error`
     */
    type: import("vue-types").VueTypeDef<"error" | "success" | "warning" | "info">;
    /** Whether Alert can be closed */
    closable: {
        type: BooleanConstructor;
        default: any;
    };
    /** Close text to show */
    closeText: import("vue-types").VueTypeValidableDef<any>;
    /** Content of Alert */
    message: import("vue-types").VueTypeValidableDef<any>;
    /** Additional content of Alert */
    description: import("vue-types").VueTypeValidableDef<any>;
    /** Trigger when animation ending of Alert */
    afterClose: PropType<() => void>;
    /** Whether to show icon */
    showIcon: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    banner: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    onClose: PropType<NodeMouseEventHandler>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    showIcon: boolean;
    closable: boolean;
    banner: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
