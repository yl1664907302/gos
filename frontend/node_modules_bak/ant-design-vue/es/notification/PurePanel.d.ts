import type { IconType } from './interface';
import type { NoticeProps } from '../vc-notification/Notice';
import type { VueNode } from '../_util/type';
export declare function getCloseIcon(prefixCls: string, closeIcon?: VueNode): string | number | true | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | (string | number | boolean | void | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>)[];
export interface PureContentProps {
    prefixCls: string;
    icon?: VueNode;
    message?: VueNode;
    description?: VueNode;
    btn?: VueNode;
    type?: IconType;
}
export declare const TypeIcon: {
    info: import("vue/jsx-runtime").JSX.Element;
    success: import("vue/jsx-runtime").JSX.Element;
    error: import("vue/jsx-runtime").JSX.Element;
    warning: import("vue/jsx-runtime").JSX.Element;
    loading: import("vue/jsx-runtime").JSX.Element;
};
export declare function PureContent({ prefixCls, icon, type, message, description, btn, }: PureContentProps): import("vue/jsx-runtime").JSX.Element;
export interface PurePanelProps extends Omit<NoticeProps, 'prefixCls' | 'eventKey'>, Omit<PureContentProps, 'prefixCls'> {
    prefixCls?: string;
}
/** @private Internal Component. Do not use in your production. */
declare const _default: import("vue").DefineComponent<PurePanelProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PurePanelProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
