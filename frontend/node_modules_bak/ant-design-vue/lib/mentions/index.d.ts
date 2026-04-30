import type { App, PropType, ExtractPropTypes } from 'vue';
import type { KeyboardEventHandler } from '../_util/EventInterface';
import type { CustomSlotsType } from '../_util/type';
interface MentionsConfig {
    prefix?: string | string[];
    split?: string;
}
export interface MentionsOptionProps {
    value: string;
    disabled?: boolean;
    label?: string | number | ((o: MentionsOptionProps) => any);
    [key: string]: any;
}
interface MentionsEntity {
    prefix: string;
    value: string;
}
export type MentionPlacement = 'top' | 'bottom';
export declare const mentionsProps: () => {
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onSelect: {
        type: PropType<(option: MentionsOptionProps, prefix: string) => void>;
    };
    onChange: {
        type: PropType<(text: string) => void>;
    };
    onPressenter: {
        type: PropType<KeyboardEventHandler>;
    };
    'onUpdate:value': {
        type: PropType<(text: string) => void>;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    defaultValue: StringConstructor;
    id: StringConstructor;
    status: PropType<"" | "error" | "warning">;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    prefix: import("vue-types").VueTypeDef<string | string[]>;
    prefixCls: StringConstructor;
    value: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    split: StringConstructor;
    transitionName: StringConstructor;
    placement: import("vue-types").VueTypeDef<"top" | "bottom">;
    character: import("vue-types").VueTypeValidableDef<any>;
    characterRender: FunctionConstructor;
    filterOption: {
        type: PropType<false | typeof import("../vc-mentions/src/util").filterOption>;
    };
    validateSearch: FunctionConstructor;
    getPopupContainer: {
        type: PropType<() => HTMLElement>;
    };
    options: {
        type: PropType<import("../vc-mentions/src/Option").OptionProps[]>;
        default: import("../vc-mentions/src/Option").OptionProps[];
    };
    rows: (StringConstructor | NumberConstructor)[];
    direction: {
        type: PropType<import("../vc-mentions/src/mentionsProps").Direction>;
    };
};
export type MentionsProps = Partial<ExtractPropTypes<ReturnType<typeof mentionsProps>>>;
export declare const MentionsOption: import("vue").DefineComponent<ExtractPropTypes<{
    label: {
        default: import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode);
        type: PropType<import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode)>;
    };
    value: StringConstructor;
    disabled: BooleanConstructor;
    payload: {
        type: PropType<Record<string, any>>;
        default: Record<string, any>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    label: {
        default: import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode);
        type: PropType<import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode)>;
    };
    value: StringConstructor;
    disabled: BooleanConstructor;
    payload: {
        type: PropType<Record<string, any>>;
        default: Record<string, any>;
    };
}>> & Readonly<{}>, {
    label: import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode);
    disabled: boolean;
    payload: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        onFocus: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onBlur: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onSelect: {
            type: PropType<(option: MentionsOptionProps, prefix: string) => void>;
        };
        onChange: {
            type: PropType<(text: string) => void>;
        };
        onPressenter: {
            type: PropType<KeyboardEventHandler>;
        };
        'onUpdate:value': {
            type: PropType<(text: string) => void>;
        };
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        defaultValue: StringConstructor;
        id: StringConstructor;
        status: PropType<"" | "error" | "warning">;
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        prefix: import("vue-types").VueTypeDef<string | string[]>;
        prefixCls: StringConstructor;
        value: StringConstructor;
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        split: StringConstructor;
        transitionName: StringConstructor;
        placement: import("vue-types").VueTypeDef<"top" | "bottom">;
        character: import("vue-types").VueTypeValidableDef<any>;
        characterRender: FunctionConstructor;
        filterOption: {
            type: PropType<false | typeof import("../vc-mentions/src/util").filterOption>;
        };
        validateSearch: FunctionConstructor;
        getPopupContainer: {
            type: PropType<() => HTMLElement>;
        };
        options: {
            type: PropType<import("../vc-mentions/src/Option").OptionProps[]>;
            default: import("../vc-mentions/src/Option").OptionProps[];
        };
        rows: (StringConstructor | NumberConstructor)[];
        direction: {
            type: PropType<import("../vc-mentions/src/mentionsProps").Direction>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        disabled: boolean;
        autofocus: boolean;
        options: import("../vc-mentions/src/Option").OptionProps[];
        loading: boolean;
    }, true, {}, CustomSlotsType<{
        notFoundContent?: any;
        option?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        onFocus: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onBlur: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onSelect: {
            type: PropType<(option: MentionsOptionProps, prefix: string) => void>;
        };
        onChange: {
            type: PropType<(text: string) => void>;
        };
        onPressenter: {
            type: PropType<KeyboardEventHandler>;
        };
        'onUpdate:value': {
            type: PropType<(text: string) => void>;
        };
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        defaultValue: StringConstructor;
        id: StringConstructor;
        status: PropType<"" | "error" | "warning">;
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        prefix: import("vue-types").VueTypeDef<string | string[]>;
        prefixCls: StringConstructor;
        value: StringConstructor;
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        split: StringConstructor;
        transitionName: StringConstructor;
        placement: import("vue-types").VueTypeDef<"top" | "bottom">;
        character: import("vue-types").VueTypeValidableDef<any>;
        characterRender: FunctionConstructor;
        filterOption: {
            type: PropType<false | typeof import("../vc-mentions/src/util").filterOption>;
        };
        validateSearch: FunctionConstructor;
        getPopupContainer: {
            type: PropType<() => HTMLElement>;
        };
        options: {
            type: PropType<import("../vc-mentions/src/Option").OptionProps[]>;
            default: import("../vc-mentions/src/Option").OptionProps[];
        };
        rows: (StringConstructor | NumberConstructor)[];
        direction: {
            type: PropType<import("../vc-mentions/src/mentionsProps").Direction>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        disabled: boolean;
        autofocus: boolean;
        options: import("../vc-mentions/src/Option").OptionProps[];
        loading: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onSelect: {
        type: PropType<(option: MentionsOptionProps, prefix: string) => void>;
    };
    onChange: {
        type: PropType<(text: string) => void>;
    };
    onPressenter: {
        type: PropType<KeyboardEventHandler>;
    };
    'onUpdate:value': {
        type: PropType<(text: string) => void>;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    defaultValue: StringConstructor;
    id: StringConstructor;
    status: PropType<"" | "error" | "warning">;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    prefix: import("vue-types").VueTypeDef<string | string[]>;
    prefixCls: StringConstructor;
    value: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    split: StringConstructor;
    transitionName: StringConstructor;
    placement: import("vue-types").VueTypeDef<"top" | "bottom">;
    character: import("vue-types").VueTypeValidableDef<any>;
    characterRender: FunctionConstructor;
    filterOption: {
        type: PropType<false | typeof import("../vc-mentions/src/util").filterOption>;
    };
    validateSearch: FunctionConstructor;
    getPopupContainer: {
        type: PropType<() => HTMLElement>;
    };
    options: {
        type: PropType<import("../vc-mentions/src/Option").OptionProps[]>;
        default: import("../vc-mentions/src/Option").OptionProps[];
    };
    rows: (StringConstructor | NumberConstructor)[];
    direction: {
        type: PropType<import("../vc-mentions/src/mentionsProps").Direction>;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    disabled: boolean;
    autofocus: boolean;
    options: import("../vc-mentions/src/Option").OptionProps[];
    loading: boolean;
}, {}, string, CustomSlotsType<{
    notFoundContent?: any;
    option?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    Option: import("vue").DefineComponent<ExtractPropTypes<{
        label: {
            default: import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode);
            type: PropType<import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode)>;
        };
        value: StringConstructor;
        disabled: BooleanConstructor;
        payload: {
            type: PropType<Record<string, any>>;
            default: Record<string, any>;
        };
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
        label: {
            default: import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode);
            type: PropType<import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode)>;
        };
        value: StringConstructor;
        disabled: BooleanConstructor;
        payload: {
            type: PropType<Record<string, any>>;
            default: Record<string, any>;
        };
    }>> & Readonly<{}>, {
        label: import("../_util/type").VueNode | ((o: import("../vc-mentions/src/Option").BaseOptionsProps) => import("../_util/type").VueNode);
        disabled: boolean;
        payload: Record<string, any>;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    getMentions: (value?: string, config?: MentionsConfig) => MentionsEntity[];
    install: (app: App) => App<any>;
};
export default _default;
