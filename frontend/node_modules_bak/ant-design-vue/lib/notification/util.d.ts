import type { CSSProperties } from 'vue';
import type { NotificationPlacement } from './interface';
import type { CSSMotionProps } from '../_util/transition';
export declare function getPlacementStyle(placement: NotificationPlacement, top: number | string, bottom: number | string): CSSProperties;
export declare function getMotion(prefixCls: string): CSSMotionProps;
