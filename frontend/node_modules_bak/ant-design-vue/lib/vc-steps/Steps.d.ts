import type { VueNode } from '../_util/type';
import type { Status, StepIconRender } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    type: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    iconPrefix: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    direction: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    labelPlacement: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    size: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    progressDot: import("vue-types").VueTypeDef<any> & {
        default: any;
    };
    initial: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    current: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    items: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    } & {
        default: () => unknown[];
    };
    icons: import("vue-types").VueTypeLooseShape<{
        finish: any;
        error: any;
    }>;
    stepIcon: {
        type: import("vue").PropType<StepIconRender>;
        default: StepIconRender;
    };
    isInline: import("vue-types").VueTypeValidableDef<boolean>;
    itemRender: {
        type: import("vue").PropType<(item: Record<string, any>, stepItem: VueNode) => VueNode>;
        default: (item: Record<string, any>, stepItem: VueNode) => VueNode;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "change"[], "change", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    type: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    iconPrefix: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    direction: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    labelPlacement: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    size: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    progressDot: import("vue-types").VueTypeDef<any> & {
        default: any;
    };
    initial: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    current: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    items: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    } & {
        default: () => unknown[];
    };
    icons: import("vue-types").VueTypeLooseShape<{
        finish: any;
        error: any;
    }>;
    stepIcon: {
        type: import("vue").PropType<StepIconRender>;
        default: StepIconRender;
    };
    isInline: import("vue-types").VueTypeValidableDef<boolean>;
    itemRender: {
        type: import("vue").PropType<(item: Record<string, any>, stepItem: VueNode) => VueNode>;
        default: (item: Record<string, any>, stepItem: VueNode) => VueNode;
    };
}>> & Readonly<{
    onChange?: (...args: any[]) => any;
}>, {
    size: string;
    current: number;
    type: string;
    initial: number;
    direction: string;
    prefixCls: string;
    status: Status;
    items: unknown[];
    itemRender: (item: Record<string, any>, stepItem: VueNode) => VueNode;
    iconPrefix: string;
    progressDot: any;
    stepIcon: StepIconRender;
    labelPlacement: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
