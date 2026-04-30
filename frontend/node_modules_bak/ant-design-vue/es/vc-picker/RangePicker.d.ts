import type { DisabledTimes, PanelMode, PickerMode, RangeValue, EventValue, PresetDate } from './interface';
import type { PickerBaseProps, PickerDateProps, PickerTimeProps } from './Picker';
import type { SharedTimeProps } from './panels/TimePanel';
import type { VueNode } from '../_util/type';
import type { FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
export type RangeType = 'start' | 'end';
export type RangeInfo = {
    range: RangeType;
};
export type RangeDateRender<DateType> = (props: {
    current: DateType;
    today: DateType;
    info: RangeInfo;
}) => VueNode;
export type RangePickerSharedProps<DateType> = {
    id?: string;
    value?: RangeValue<DateType>;
    defaultValue?: RangeValue<DateType>;
    defaultPickerValue?: [DateType, DateType];
    placeholder?: [string, string];
    disabled?: boolean | [boolean, boolean];
    disabledTime?: (date: EventValue<DateType>, type: RangeType) => DisabledTimes;
    presets?: PresetDate<RangeValue<DateType>>[];
    /** @deprecated Please use `presets` instead */
    ranges?: Record<string, Exclude<RangeValue<DateType>, null> | (() => Exclude<RangeValue<DateType>, null>)>;
    separator?: VueNode;
    allowEmpty?: [boolean, boolean];
    mode?: [PanelMode, PanelMode];
    onChange?: (values: RangeValue<DateType>, formatString: [string, string]) => void;
    onCalendarChange?: (values: RangeValue<DateType>, formatString: [string, string], info: RangeInfo) => void;
    onPanelChange?: (values: RangeValue<DateType>, modes: [PanelMode, PanelMode]) => void;
    onFocus?: FocusEventHandler;
    onBlur?: FocusEventHandler;
    onMousedown?: MouseEventHandler;
    onMouseup?: MouseEventHandler;
    onMouseenter?: MouseEventHandler;
    onMouseleave?: MouseEventHandler;
    onClick?: MouseEventHandler;
    onOk?: (dates: RangeValue<DateType>) => void;
    direction?: 'ltr' | 'rtl';
    autocomplete?: string;
    /** @private Internal control of active picker. Do not use since it's private usage */
    activePickerIndex?: 0 | 1;
    dateRender?: RangeDateRender<DateType>;
    panelRender?: (originPanel: VueNode) => VueNode;
    prevIcon?: VueNode;
    nextIcon?: VueNode;
    superPrevIcon?: VueNode;
    superNextIcon?: VueNode;
};
type OmitPickerProps<Props> = Omit<Props, 'value' | 'defaultValue' | 'defaultPickerValue' | 'placeholder' | 'disabled' | 'disabledTime' | 'showToday' | 'showTime' | 'mode' | 'onChange' | 'onSelect' | 'onPanelChange' | 'pickerValue' | 'onPickerValueChange' | 'onOk' | 'dateRender' | 'presets'>;
type RangeShowTimeObject<DateType> = Omit<SharedTimeProps<DateType>, 'defaultValue'> & {
    defaultValue?: DateType[];
};
export type RangePickerBaseProps<DateType> = {} & RangePickerSharedProps<DateType> & OmitPickerProps<PickerBaseProps<DateType>>;
export type RangePickerDateProps<DateType> = {
    showTime?: boolean | RangeShowTimeObject<DateType>;
} & RangePickerSharedProps<DateType> & OmitPickerProps<PickerDateProps<DateType>>;
export type RangePickerTimeProps<DateType> = {
    order?: boolean;
} & RangePickerSharedProps<DateType> & OmitPickerProps<PickerTimeProps<DateType>>;
export type RangePickerProps<DateType> = RangePickerBaseProps<DateType> | RangePickerDateProps<DateType> | RangePickerTimeProps<DateType>;
type OmitType<DateType> = Omit<RangePickerBaseProps<DateType>, 'picker'> & Omit<RangePickerDateProps<DateType>, 'picker'> & Omit<RangePickerTimeProps<DateType>, 'picker'>;
type MergedRangePickerProps<DateType> = {
    picker?: PickerMode;
} & OmitType<DateType>;
declare const InterRangerPicker: import("vue").DefineComponent<MergedRangePickerProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<MergedRangePickerProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default InterRangerPicker;
