import type { App, ExtractPropTypes } from 'vue';
import type { VueNode, CustomSlotsType } from '../_util/type';
import type { Status, ProgressDotRender } from '../vc-steps/interface';
import type { MouseEventHandler } from '../_util/EventInterface';
export declare const stepsProps: () => {
    prefixCls: StringConstructor;
    iconPrefix: StringConstructor;
    current: NumberConstructor;
    initial: NumberConstructor;
    percent: NumberConstructor;
    responsive: {
        type: BooleanConstructor;
        default: boolean;
    };
    items: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            description: {
                default: any;
                type: import("vue").PropType<any>;
            };
            icon: {
                default: any;
                type: import("vue").PropType<any>;
            };
            status: {
                type: import("vue").PropType<Status>;
                default: Status;
            };
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            title: {
                default: any;
                type: import("vue").PropType<any>;
            };
            subTitle: {
                default: any;
                type: import("vue").PropType<any>;
            };
            onClick: {
                type: import("vue").PropType<MouseEventHandler>;
                default: MouseEventHandler;
            };
        }>>[]>;
        default: Partial<ExtractPropTypes<{
            description: {
                default: any;
                type: import("vue").PropType<any>;
            };
            icon: {
                default: any;
                type: import("vue").PropType<any>;
            };
            status: {
                type: import("vue").PropType<Status>;
                default: Status;
            };
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            title: {
                default: any;
                type: import("vue").PropType<any>;
            };
            subTitle: {
                default: any;
                type: import("vue").PropType<any>;
            };
            onClick: {
                type: import("vue").PropType<MouseEventHandler>;
                default: MouseEventHandler;
            };
        }>>[];
    };
    labelPlacement: {
        type: import("vue").PropType<"vertical" | "horizontal">;
        default: "vertical" | "horizontal";
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    size: {
        type: import("vue").PropType<"default" | "small">;
        default: "default" | "small";
    };
    direction: {
        type: import("vue").PropType<"vertical" | "horizontal">;
        default: "vertical" | "horizontal";
    };
    progressDot: {
        type: import("vue").PropType<boolean | ProgressDotRender>;
        default: boolean | ProgressDotRender;
    };
    type: {
        type: import("vue").PropType<"default" | "inline" | "navigation">;
        default: "default" | "inline" | "navigation";
    };
    onChange: {
        type: import("vue").PropType<(current: number) => void>;
        default: (current: number) => void;
    };
    'onUpdate:current': {
        type: import("vue").PropType<(current: number) => void>;
        default: (current: number) => void;
    };
};
export declare const stepProps: () => {
    description: {
        default: any;
        type: import("vue").PropType<any>;
    };
    icon: {
        default: any;
        type: import("vue").PropType<any>;
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    title: {
        default: any;
        type: import("vue").PropType<any>;
    };
    subTitle: {
        default: any;
        type: import("vue").PropType<any>;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
};
export type StepsProps = Partial<ExtractPropTypes<ReturnType<typeof stepsProps>>>;
export type StepProps = Partial<ExtractPropTypes<ReturnType<typeof stepProps>>>;
export declare const Step: import("vue").DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, import("vue").PublicProps>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        iconPrefix: StringConstructor;
        current: NumberConstructor;
        initial: NumberConstructor;
        percent: NumberConstructor;
        responsive: {
            type: BooleanConstructor;
            default: boolean;
        };
        items: {
            type: import("vue").PropType<Partial<ExtractPropTypes<{
                description: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                icon: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                status: {
                    type: import("vue").PropType<Status>;
                    default: Status;
                };
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                title: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                subTitle: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                onClick: {
                    type: import("vue").PropType<MouseEventHandler>;
                    default: MouseEventHandler;
                };
            }>>[]>;
            default: Partial<ExtractPropTypes<{
                description: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                icon: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                status: {
                    type: import("vue").PropType<Status>;
                    default: Status;
                };
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                title: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                subTitle: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                onClick: {
                    type: import("vue").PropType<MouseEventHandler>;
                    default: MouseEventHandler;
                };
            }>>[];
        };
        labelPlacement: {
            type: import("vue").PropType<"vertical" | "horizontal">;
            default: "vertical" | "horizontal";
        };
        status: {
            type: import("vue").PropType<Status>;
            default: Status;
        };
        size: {
            type: import("vue").PropType<"default" | "small">;
            default: "default" | "small";
        };
        direction: {
            type: import("vue").PropType<"vertical" | "horizontal">;
            default: "vertical" | "horizontal";
        };
        progressDot: {
            type: import("vue").PropType<boolean | ProgressDotRender>;
            default: boolean | ProgressDotRender;
        };
        type: {
            type: import("vue").PropType<"default" | "inline" | "navigation">;
            default: "default" | "inline" | "navigation";
        };
        onChange: {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        'onUpdate:current': {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: "default" | "small";
        type: "default" | "inline" | "navigation";
        onChange: (current: number) => void;
        responsive: boolean;
        direction: "vertical" | "horizontal";
        status: Status;
        items: Partial<ExtractPropTypes<{
            description: {
                default: any;
                type: import("vue").PropType<any>;
            };
            icon: {
                default: any;
                type: import("vue").PropType<any>;
            };
            status: {
                type: import("vue").PropType<Status>;
                default: Status;
            };
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            title: {
                default: any;
                type: import("vue").PropType<any>;
            };
            subTitle: {
                default: any;
                type: import("vue").PropType<any>;
            };
            onClick: {
                type: import("vue").PropType<MouseEventHandler>;
                default: MouseEventHandler;
            };
        }>>[];
        'onUpdate:current': (current: number) => void;
        progressDot: boolean | ProgressDotRender;
        labelPlacement: "vertical" | "horizontal";
    }, true, {}, CustomSlotsType<{
        progressDot: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        iconPrefix: StringConstructor;
        current: NumberConstructor;
        initial: NumberConstructor;
        percent: NumberConstructor;
        responsive: {
            type: BooleanConstructor;
            default: boolean;
        };
        items: {
            type: import("vue").PropType<Partial<ExtractPropTypes<{
                description: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                icon: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                status: {
                    type: import("vue").PropType<Status>;
                    default: Status;
                };
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                title: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                subTitle: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                onClick: {
                    type: import("vue").PropType<MouseEventHandler>;
                    default: MouseEventHandler;
                };
            }>>[]>;
            default: Partial<ExtractPropTypes<{
                description: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                icon: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                status: {
                    type: import("vue").PropType<Status>;
                    default: Status;
                };
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                title: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                subTitle: {
                    default: any;
                    type: import("vue").PropType<any>;
                };
                onClick: {
                    type: import("vue").PropType<MouseEventHandler>;
                    default: MouseEventHandler;
                };
            }>>[];
        };
        labelPlacement: {
            type: import("vue").PropType<"vertical" | "horizontal">;
            default: "vertical" | "horizontal";
        };
        status: {
            type: import("vue").PropType<Status>;
            default: Status;
        };
        size: {
            type: import("vue").PropType<"default" | "small">;
            default: "default" | "small";
        };
        direction: {
            type: import("vue").PropType<"vertical" | "horizontal">;
            default: "vertical" | "horizontal";
        };
        progressDot: {
            type: import("vue").PropType<boolean | ProgressDotRender>;
            default: boolean | ProgressDotRender;
        };
        type: {
            type: import("vue").PropType<"default" | "inline" | "navigation">;
            default: "default" | "inline" | "navigation";
        };
        onChange: {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        'onUpdate:current': {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, {
        size: "default" | "small";
        type: "default" | "inline" | "navigation";
        onChange: (current: number) => void;
        responsive: boolean;
        direction: "vertical" | "horizontal";
        status: Status;
        items: Partial<ExtractPropTypes<{
            description: {
                default: any;
                type: import("vue").PropType<any>;
            };
            icon: {
                default: any;
                type: import("vue").PropType<any>;
            };
            status: {
                type: import("vue").PropType<Status>;
                default: Status;
            };
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            title: {
                default: any;
                type: import("vue").PropType<any>;
            };
            subTitle: {
                default: any;
                type: import("vue").PropType<any>;
            };
            onClick: {
                type: import("vue").PropType<MouseEventHandler>;
                default: MouseEventHandler;
            };
        }>>[];
        'onUpdate:current': (current: number) => void;
        progressDot: boolean | ProgressDotRender;
        labelPlacement: "vertical" | "horizontal";
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    iconPrefix: StringConstructor;
    current: NumberConstructor;
    initial: NumberConstructor;
    percent: NumberConstructor;
    responsive: {
        type: BooleanConstructor;
        default: boolean;
    };
    items: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            description: {
                default: any;
                type: import("vue").PropType<any>;
            };
            icon: {
                default: any;
                type: import("vue").PropType<any>;
            };
            status: {
                type: import("vue").PropType<Status>;
                default: Status;
            };
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            title: {
                default: any;
                type: import("vue").PropType<any>;
            };
            subTitle: {
                default: any;
                type: import("vue").PropType<any>;
            };
            onClick: {
                type: import("vue").PropType<MouseEventHandler>;
                default: MouseEventHandler;
            };
        }>>[]>;
        default: Partial<ExtractPropTypes<{
            description: {
                default: any;
                type: import("vue").PropType<any>;
            };
            icon: {
                default: any;
                type: import("vue").PropType<any>;
            };
            status: {
                type: import("vue").PropType<Status>;
                default: Status;
            };
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            title: {
                default: any;
                type: import("vue").PropType<any>;
            };
            subTitle: {
                default: any;
                type: import("vue").PropType<any>;
            };
            onClick: {
                type: import("vue").PropType<MouseEventHandler>;
                default: MouseEventHandler;
            };
        }>>[];
    };
    labelPlacement: {
        type: import("vue").PropType<"vertical" | "horizontal">;
        default: "vertical" | "horizontal";
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    size: {
        type: import("vue").PropType<"default" | "small">;
        default: "default" | "small";
    };
    direction: {
        type: import("vue").PropType<"vertical" | "horizontal">;
        default: "vertical" | "horizontal";
    };
    progressDot: {
        type: import("vue").PropType<boolean | ProgressDotRender>;
        default: boolean | ProgressDotRender;
    };
    type: {
        type: import("vue").PropType<"default" | "inline" | "navigation">;
        default: "default" | "inline" | "navigation";
    };
    onChange: {
        type: import("vue").PropType<(current: number) => void>;
        default: (current: number) => void;
    };
    'onUpdate:current': {
        type: import("vue").PropType<(current: number) => void>;
        default: (current: number) => void;
    };
}>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: "default" | "small";
    type: "default" | "inline" | "navigation";
    onChange: (current: number) => void;
    responsive: boolean;
    direction: "vertical" | "horizontal";
    status: Status;
    items: Partial<ExtractPropTypes<{
        description: {
            default: any;
            type: import("vue").PropType<any>;
        };
        icon: {
            default: any;
            type: import("vue").PropType<any>;
        };
        status: {
            type: import("vue").PropType<Status>;
            default: Status;
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        title: {
            default: any;
            type: import("vue").PropType<any>;
        };
        subTitle: {
            default: any;
            type: import("vue").PropType<any>;
        };
        onClick: {
            type: import("vue").PropType<MouseEventHandler>;
            default: MouseEventHandler;
        };
    }>>[];
    'onUpdate:current': (current: number) => void;
    progressDot: boolean | ProgressDotRender;
    labelPlacement: "vertical" | "horizontal";
}, {}, string, CustomSlotsType<{
    progressDot: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    Step: import("vue").DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, import("vue").PublicProps>;
    install: (app: App) => App<any>;
};
export default _default;
