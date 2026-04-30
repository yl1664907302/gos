import type { TourProps } from './interface';
import type { Ref } from 'vue';
interface Props {
    defaultType?: Ref<string>;
    steps?: Ref<TourProps['steps']>;
    current?: Ref<number>;
    defaultCurrent?: Ref<number>;
}
/**
 * returns the merged type of a step or the default type.
 */
declare const useMergedType: ({ defaultType, steps, current, defaultCurrent }: Props) => {
    currentMergedType: import("vue").ComputedRef<string>;
    updateInnerCurrent: (val: number) => void;
};
export default useMergedType;
