import type { TourProps, TourStepProps } from './interface';
import type { VueNode } from '../_util/type';
export { TourProps, TourStepProps };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        steps: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                cover: {
                    type: import("vue").PropType<VueNode>;
                };
                nextButtonProps: {
                    type: import("vue").PropType<import("./interface").TourBtnProps>;
                };
                prevButtonProps: {
                    type: import("vue").PropType<import("./interface").TourBtnProps>;
                };
                current: {
                    type: NumberConstructor;
                };
                type: {
                    type: import("vue").PropType<"default" | "primary">;
                };
                prefixCls: {
                    type: StringConstructor;
                };
                total: {
                    type: NumberConstructor;
                };
                onClose: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onFinish: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                renderPanel: {
                    type: import("vue").PropType<(step: any, current: number) => VueNode>;
                    default: (step: any, current: number) => VueNode;
                };
                onPrev: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onNext: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter: boolean;
                    };
                };
                target: {
                    type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                    default: HTMLElement | (() => HTMLElement) | (() => null);
                };
                title: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                description: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                placement: {
                    type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                    default: import("../vc-tour/placements").PlacementType;
                };
                mask: {
                    type: import("vue").PropType<boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    }>;
                    default: boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    };
                };
                className: {
                    type: StringConstructor;
                };
                style: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                scrollIntoViewOptions: {
                    type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                    default: boolean | ScrollIntoViewOptions;
                };
            }>>[]>;
        };
        prefixCls: {
            type: StringConstructor;
        };
        current: {
            type: NumberConstructor;
        };
        type: {
            type: import("vue").PropType<"default" | "primary">;
        };
        'onUpdate:current': import("vue").PropType<(val: number) => void>;
        builtinPlacements: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        };
        popupAlign: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        } & {
            default: () => {
                [key: string]: any;
            };
        };
        open: {
            type: BooleanConstructor;
            default: boolean;
        };
        defaultCurrent: {
            type: NumberConstructor;
        };
        onChange: {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        onClose: {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        onFinish: {
            type: import("vue").PropType<() => void>;
            default: () => void;
        };
        mask: {
            type: import("vue").PropType<boolean | {
                style?: import("vue").CSSProperties;
                color?: string;
            }>;
            default: boolean | {
                style?: import("vue").CSSProperties;
                color?: string;
            };
        };
        arrow: {
            type: import("vue").PropType<boolean | {
                pointAtCenter: boolean;
            }>;
            default: boolean | {
                pointAtCenter: boolean;
            };
        };
        rootClassName: {
            type: StringConstructor;
        };
        placement: {
            type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
            default: import("../vc-tour/placements").PlacementType;
        };
        renderPanel: {
            type: import("vue").PropType<(props: Partial<import("vue").ExtractPropTypes<{
                prefixCls: {
                    type: StringConstructor;
                };
                total: {
                    type: NumberConstructor;
                };
                current: {
                    type: NumberConstructor;
                };
                onClose: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onFinish: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                renderPanel: {
                    type: import("vue").PropType<(step: any, current: number) => VueNode>;
                    default: (step: any, current: number) => VueNode;
                };
                onPrev: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onNext: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter: boolean;
                    };
                };
                target: {
                    type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                    default: HTMLElement | (() => HTMLElement) | (() => null);
                };
                title: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                description: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                placement: {
                    type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                    default: import("../vc-tour/placements").PlacementType;
                };
                mask: {
                    type: import("vue").PropType<boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    }>;
                    default: boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    };
                };
                className: {
                    type: StringConstructor;
                };
                style: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                scrollIntoViewOptions: {
                    type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                    default: boolean | ScrollIntoViewOptions;
                };
            }>>, current: number) => VueNode>;
            default: (props: Partial<import("vue").ExtractPropTypes<{
                prefixCls: {
                    type: StringConstructor;
                };
                total: {
                    type: NumberConstructor;
                };
                current: {
                    type: NumberConstructor;
                };
                onClose: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onFinish: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                renderPanel: {
                    type: import("vue").PropType<(step: any, current: number) => VueNode>;
                    default: (step: any, current: number) => VueNode;
                };
                onPrev: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onNext: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter: boolean;
                    };
                };
                target: {
                    type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                    default: HTMLElement | (() => HTMLElement) | (() => null);
                };
                title: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                description: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                placement: {
                    type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                    default: import("../vc-tour/placements").PlacementType;
                };
                mask: {
                    type: import("vue").PropType<boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    }>;
                    default: boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    };
                };
                className: {
                    type: StringConstructor;
                };
                style: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                scrollIntoViewOptions: {
                    type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                    default: boolean | ScrollIntoViewOptions;
                };
            }>>, current: number) => VueNode;
        };
        gap: {
            type: import("vue").PropType<import("../vc-tour/hooks/useTarget").Gap>;
            default: import("../vc-tour/hooks/useTarget").Gap;
        };
        animated: {
            type: import("vue").PropType<boolean | {
                placeholder: boolean;
            }>;
            default: boolean | {
                placeholder: boolean;
            };
        };
        scrollIntoViewOptions: {
            type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
            default: boolean | ScrollIntoViewOptions;
        };
        zIndex: {
            type: NumberConstructor;
            default: number;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        mask: boolean | {
            style?: import("vue").CSSProperties;
            color?: string;
        };
        onChange: (current: number) => void;
        open: boolean;
        zIndex: number;
        gap: import("../vc-tour/hooks/useTarget").Gap;
        onClose: (current: number) => void;
        arrow: boolean | {
            pointAtCenter: boolean;
        };
        builtinPlacements: {
            [key: string]: any;
        };
        popupAlign: {
            [key: string]: any;
        };
        placement: import("../vc-tour/placements").PlacementType;
        scrollIntoViewOptions: boolean | ScrollIntoViewOptions;
        onFinish: () => void;
        renderPanel: (props: Partial<import("vue").ExtractPropTypes<{
            prefixCls: {
                type: StringConstructor;
            };
            total: {
                type: NumberConstructor;
            };
            current: {
                type: NumberConstructor;
            };
            onClose: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: import("vue").PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>, current: number) => VueNode;
        animated: boolean | {
            placeholder: boolean;
        };
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        steps: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                cover: {
                    type: import("vue").PropType<VueNode>;
                };
                nextButtonProps: {
                    type: import("vue").PropType<import("./interface").TourBtnProps>;
                };
                prevButtonProps: {
                    type: import("vue").PropType<import("./interface").TourBtnProps>;
                };
                current: {
                    type: NumberConstructor;
                };
                type: {
                    type: import("vue").PropType<"default" | "primary">;
                };
                prefixCls: {
                    type: StringConstructor;
                };
                total: {
                    type: NumberConstructor;
                };
                onClose: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onFinish: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                renderPanel: {
                    type: import("vue").PropType<(step: any, current: number) => VueNode>;
                    default: (step: any, current: number) => VueNode;
                };
                onPrev: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onNext: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter: boolean;
                    };
                };
                target: {
                    type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                    default: HTMLElement | (() => HTMLElement) | (() => null);
                };
                title: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                description: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                placement: {
                    type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                    default: import("../vc-tour/placements").PlacementType;
                };
                mask: {
                    type: import("vue").PropType<boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    }>;
                    default: boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    };
                };
                className: {
                    type: StringConstructor;
                };
                style: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                scrollIntoViewOptions: {
                    type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                    default: boolean | ScrollIntoViewOptions;
                };
            }>>[]>;
        };
        prefixCls: {
            type: StringConstructor;
        };
        current: {
            type: NumberConstructor;
        };
        type: {
            type: import("vue").PropType<"default" | "primary">;
        };
        'onUpdate:current': import("vue").PropType<(val: number) => void>;
        builtinPlacements: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        };
        popupAlign: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        } & {
            default: () => {
                [key: string]: any;
            };
        };
        open: {
            type: BooleanConstructor;
            default: boolean;
        };
        defaultCurrent: {
            type: NumberConstructor;
        };
        onChange: {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        onClose: {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        onFinish: {
            type: import("vue").PropType<() => void>;
            default: () => void;
        };
        mask: {
            type: import("vue").PropType<boolean | {
                style?: import("vue").CSSProperties;
                color?: string;
            }>;
            default: boolean | {
                style?: import("vue").CSSProperties;
                color?: string;
            };
        };
        arrow: {
            type: import("vue").PropType<boolean | {
                pointAtCenter: boolean;
            }>;
            default: boolean | {
                pointAtCenter: boolean;
            };
        };
        rootClassName: {
            type: StringConstructor;
        };
        placement: {
            type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
            default: import("../vc-tour/placements").PlacementType;
        };
        renderPanel: {
            type: import("vue").PropType<(props: Partial<import("vue").ExtractPropTypes<{
                prefixCls: {
                    type: StringConstructor;
                };
                total: {
                    type: NumberConstructor;
                };
                current: {
                    type: NumberConstructor;
                };
                onClose: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onFinish: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                renderPanel: {
                    type: import("vue").PropType<(step: any, current: number) => VueNode>;
                    default: (step: any, current: number) => VueNode;
                };
                onPrev: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onNext: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter: boolean;
                    };
                };
                target: {
                    type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                    default: HTMLElement | (() => HTMLElement) | (() => null);
                };
                title: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                description: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                placement: {
                    type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                    default: import("../vc-tour/placements").PlacementType;
                };
                mask: {
                    type: import("vue").PropType<boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    }>;
                    default: boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    };
                };
                className: {
                    type: StringConstructor;
                };
                style: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                scrollIntoViewOptions: {
                    type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                    default: boolean | ScrollIntoViewOptions;
                };
            }>>, current: number) => VueNode>;
            default: (props: Partial<import("vue").ExtractPropTypes<{
                prefixCls: {
                    type: StringConstructor;
                };
                total: {
                    type: NumberConstructor;
                };
                current: {
                    type: NumberConstructor;
                };
                onClose: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onFinish: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                renderPanel: {
                    type: import("vue").PropType<(step: any, current: number) => VueNode>;
                    default: (step: any, current: number) => VueNode;
                };
                onPrev: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                onNext: {
                    type: import("vue").PropType<(e: MouseEvent) => void>;
                    default: (e: MouseEvent) => void;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter: boolean;
                    };
                };
                target: {
                    type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                    default: HTMLElement | (() => HTMLElement) | (() => null);
                };
                title: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                description: {
                    type: import("vue").PropType<VueNode>;
                    default: VueNode;
                };
                placement: {
                    type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                    default: import("../vc-tour/placements").PlacementType;
                };
                mask: {
                    type: import("vue").PropType<boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    }>;
                    default: boolean | {
                        style?: import("vue").CSSProperties;
                        color?: string;
                    };
                };
                className: {
                    type: StringConstructor;
                };
                style: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                scrollIntoViewOptions: {
                    type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                    default: boolean | ScrollIntoViewOptions;
                };
            }>>, current: number) => VueNode;
        };
        gap: {
            type: import("vue").PropType<import("../vc-tour/hooks/useTarget").Gap>;
            default: import("../vc-tour/hooks/useTarget").Gap;
        };
        animated: {
            type: import("vue").PropType<boolean | {
                placeholder: boolean;
            }>;
            default: boolean | {
                placeholder: boolean;
            };
        };
        scrollIntoViewOptions: {
            type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
            default: boolean | ScrollIntoViewOptions;
        };
        zIndex: {
            type: NumberConstructor;
            default: number;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, {
        mask: boolean | {
            style?: import("vue").CSSProperties;
            color?: string;
        };
        onChange: (current: number) => void;
        open: boolean;
        zIndex: number;
        gap: import("../vc-tour/hooks/useTarget").Gap;
        onClose: (current: number) => void;
        arrow: boolean | {
            pointAtCenter: boolean;
        };
        builtinPlacements: {
            [key: string]: any;
        };
        popupAlign: {
            [key: string]: any;
        };
        placement: import("../vc-tour/placements").PlacementType;
        scrollIntoViewOptions: boolean | ScrollIntoViewOptions;
        onFinish: () => void;
        renderPanel: (props: Partial<import("vue").ExtractPropTypes<{
            prefixCls: {
                type: StringConstructor;
            };
            total: {
                type: NumberConstructor;
            };
            current: {
                type: NumberConstructor;
            };
            onClose: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: import("vue").PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>, current: number) => VueNode;
        animated: boolean | {
            placeholder: boolean;
        };
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    steps: {
        type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
            cover: {
                type: import("vue").PropType<VueNode>;
            };
            nextButtonProps: {
                type: import("vue").PropType<import("./interface").TourBtnProps>;
            };
            prevButtonProps: {
                type: import("vue").PropType<import("./interface").TourBtnProps>;
            };
            current: {
                type: NumberConstructor;
            };
            type: {
                type: import("vue").PropType<"default" | "primary">;
            };
            prefixCls: {
                type: StringConstructor;
            };
            total: {
                type: NumberConstructor;
            };
            onClose: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: import("vue").PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>[]>;
    };
    prefixCls: {
        type: StringConstructor;
    };
    current: {
        type: NumberConstructor;
    };
    type: {
        type: import("vue").PropType<"default" | "primary">;
    };
    'onUpdate:current': import("vue").PropType<(val: number) => void>;
    builtinPlacements: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    popupAlign: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    } & {
        default: () => {
            [key: string]: any;
        };
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultCurrent: {
        type: NumberConstructor;
    };
    onChange: {
        type: import("vue").PropType<(current: number) => void>;
        default: (current: number) => void;
    };
    onClose: {
        type: import("vue").PropType<(current: number) => void>;
        default: (current: number) => void;
    };
    onFinish: {
        type: import("vue").PropType<() => void>;
        default: () => void;
    };
    mask: {
        type: import("vue").PropType<boolean | {
            style?: import("vue").CSSProperties;
            color?: string;
        }>;
        default: boolean | {
            style?: import("vue").CSSProperties;
            color?: string;
        };
    };
    arrow: {
        type: import("vue").PropType<boolean | {
            pointAtCenter: boolean;
        }>;
        default: boolean | {
            pointAtCenter: boolean;
        };
    };
    rootClassName: {
        type: StringConstructor;
    };
    placement: {
        type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
        default: import("../vc-tour/placements").PlacementType;
    };
    renderPanel: {
        type: import("vue").PropType<(props: Partial<import("vue").ExtractPropTypes<{
            prefixCls: {
                type: StringConstructor;
            };
            total: {
                type: NumberConstructor;
            };
            current: {
                type: NumberConstructor;
            };
            onClose: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: import("vue").PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>, current: number) => VueNode>;
        default: (props: Partial<import("vue").ExtractPropTypes<{
            prefixCls: {
                type: StringConstructor;
            };
            total: {
                type: NumberConstructor;
            };
            current: {
                type: NumberConstructor;
            };
            onClose: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: import("vue").PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: import("vue").PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: import("vue").PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: import("vue").CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>, current: number) => VueNode;
    };
    gap: {
        type: import("vue").PropType<import("../vc-tour/hooks/useTarget").Gap>;
        default: import("../vc-tour/hooks/useTarget").Gap;
    };
    animated: {
        type: import("vue").PropType<boolean | {
            placeholder: boolean;
        }>;
        default: boolean | {
            placeholder: boolean;
        };
    };
    scrollIntoViewOptions: {
        type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
        default: boolean | ScrollIntoViewOptions;
    };
    zIndex: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    mask: boolean | {
        style?: import("vue").CSSProperties;
        color?: string;
    };
    onChange: (current: number) => void;
    open: boolean;
    zIndex: number;
    gap: import("../vc-tour/hooks/useTarget").Gap;
    onClose: (current: number) => void;
    arrow: boolean | {
        pointAtCenter: boolean;
    };
    builtinPlacements: {
        [key: string]: any;
    };
    popupAlign: {
        [key: string]: any;
    };
    placement: import("../vc-tour/placements").PlacementType;
    scrollIntoViewOptions: boolean | ScrollIntoViewOptions;
    onFinish: () => void;
    renderPanel: (props: Partial<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
        };
        total: {
            type: NumberConstructor;
        };
        current: {
            type: NumberConstructor;
        };
        onClose: {
            type: import("vue").PropType<(e: MouseEvent) => void>;
            default: (e: MouseEvent) => void;
        };
        onFinish: {
            type: import("vue").PropType<(e: MouseEvent) => void>;
            default: (e: MouseEvent) => void;
        };
        renderPanel: {
            type: import("vue").PropType<(step: any, current: number) => VueNode>;
            default: (step: any, current: number) => VueNode;
        };
        onPrev: {
            type: import("vue").PropType<(e: MouseEvent) => void>;
            default: (e: MouseEvent) => void;
        };
        onNext: {
            type: import("vue").PropType<(e: MouseEvent) => void>;
            default: (e: MouseEvent) => void;
        };
        arrow: {
            type: import("vue").PropType<boolean | {
                pointAtCenter: boolean;
            }>;
            default: boolean | {
                pointAtCenter: boolean;
            };
        };
        target: {
            type: import("vue").PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
            default: HTMLElement | (() => HTMLElement) | (() => null);
        };
        title: {
            type: import("vue").PropType<VueNode>;
            default: VueNode;
        };
        description: {
            type: import("vue").PropType<VueNode>;
            default: VueNode;
        };
        placement: {
            type: import("vue").PropType<import("../vc-tour/placements").PlacementType>;
            default: import("../vc-tour/placements").PlacementType;
        };
        mask: {
            type: import("vue").PropType<boolean | {
                style?: import("vue").CSSProperties;
                color?: string;
            }>;
            default: boolean | {
                style?: import("vue").CSSProperties;
                color?: string;
            };
        };
        className: {
            type: StringConstructor;
        };
        style: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        scrollIntoViewOptions: {
            type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
            default: boolean | ScrollIntoViewOptions;
        };
    }>>, current: number) => VueNode;
    animated: boolean | {
        placeholder: boolean;
    };
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
