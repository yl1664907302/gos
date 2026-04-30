import type { CSSProperties } from 'vue';
import type { VueNode } from '../_util/type';
import type { NotificationInstance as VCNotificationInstance } from '../vc-notification/Notification';
import useNotification from './useNotification';
export type NotificationPlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
export type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ConfigProps {
    top?: string | number;
    bottom?: string | number;
    duration?: number;
    prefixCls?: string;
    placement?: NotificationPlacement;
    getContainer?: () => HTMLElement;
    closeIcon?: VueNode | (() => VueNode);
    rtl?: boolean;
    maxCount?: number;
}
export interface NotificationArgsProps {
    message: VueNode | (() => VueNode);
    description?: VueNode | (() => VueNode);
    btn?: VueNode | (() => VueNode);
    key?: string;
    onClose?: () => void;
    duration?: number | null;
    icon?: VueNode | (() => VueNode);
    placement?: NotificationPlacement;
    maxCount?: number;
    style?: CSSProperties;
    prefixCls?: string;
    class?: string;
    readonly type?: IconType;
    onClick?: () => void;
    top?: string | number;
    bottom?: string | number;
    getContainer?: () => HTMLElement;
    closeIcon?: VueNode | (() => VueNode);
    appContext?: any;
}
export interface NotificationInstance {
    success(args: NotificationArgsProps): void;
    error(args: NotificationArgsProps): void;
    info(args: NotificationArgsProps): void;
    warning(args: NotificationArgsProps): void;
    open(args: NotificationArgsProps): void;
}
export interface NotificationApi extends NotificationInstance {
    warn(args: NotificationArgsProps): void;
    close(key: string): void;
    config(options: ConfigProps): void;
    destroy(): void;
    useNotification: typeof useNotification;
}
/** @private test Only function. Not work on production */
export declare const getInstance: (cacheKey: string) => Promise<VCNotificationInstance>;
declare const _default: NotificationApi;
export default _default;
