import type { VNode } from 'vue';
import type { NotificationInstance, NotificationConfig } from './interface';
type HolderProps = NotificationConfig & {
    onAllRemoved?: VoidFunction;
    getPopupContainer?: () => HTMLElement;
};
export declare function useInternalNotification(notificationConfig?: HolderProps): readonly [NotificationInstance, () => VNode];
export default function useNotification(notificationConfig?: NotificationConfig): readonly [NotificationInstance, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>];
export {};
