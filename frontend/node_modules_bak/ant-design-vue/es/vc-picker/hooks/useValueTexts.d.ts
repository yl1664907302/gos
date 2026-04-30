import type { ComputedRef, Ref } from 'vue';
import type { GenerateConfig } from '../generate';
import type { CustomFormat, Locale } from '../interface';
export type ValueTextConfig<DateType> = {
    formatList: ComputedRef<(string | CustomFormat<DateType>)[]>;
    generateConfig: Ref<GenerateConfig<DateType>>;
    locale: Ref<Locale>;
};
export default function useValueTexts<DateType>(value: Ref<DateType | null>, { formatList, generateConfig, locale }: ValueTextConfig<DateType>): [ComputedRef<string[]>, ComputedRef<string>];
