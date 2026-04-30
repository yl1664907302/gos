import type { VNode, PropType } from 'vue';
import type { ModalLocale } from '../modal/locale';
import type { ValidateMessages } from '../form/interface';
import type { TransferLocale } from '../transfer';
import type { PickerLocale as DatePickerLocale } from '../date-picker/generatePicker';
import type { PaginationLocale } from '../pagination/Pagination';
import type { TableLocale } from '../table/interface';
import type { UploadLocale } from '../upload/interface';
import type { TourLocale } from '../tour/interface';
interface TransferLocaleForEmpty {
    description: string;
}
export interface Locale {
    locale: string;
    Pagination?: PaginationLocale;
    Table?: TableLocale;
    Popconfirm?: Record<string, any>;
    Form?: {
        optional?: string;
        defaultValidateMessages: ValidateMessages;
    };
    Image?: {
        preview: string;
    };
    DatePicker?: DatePickerLocale;
    TimePicker?: Record<string, any>;
    Calendar?: Record<string, any>;
    Modal?: ModalLocale;
    Transfer?: Partial<TransferLocale>;
    Select?: Record<string, any>;
    Upload?: UploadLocale;
    Empty?: TransferLocaleForEmpty;
    global?: Record<string, any>;
    PageHeader?: {
        back: string;
    };
    Icon?: Record<string, any>;
    Text?: {
        edit?: any;
        copy?: any;
        copied?: any;
        expand?: any;
    };
    Tour?: TourLocale;
    QRCode?: {
        expired?: string;
        refresh?: string;
        scanned?: string;
    };
}
export interface LocaleProviderProps {
    locale: Locale;
    children?: VNode | VNode[];
    ANT_MARK__?: string;
}
export declare const ANT_MARK = "internalMark";
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        locale: {
            type: PropType<Locale>;
        };
        ANT_MARK__: StringConstructor;
    }>> & Readonly<{}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        locale: {
            type: PropType<Locale>;
        };
        ANT_MARK__: StringConstructor;
    }>> & Readonly<{}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    locale: {
        type: PropType<Locale>;
    };
    ANT_MARK__: StringConstructor;
}>> & Readonly<{}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
