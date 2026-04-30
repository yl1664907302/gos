import type { CSSProperties } from 'vue';
import type { OpenConfig, Placement } from './Notification';
import type { CSSMotionProps } from '../_util/transition';
import type { Key, VueNode } from '../_util/type';
type OptionalConfig = Partial<OpenConfig>;
export interface NotificationConfig {
    prefixCls?: string;
    /** Customize container. It will repeat call which means you should return same container element. */
    getContainer?: () => HTMLElement;
    motion?: CSSMotionProps | ((placement?: Placement) => CSSMotionProps);
    closeIcon?: VueNode;
    closable?: boolean;
    maxCount?: number;
    duration?: number;
    /** @private. Config for notification holder style. Safe to remove if refactor */
    getClassName?: (placement?: Placement) => string;
    /** @private. Config for notification holder style. Safe to remove if refactor */
    getStyles?: (placement?: Placement) => CSSProperties;
    /** @private Trigger when all the notification closed. */
    onAllRemoved?: VoidFunction;
    hashId?: string;
}
export interface NotificationAPI {
    open: (config: OptionalConfig) => void;
    close: (key: Key) => void;
    destroy: () => void;
}
export default function useNotification(rootConfig?: NotificationConfig): readonly [{
    open: (config: OpenConfig) => void;
    close: (key: any) => void;
    destroy: () => void;
}, () => import("vue/jsx-runtime").JSX.Element];
export {};
