import type { ExtractPropTypes, CSSProperties } from 'vue';
import type { PlacementType } from './placements';
import type { VueNode } from '../_util/type';
export declare const tourStepInfo: () => {
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
};
export type TourStepInfo = Partial<ExtractPropTypes<ReturnType<typeof tourStepInfo>>>;
export declare const tourStepProps: () => {
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
};
export type TourStepProps = Partial<ExtractPropTypes<ReturnType<typeof tourStepProps>>>;
