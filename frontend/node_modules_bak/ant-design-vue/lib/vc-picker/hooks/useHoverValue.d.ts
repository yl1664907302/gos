import type { ComputedRef, Ref } from 'vue';
import type { ValueTextConfig } from './useValueTexts';
export default function useHoverValue<DateType>(valueText: Ref<string>, { formatList, generateConfig, locale }: ValueTextConfig<DateType>): [ComputedRef<string>, (date: DateType) => void, (immediately?: boolean) => void];
