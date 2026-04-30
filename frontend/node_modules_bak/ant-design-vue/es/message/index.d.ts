import type { CSSProperties } from 'vue';
import type { Key, VueNode } from '../_util/type';
import type { NotificationInstance } from '../vc-notification/Notification';
import useMessage from './useMessage';
export declare function getKeyThenIncreaseKey(): number;
export interface ConfigOptions {
    top?: string;
    duration?: number;
    prefixCls?: string;
    getContainer?: () => HTMLElement;
    transitionName?: string;
    maxCount?: number;
    rtl?: boolean;
}
export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';
export interface ThenableArgument {
    (val: any): void;
}
export declare const typeList: NoticeType[];
export interface MessageType extends PromiseLike<any> {
    (): void;
}
export interface MessageArgsProps {
    content: string | (() => VueNode) | VueNode;
    duration?: number;
    type?: NoticeType;
    prefixCls?: string;
    rootPrefixCls?: string;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    onClose?: () => void;
    icon?: (() => VueNode) | VueNode;
    key?: string | number;
    style?: CSSProperties;
    class?: string;
    appContext?: any;
    onClick?: (e: MouseEvent) => void;
}
type ConfigDuration = number;
type JointContent = VueNode | MessageArgsProps;
export type ConfigOnClose = () => void;
export declare function attachTypeApi(originalApi: MessageApi, type: NoticeType): void;
export interface MessageInstance {
    info(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    success(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    error(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    warning(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    loading(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    open(args: MessageArgsProps): MessageType;
    useMessage: typeof useMessage;
}
export interface MessageApi extends MessageInstance {
    warn(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    config(options: ConfigOptions): void;
    destroy(messageKey?: Key): void;
}
/** @private test Only function. Not work on production */
export declare const getInstance: () => NotificationInstance;
declare const _default: MessageApi;
export default _default;
