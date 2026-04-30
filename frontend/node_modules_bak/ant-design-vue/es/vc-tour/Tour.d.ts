import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { VueNode } from '../_util/type';
import type { Gap } from './hooks/useTarget';
import type { TourStepProps } from './interface';
import type { PlacementType } from './placements';
export declare const tourProps: () => {
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
    steps: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
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
                type: import("vue").PropType<PlacementType>;
                default: PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>[]>;
        default: Partial<ExtractPropTypes<{
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
                type: import("vue").PropType<PlacementType>;
                default: PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>[];
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultCurrent: {
        type: NumberConstructor;
    };
    current: {
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
            style?: CSSProperties;
            color?: string;
        }>;
        default: boolean | {
            style?: CSSProperties;
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
        type: import("vue").PropType<PlacementType>;
        default: PlacementType;
    };
    prefixCls: {
        type: StringConstructor;
        default: string;
    };
    renderPanel: {
        type: import("vue").PropType<(props: TourStepProps, current: number) => VueNode>;
        default: (props: TourStepProps, current: number) => VueNode;
    };
    gap: {
        type: import("vue").PropType<Gap>;
        default: Gap;
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
};
export type TourProps = Partial<ExtractPropTypes<ReturnType<typeof tourProps>>>;
declare const Tour: import("vue").DefineComponent<ExtractPropTypes<{
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
    steps: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
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
                type: import("vue").PropType<PlacementType>;
                default: PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>[]>;
        default: Partial<ExtractPropTypes<{
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
                type: import("vue").PropType<PlacementType>;
                default: PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>[];
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultCurrent: {
        type: NumberConstructor;
    };
    current: {
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
            style?: CSSProperties;
            color?: string;
        }>;
        default: boolean | {
            style?: CSSProperties;
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
        type: import("vue").PropType<PlacementType>;
        default: PlacementType;
    };
    prefixCls: {
        type: StringConstructor;
        default: string;
    };
    renderPanel: {
        type: import("vue").PropType<(props: TourStepProps, current: number) => VueNode>;
        default: (props: TourStepProps, current: number) => VueNode;
    };
    gap: {
        type: import("vue").PropType<Gap>;
        default: Gap;
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
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
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
    steps: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
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
                type: import("vue").PropType<PlacementType>;
                default: PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>[]>;
        default: Partial<ExtractPropTypes<{
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
                type: import("vue").PropType<PlacementType>;
                default: PlacementType;
            };
            mask: {
                type: import("vue").PropType<boolean | {
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            scrollIntoViewOptions: {
                type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
                default: boolean | ScrollIntoViewOptions;
            };
        }>>[];
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultCurrent: {
        type: NumberConstructor;
    };
    current: {
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
            style?: CSSProperties;
            color?: string;
        }>;
        default: boolean | {
            style?: CSSProperties;
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
        type: import("vue").PropType<PlacementType>;
        default: PlacementType;
    };
    prefixCls: {
        type: StringConstructor;
        default: string;
    };
    renderPanel: {
        type: import("vue").PropType<(props: TourStepProps, current: number) => VueNode>;
        default: (props: TourStepProps, current: number) => VueNode;
    };
    gap: {
        type: import("vue").PropType<Gap>;
        default: Gap;
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
}>> & Readonly<{}>, {
    mask: boolean | {
        style?: CSSProperties;
        color?: string;
    };
    onChange: (current: number) => void;
    open: boolean;
    zIndex: number;
    gap: Gap;
    prefixCls: string;
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
    placement: PlacementType;
    steps: Partial<ExtractPropTypes<{
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
            type: import("vue").PropType<PlacementType>;
            default: PlacementType;
        };
        mask: {
            type: import("vue").PropType<boolean | {
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
            type: import("vue").PropType<CSSProperties>;
            default: CSSProperties;
        };
        scrollIntoViewOptions: {
            type: import("vue").PropType<boolean | ScrollIntoViewOptions>;
            default: boolean | ScrollIntoViewOptions;
        };
    }>>[];
    scrollIntoViewOptions: boolean | ScrollIntoViewOptions;
    onFinish: () => void;
    renderPanel: (props: TourStepProps, current: number) => VueNode;
    animated: boolean | {
        placeholder: boolean;
    };
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Tour;
