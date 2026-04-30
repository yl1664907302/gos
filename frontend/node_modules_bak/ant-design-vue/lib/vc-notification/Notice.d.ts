import type { Key } from '../_util/type';
import type { HTMLAttributes } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
interface DivProps extends HTMLAttributes {
    'data-testid'?: string;
}
export interface NoticeProps {
    prefixCls: string;
    duration?: number | null;
    updateMark?: string;
    /** Mark as final key since set maxCount may keep the key but user pass key is different */
    noticeKey: Key;
    closeIcon?: any;
    closable?: boolean;
    props?: DivProps;
    onClick?: MouseEventHandler;
    onClose?: (key: Key) => void;
    /** @private Only for internal usage. We don't promise that we will refactor this */
    holder?: HTMLDivElement;
    /** @private Provided by CSSMotionList */
    visible?: boolean;
}
declare const _default: import("vue").DefineComponent<NoticeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<NoticeProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
