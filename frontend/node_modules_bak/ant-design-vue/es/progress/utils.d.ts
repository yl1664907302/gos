import type { CircleProps } from './Circle';
import type { ProgressProps } from './props';
export declare function validProgress(progress: number | undefined): number;
export declare function getSuccessPercent({ success, successPercent }: ProgressProps): number;
export declare function getPercentage({ percent, success, successPercent }: ProgressProps): number[];
export declare function getStrokeColor({ success, strokeColor, }: Partial<CircleProps>): (string | Record<string, string>)[];
export declare const getSize: (size: ProgressProps['size'], type: ProgressProps['type'] | 'step', extra?: {
    steps?: number;
    strokeWidth?: number;
}) => {
    width: number;
    height: number;
};
