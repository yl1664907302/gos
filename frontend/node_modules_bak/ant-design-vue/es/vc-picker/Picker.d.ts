/**
 * Removed:
 *  - getCalendarContainer: use `getPopupContainer` instead
 *  - onOk
 *
 * New Feature:
 *  - picker
 *  - allowEmpty
 *  - selectable
 *
 * Tips: Should add faq about `datetime` mode with `defaultValue`
 */
import type { PickerPanelBaseProps, PickerPanelDateProps, PickerPanelTimeProps } from './PickerPanel';
import type { CustomFormat, PanelMode, PickerMode, PresetDate, RangeValue } from './interface';
import type { CSSProperties, HTMLAttributes } from 'vue';
import type { FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
import type { AlignType } from '../vc-align/interface';
import type { SharedTimeProps } from './panels/TimePanel';
export type PickerRefConfig = {
    focus: () => void;
    blur: () => void;
};
export type PickerSharedProps<DateType> = {
    dropdownClassName?: string;
    dropdownAlign?: AlignType;
    popupStyle?: CSSProperties;
    transitionName?: string;
    placeholder?: string;
    allowClear?: boolean;
    autofocus?: boolean;
    disabled?: boolean;
    tabindex?: number;
    open?: boolean;
    defaultOpen?: boolean;
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly?: boolean;
    id?: string;
    presets?: PresetDate<DateType>[];
    format?: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    suffixIcon?: VueNode;
    clearIcon?: VueNode;
    prevIcon?: VueNode;
    nextIcon?: VueNode;
    superPrevIcon?: VueNode;
    superNextIcon?: VueNode;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    panelRender?: (originPanel: VueNode) => VueNode;
    inputRender?: (props: HTMLAttributes) => VueNode;
    onChange?: (value: DateType | null, dateString: string) => void;
    onOpenChange?: (open: boolean) => void;
    onPanelChange?: (values: RangeValue<DateType>, modes: [PanelMode, PanelMode]) => void;
    onFocus?: FocusEventHandler;
    onBlur?: FocusEventHandler;
    onMousedown?: MouseEventHandler;
    onMouseup?: MouseEventHandler;
    onMouseenter?: MouseEventHandler;
    onMouseleave?: MouseEventHandler;
    onClick?: MouseEventHandler;
    onContextmenu?: MouseEventHandler;
    onKeydown?: (event: KeyboardEvent, preventDefault: () => void) => void;
    role?: string;
    name?: string;
    autocomplete?: string;
    direction?: 'ltr' | 'rtl';
    showToday?: boolean;
    showTime?: boolean | SharedTimeProps<DateType>;
};
type OmitPanelProps<Props> = Omit<Props, 'onChange' | 'hideHeader' | 'pickerValue' | 'onPickerValueChange'>;
export type PickerBaseProps<DateType> = {} & PickerSharedProps<DateType> & OmitPanelProps<PickerPanelBaseProps<DateType>>;
export type PickerDateProps<DateType> = {} & PickerSharedProps<DateType> & OmitPanelProps<PickerPanelDateProps<DateType>>;
export type PickerTimeProps<DateType> = {
    picker: 'time';
    /**
     * @deprecated Please use `defaultValue` directly instead
     * since `defaultOpenValue` will confuse user of current value status
     */
    defaultOpenValue?: DateType;
} & PickerSharedProps<DateType> & Omit<OmitPanelProps<PickerPanelTimeProps<DateType>>, 'format'>;
export type PickerProps<DateType> = PickerBaseProps<DateType> | PickerDateProps<DateType> | PickerTimeProps<DateType>;
type OmitType<DateType> = Omit<PickerBaseProps<DateType>, 'picker'> & Omit<PickerDateProps<DateType>, 'picker'> & Omit<PickerTimeProps<DateType>, 'picker'>;
type MergedPickerProps<DateType> = {
    picker?: PickerMode;
} & OmitType<DateType>;
declare const _default: import("vue").DefineComponent<MergedPickerProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<MergedPickerProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
