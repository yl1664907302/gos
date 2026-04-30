import type { FunctionalComponent } from 'vue';
import type { FormatConfig, valueType } from './utils';
interface NumberProps extends FormatConfig {
    value: valueType;
}
declare const StatisticNumber: FunctionalComponent<NumberProps>;
export default StatisticNumber;
