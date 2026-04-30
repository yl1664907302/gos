declare const TourStep: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<(step: any, current: number) => import("../../_util/type").VueNode>;
        default: (step: any, current: number) => import("../../_util/type").VueNode;
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
        type: import("vue").PropType<import("../../_util/type").VueNode>;
        default: import("../../_util/type").VueNode;
    };
    description: {
        type: import("vue").PropType<import("../../_util/type").VueNode>;
        default: import("../../_util/type").VueNode;
    };
    placement: {
        type: import("vue").PropType<import("../placements").PlacementType>;
        default: import("../placements").PlacementType;
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
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<(step: any, current: number) => import("../../_util/type").VueNode>;
        default: (step: any, current: number) => import("../../_util/type").VueNode;
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
        type: import("vue").PropType<import("../../_util/type").VueNode>;
        default: import("../../_util/type").VueNode;
    };
    description: {
        type: import("vue").PropType<import("../../_util/type").VueNode>;
        default: import("../../_util/type").VueNode;
    };
    placement: {
        type: import("vue").PropType<import("../placements").PlacementType>;
        default: import("../placements").PlacementType;
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
}>> & Readonly<{}>, {
    style: import("vue").CSSProperties;
    title: import("../../_util/type").VueNode;
    mask: boolean | {
        style?: import("vue").CSSProperties;
        color?: string;
    };
    description: import("../../_util/type").VueNode;
    onClose: (e: MouseEvent) => void;
    onPrev: (e: MouseEvent) => void;
    onNext: (e: MouseEvent) => void;
    target: HTMLElement | (() => HTMLElement) | (() => null);
    arrow: boolean | {
        pointAtCenter: boolean;
    };
    placement: import("../placements").PlacementType;
    scrollIntoViewOptions: boolean | ScrollIntoViewOptions;
    onFinish: (e: MouseEvent) => void;
    renderPanel: (step: any, current: number) => import("../../_util/type").VueNode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default TourStep;
