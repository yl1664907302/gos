import type { BaseTransitionProps, CSSProperties, Ref, TransitionGroupProps, TransitionProps } from 'vue';
declare const SelectPlacements: ["bottomLeft", "bottomRight", "topLeft", "topRight"];
export type SelectCommonPlacement = (typeof SelectPlacements)[number];
declare const getTransitionDirection: (placement: SelectCommonPlacement | undefined) => "slide-up" | "slide-down";
export declare const getTransitionProps: (transitionName: string, opt?: TransitionProps) => TransitionProps;
export declare const getTransitionGroupProps: (transitionName: string, opt?: TransitionProps) => TransitionGroupProps;
export declare type MotionEvent = (TransitionEvent | AnimationEvent) & {
    deadline?: boolean;
};
export declare type MotionEventHandler = (element: Element, done?: () => void) => CSSProperties;
export declare type MotionEndEventHandler = (element: Element, done?: () => void) => boolean | void;
export interface CSSMotionProps extends Partial<BaseTransitionProps<Element>> {
    name?: string;
    css?: boolean;
}
declare const collapseMotion: (name: string, style: Ref<CSSProperties>, className: Ref<string>) => CSSMotionProps;
declare const getTransitionName: (rootPrefixCls: string, motion: string, transitionName?: string) => string;
export { collapseMotion, getTransitionName, getTransitionDirection };
