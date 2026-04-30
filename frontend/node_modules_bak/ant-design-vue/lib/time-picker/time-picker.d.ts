import type { ExtractPropTypes } from 'vue';
import type { RangePickerTimeProps } from '../date-picker/generatePicker';
import type { CommonProps, DatePickerProps } from '../date-picker/generatePicker/props';
import type { GenerateConfig } from '../vc-picker/generate';
import type { PanelMode, RangeValue } from '../vc-picker/interface';
export interface TimePickerLocale {
    placeholder?: string;
    rangePlaceholder?: [string, string];
}
export declare const timePickerProps: () => {
    format: StringConstructor;
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    showHour: {
        type: BooleanConstructor;
        default: boolean;
    };
    showMinute: {
        type: BooleanConstructor;
        default: boolean;
    };
    showSecond: {
        type: BooleanConstructor;
        default: boolean;
    };
    use12Hours: {
        type: BooleanConstructor;
        default: boolean;
    };
    hourStep: NumberConstructor;
    minuteStep: NumberConstructor;
    secondStep: NumberConstructor;
    hideDisabledOptions: {
        type: BooleanConstructor;
        default: boolean;
    };
    popupClassName: StringConstructor;
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
};
type CommonTimePickerProps = Partial<ExtractPropTypes<ReturnType<typeof timePickerProps>>>;
export type TimeRangePickerProps<DateType> = Omit<RangePickerTimeProps<DateType>, 'picker' | 'defaultPickerValue' | 'defaultValue' | 'value' | 'onChange' | 'onPanelChange' | 'onOk'> & {
    popupClassName?: string;
    valueFormat?: string;
    defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
    defaultValue?: RangeValue<DateType> | RangeValue<string>;
    value?: RangeValue<DateType> | RangeValue<string>;
    onChange?: (value: RangeValue<DateType> | RangeValue<string> | null, dateString: [string, string]) => void;
    'onUpdate:value'?: (value: RangeValue<DateType> | RangeValue<string> | null) => void;
    onPanelChange?: (values: RangeValue<DateType> | RangeValue<string>, modes: [PanelMode, PanelMode]) => void;
    onOk?: (dates: RangeValue<DateType> | RangeValue<string>) => void;
};
export type TimePickerProps<DateType> = CommonProps<DateType> & DatePickerProps<DateType> & CommonTimePickerProps & {
    addon?: () => void;
};
declare function createTimePicker<DateType, DTimePickerProps extends TimePickerProps<DateType> = TimePickerProps<DateType>, DTimeRangePickerProps extends TimeRangePickerProps<DateType> = TimeRangePickerProps<DateType>>(generateConfig: GenerateConfig<DateType>): {
    TimePicker: import("vue").DefineComponent<import("@vue/shared").IfAny<DTimePickerProps, false, DTimePickerProps extends object ? keyof DTimePickerProps extends string ? true : false : false> extends true ? DTimePickerProps : {}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("@vue/shared").IfAny<DTimePickerProps, false, DTimePickerProps extends object ? keyof DTimePickerProps extends string ? true : false : false> extends true ? DTimePickerProps : {}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, unknown extends DTimePickerProps ? true : false, {}, any>;
    TimeRangePicker: import("vue").DefineComponent<import("@vue/shared").IfAny<DTimeRangePickerProps, false, DTimeRangePickerProps extends object ? keyof DTimeRangePickerProps extends string ? true : false : false> extends true ? DTimeRangePickerProps : {}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("@vue/shared").IfAny<DTimeRangePickerProps, false, DTimeRangePickerProps extends object ? keyof DTimeRangePickerProps extends string ? true : false : false> extends true ? DTimeRangePickerProps : {}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, unknown extends DTimeRangePickerProps ? true : false, {}, any>;
};
export default createTimePicker;
