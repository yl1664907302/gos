import type { PropType, ExtractPropTypes } from 'vue';
export type StrokeColorType = string | string[] | object;
export type GapPositionType = 'top' | 'right' | 'bottom' | 'left';
export type StrokeLinecapType = 'round' | 'butt' | 'square';
export declare const propTypes: {
    gapDegree: NumberConstructor;
    gapPosition: {
        type: PropType<GapPositionType>;
    };
    percent: {
        type: PropType<number | number[]>;
    };
    prefixCls: StringConstructor;
    strokeColor: {
        type: PropType<StrokeColorType>;
    };
    strokeLinecap: {
        type: PropType<StrokeLinecapType>;
    };
    strokeWidth: NumberConstructor;
    trailColor: StringConstructor;
    trailWidth: NumberConstructor;
    transition: StringConstructor;
};
export type ProgressProps = Partial<ExtractPropTypes<typeof propTypes>>;
