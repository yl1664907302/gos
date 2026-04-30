import type { RangeValue, PickerMode } from '../interface';
import type { GenerateConfig } from '../generate';
import type { Ref } from 'vue';
export default function useRangeViewDates<DateType>({ values, picker, defaultDates, generateConfig, }: {
    values: Ref<RangeValue<DateType>>;
    picker: Ref<PickerMode>;
    defaultDates: RangeValue<DateType> | undefined;
    generateConfig: Ref<GenerateConfig<DateType>>;
}): [Ref<DateType>, Ref<DateType>, (viewDate: DateType | null, index: 0 | 1) => void];
