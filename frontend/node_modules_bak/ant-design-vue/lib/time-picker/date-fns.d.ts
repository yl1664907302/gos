import type { App } from 'vue';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';
declare const TimePicker: import("vue").DefineComponent<import("./time-picker").TimePickerProps<Date>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("./time-picker").TimePickerProps<Date>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, TimeRangePicker: import("vue").DefineComponent<import("./time-picker").TimeRangePickerProps<Date>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("./time-picker").TimeRangePickerProps<Date>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Date>, 'picker'> {
    popupClassName?: string;
    valueFormat?: string;
}
export interface TimePickerProps extends Omit<PickerTimeProps<Date>, 'picker'> {
    popupClassName?: string;
    valueFormat?: string;
}
export { TimePicker, TimeRangePicker };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("./time-picker").TimePickerProps<Date>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("./time-picker").TimePickerProps<Date>> & Readonly<{}>, {}, {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("./time-picker").TimePickerProps<Date>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    TimePicker: import("vue").DefineComponent<import("./time-picker").TimePickerProps<Date>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("./time-picker").TimePickerProps<Date>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    TimeRangePicker: import("vue").DefineComponent<import("./time-picker").TimeRangePickerProps<Date>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("./time-picker").TimeRangePickerProps<Date>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    install: (app: App) => App<any>;
};
export default _default;
