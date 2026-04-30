import type { CalendarMode, SelectInfo } from './generateCalendar';
import type { Locale } from '../vc-picker/interface';
import type { GenerateConfig } from '../vc-picker/generate';
export interface CalendarHeaderProps<DateType> {
    prefixCls: string;
    value: DateType;
    validRange?: [DateType, DateType];
    generateConfig: GenerateConfig<DateType>;
    locale: Locale;
    mode: CalendarMode;
    fullscreen: boolean;
    onChange: (date: DateType, source: SelectInfo['source']) => void;
    onModeChange: (mode: CalendarMode) => void;
}
declare const _default: import("vue").DefineComponent<CalendarHeaderProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<CalendarHeaderProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
