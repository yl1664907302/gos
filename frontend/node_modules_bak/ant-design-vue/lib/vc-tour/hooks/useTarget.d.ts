import type { Ref } from 'vue';
import type { TourStepInfo } from '..';
export interface Gap {
    offset?: number;
    radius?: number;
}
export interface PosInfo {
    left: number;
    top: number;
    height: number;
    width: number;
    radius: number;
}
export default function useTarget(target: Ref<TourStepInfo['target']>, open: Ref<boolean>, gap?: Ref<Gap>, scrollIntoViewOptions?: Ref<boolean | ScrollIntoViewOptions>): [Ref<PosInfo>, Ref<HTMLElement>];
