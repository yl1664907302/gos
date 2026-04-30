import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { VueNode } from '../_util/type';
export declare const tourProps: () => {
    steps: {
        type: PropType<Partial<ExtractPropTypes<{
            cover: {
                type: PropType<VueNode>;
            };
            nextButtonProps: {
                type: PropType<TourBtnProps>;
            };
            prevButtonProps: {
                type: PropType<TourBtnProps>;
            };
            current: {
                type: NumberConstructor;
            };
            type: {
                type: PropType<"default" | "primary">;
            };
            prefixCls: {
                type: StringConstructor;
            };
            total: {
                type: NumberConstructor;
            };
            onClose: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: PropType<boolean | {
                    style?: CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: PropType<boolean | ScrollIntoViewOptions>;
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
        type: PropType<"default" | "primary">;
    };
    'onUpdate:current': PropType<(val: number) => void>;
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
        type: PropType<(current: number) => void>;
        default: (current: number) => void;
    };
    onClose: {
        type: PropType<(current: number) => void>;
        default: (current: number) => void;
    };
    onFinish: {
        type: PropType<() => void>;
        default: () => void;
    };
    mask: {
        type: PropType<boolean | {
            style?: CSSProperties;
            color?: string;
        }>;
        default: boolean | {
            style?: CSSProperties;
            color?: string;
        };
    };
    arrow: {
        type: PropType<boolean | {
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
        type: PropType<import("../vc-tour/placements").PlacementType>;
        default: import("../vc-tour/placements").PlacementType;
    };
    renderPanel: {
        type: PropType<(props: Partial<ExtractPropTypes<{
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
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: PropType<boolean | {
                    style?: CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>, current: number) => VueNode>;
        default: (props: Partial<ExtractPropTypes<{
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
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onFinish: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            renderPanel: {
                type: PropType<(step: any, current: number) => VueNode>;
                default: (step: any, current: number) => VueNode;
            };
            onPrev: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            onNext: {
                type: PropType<(e: MouseEvent) => void>;
                default: (e: MouseEvent) => void;
            };
            arrow: {
                type: PropType<boolean | {
                    pointAtCenter: boolean;
                }>;
                default: boolean | {
                    pointAtCenter: boolean;
                };
            };
            target: {
                type: PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
                default: HTMLElement | (() => HTMLElement) | (() => null);
            };
            title: {
                type: PropType<VueNode>;
                default: VueNode;
            };
            description: {
                type: PropType<VueNode>;
                default: VueNode;
            };
            placement: {
                type: PropType<import("../vc-tour/placements").PlacementType>;
                default: import("../vc-tour/placements").PlacementType;
            };
            mask: {
                type: PropType<boolean | {
                    style?: CSSProperties;
                    color?: string;
                }>;
                default: boolean | {
                    style?: CSSProperties;
                    color?: string;
                };
            };
            className: {
                type: StringConstructor;
            };
            style: {
                type: PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>, current: number) => VueNode;
    };
    gap: {
        type: PropType<import("../vc-tour/hooks/useTarget").Gap>;
        default: import("../vc-tour/hooks/useTarget").Gap;
    };
    animated: {
        type: PropType<boolean | {
            placeholder: boolean;
        }>;
        default: boolean | {
            placeholder: boolean;
        };
    };
    scrollIntoViewOptions: {
        type: PropType<boolean | ScrollIntoViewOptions>;
        default: boolean | ScrollIntoViewOptions;
    };
    zIndex: {
        type: NumberConstructor;
        default: number;
    };
};
export type TourProps = Partial<ExtractPropTypes<ReturnType<typeof tourProps>>>;
export interface TourBtnProps {
    children?: () => VueNode;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
}
export declare const tourStepProps: () => {
    cover: {
        type: PropType<VueNode>;
    };
    nextButtonProps: {
        type: PropType<TourBtnProps>;
    };
    prevButtonProps: {
        type: PropType<TourBtnProps>;
    };
    current: {
        type: NumberConstructor;
    };
    type: {
        type: PropType<"default" | "primary">;
    };
    prefixCls: {
        type: StringConstructor;
    };
    total: {
        type: NumberConstructor;
    };
    onClose: {
        type: PropType<(e: MouseEvent) => void>;
        default: (e: MouseEvent) => void;
    };
    onFinish: {
        type: PropType<(e: MouseEvent) => void>;
        default: (e: MouseEvent) => void;
    };
    renderPanel: {
        type: PropType<(step: any, current: number) => VueNode>;
        default: (step: any, current: number) => VueNode;
    };
    onPrev: {
        type: PropType<(e: MouseEvent) => void>;
        default: (e: MouseEvent) => void;
    };
    onNext: {
        type: PropType<(e: MouseEvent) => void>;
        default: (e: MouseEvent) => void;
    };
    arrow: {
        type: PropType<boolean | {
            pointAtCenter: boolean;
        }>;
        default: boolean | {
            pointAtCenter: boolean;
        };
    };
    target: {
        type: PropType<HTMLElement | (() => HTMLElement) | (() => null)>;
        default: HTMLElement | (() => HTMLElement) | (() => null);
    };
    title: {
        type: PropType<VueNode>;
        default: VueNode;
    };
    description: {
        type: PropType<VueNode>;
        default: VueNode;
    };
    placement: {
        type: PropType<import("../vc-tour/placements").PlacementType>;
        default: import("../vc-tour/placements").PlacementType;
    };
    mask: {
        type: PropType<boolean | {
            style?: CSSProperties;
            color?: string;
        }>;
        default: boolean | {
            style?: CSSProperties;
            color?: string;
        };
    };
    className: {
        type: StringConstructor;
    };
    style: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    scrollIntoViewOptions: {
        type: PropType<boolean | ScrollIntoViewOptions>;
        default: boolean | ScrollIntoViewOptions;
    };
};
export type TourStepProps = Partial<ExtractPropTypes<ReturnType<typeof tourStepProps>>>;
export interface TourLocale {
    Next: string;
    Previous: string;
    Finish: string;
}
