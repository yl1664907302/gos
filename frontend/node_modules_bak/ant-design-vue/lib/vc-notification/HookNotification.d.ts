import type { CSSProperties } from 'vue';
import type { NoticeProps } from './Notice';
import type { CSSMotionProps } from '../_util/transition';
import type { Key, VueNode } from '../_util/type';
export declare function getUuid(): string;
export type Placement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
export interface OpenConfig extends NoticeProps {
    key: Key;
    placement?: Placement;
    content?: VueNode;
    duration?: number | null;
}
export type Placements = Partial<Record<Placement, OpenConfig[]>>;
export interface NoticeContent extends Omit<NoticeProps, 'prefixCls' | 'noticeKey' | 'onClose'> {
    prefixCls?: string;
    key?: Key;
    updateMark?: string;
    content?: any;
    onClose?: () => void;
    style?: CSSProperties;
    class?: String;
    placement?: Placement;
}
export type NoticeFunc = (noticeProps: NoticeContent) => void;
export type HolderReadyCallback = (div: HTMLDivElement, noticeProps: NoticeProps & {
    key: Key;
}) => void;
export interface NotificationInstance {
    notice: NoticeFunc;
    removeNotice: (key: Key) => void;
    destroy: () => void;
    add: (noticeProps: NoticeContent) => void;
    component: Notification;
}
export interface HookNotificationProps {
    prefixCls?: string;
    transitionName?: string;
    animation?: string | CSSMotionProps | ((placement?: Placement) => CSSMotionProps);
    maxCount?: number;
    closeIcon?: any;
    hashId?: string;
    remove: (key: Key) => void;
    notices: NotificationState;
    getStyles?: (placement?: Placement) => CSSProperties;
    getClassName?: (placement?: Placement) => string;
    onAllRemoved?: VoidFunction;
    getContainer?: () => HTMLElement;
}
type NotificationState = {
    notice: NoticeContent & {
        userPassKey?: Key;
    };
    holderCallback?: HolderReadyCallback;
}[];
declare const Notification: import("vue").DefineComponent<HookNotificationProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<HookNotificationProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default Notification;
