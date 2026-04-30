import type { AnimationType, TransitionNameType } from '../interface';
interface GetMotionProps {
    animation: AnimationType;
    transitionName: TransitionNameType;
    prefixCls: string;
}
export declare function getMotion({ prefixCls, animation, transitionName }: GetMotionProps): {
    name: string;
} | {
    name?: undefined;
};
export {};
