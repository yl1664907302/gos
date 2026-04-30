import { FunctionalComponent } from 'vue';
import { AntdIconProps } from '../components/AntdIcon';
export interface ForwardFilledIconType extends FunctionalComponent<AntdIconProps> {
    displayName: string;
}
declare const ForwardFilled: ForwardFilledIconType;
export default ForwardFilled;
