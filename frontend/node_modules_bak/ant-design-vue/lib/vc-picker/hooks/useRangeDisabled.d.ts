import type { RangeValue, PickerMode, Locale } from '../interface';
import type { GenerateConfig } from '../generate';
import type { ComputedRef, Ref } from 'vue';
export default function useRangeDisabled<DateType>({ picker, locale, selectedValue, disabledDate, disabled, generateConfig, }: {
    picker: Ref<PickerMode>;
    selectedValue: Ref<RangeValue<DateType>>;
    disabledDate?: Ref<(date: DateType) => boolean>;
    disabled: ComputedRef<[boolean, boolean]>;
    locale: Ref<Locale>;
    generateConfig: Ref<GenerateConfig<DateType>>;
}, openRecordsRef: Ref<{
    [x: number]: boolean;
}>): ((date: DateType) => boolean)[];
