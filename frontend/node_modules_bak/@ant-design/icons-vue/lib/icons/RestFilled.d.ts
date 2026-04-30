import { FunctionalComponent } from 'vue';
import { AntdIconProps } from '../components/AntdIcon';
export interface RestFilledIconType extends FunctionalComponent<AntdIconProps> {
    displayName: string;
}
declare const RestFilled: RestFilledIconType;
export default RestFilled;
