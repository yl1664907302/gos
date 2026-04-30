import { FunctionalComponent } from 'vue';
import { AntdIconProps } from '../components/AntdIcon';
export interface GoldenFilledIconType extends FunctionalComponent<AntdIconProps> {
    displayName: string;
}
declare const GoldenFilled: GoldenFilledIconType;
export default GoldenFilled;
