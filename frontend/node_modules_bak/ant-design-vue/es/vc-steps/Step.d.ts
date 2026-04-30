import type { ExtractPropTypes } from 'vue';
import type { VueNode } from '../_util/type';
import type { StepIconRender, Status } from './interface';
export declare const VcStepProps: () => {
    prefixCls: StringConstructor;
    itemWidth: StringConstructor;
    active: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    iconPrefix: StringConstructor;
    icon: import("vue-types").VueTypeValidableDef<any>;
    adjustMarginRight: StringConstructor;
    stepNumber: NumberConstructor;
    stepIndex: NumberConstructor;
    description: import("vue-types").VueTypeValidableDef<any>;
    title: import("vue-types").VueTypeValidableDef<any>;
    subTitle: import("vue-types").VueTypeValidableDef<any>;
    progressDot: import("vue-types").VueTypeDef<any>;
    tailContent: import("vue-types").VueTypeValidableDef<any>;
    icons: import("vue-types").VueTypeLooseShape<{
        finish: any;
        error: any;
    }>;
    onClick: {
        type: import("vue").PropType<() => {}>;
        default: () => {};
    };
    onStepClick: {
        type: import("vue").PropType<(next: number) => void>;
        default: (next: number) => void;
    };
    stepIcon: {
        type: import("vue").PropType<StepIconRender>;
        default: StepIconRender;
    };
    itemRender: {
        type: import("vue").PropType<(stepItem: VueNode) => VueNode>;
        default: (stepItem: VueNode) => VueNode;
    };
    __legacy: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type VCStepProps = Partial<ExtractPropTypes<ReturnType<typeof VcStepProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    itemWidth: StringConstructor;
    active: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    iconPrefix: StringConstructor;
    icon: import("vue-types").VueTypeValidableDef<any>;
    adjustMarginRight: StringConstructor;
    stepNumber: NumberConstructor;
    stepIndex: NumberConstructor;
    description: import("vue-types").VueTypeValidableDef<any>;
    title: import("vue-types").VueTypeValidableDef<any>;
    subTitle: import("vue-types").VueTypeValidableDef<any>;
    progressDot: import("vue-types").VueTypeDef<any>;
    tailContent: import("vue-types").VueTypeValidableDef<any>;
    icons: import("vue-types").VueTypeLooseShape<{
        finish: any;
        error: any;
    }>;
    onClick: {
        type: import("vue").PropType<() => {}>;
        default: () => {};
    };
    onStepClick: {
        type: import("vue").PropType<(next: number) => void>;
        default: (next: number) => void;
    };
    stepIcon: {
        type: import("vue").PropType<StepIconRender>;
        default: StepIconRender;
    };
    itemRender: {
        type: import("vue").PropType<(stepItem: VueNode) => VueNode>;
        default: (stepItem: VueNode) => VueNode;
    };
    __legacy: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    itemWidth: StringConstructor;
    active: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    status: {
        type: import("vue").PropType<Status>;
        default: Status;
    };
    iconPrefix: StringConstructor;
    icon: import("vue-types").VueTypeValidableDef<any>;
    adjustMarginRight: StringConstructor;
    stepNumber: NumberConstructor;
    stepIndex: NumberConstructor;
    description: import("vue-types").VueTypeValidableDef<any>;
    title: import("vue-types").VueTypeValidableDef<any>;
    subTitle: import("vue-types").VueTypeValidableDef<any>;
    progressDot: import("vue-types").VueTypeDef<any>;
    tailContent: import("vue-types").VueTypeValidableDef<any>;
    icons: import("vue-types").VueTypeLooseShape<{
        finish: any;
        error: any;
    }>;
    onClick: {
        type: import("vue").PropType<() => {}>;
        default: () => {};
    };
    onStepClick: {
        type: import("vue").PropType<(next: number) => void>;
        default: (next: number) => void;
    };
    stepIcon: {
        type: import("vue").PropType<StepIconRender>;
        default: StepIconRender;
    };
    itemRender: {
        type: import("vue").PropType<(stepItem: VueNode) => VueNode>;
        default: (stepItem: VueNode) => VueNode;
    };
    __legacy: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    onClick: () => {};
    active: boolean;
    disabled: boolean;
    status: Status;
    itemRender: (stepItem: VueNode) => VueNode;
    onStepClick: (next: number) => void;
    stepIcon: StepIconRender;
    __legacy: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
