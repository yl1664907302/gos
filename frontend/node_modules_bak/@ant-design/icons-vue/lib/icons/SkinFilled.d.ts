import { FunctionalComponent } from 'vue';
import { AntdIconProps } from '../components/AntdIcon';
export interface SkinFilledIconType extends FunctionalComponent<AntdIconProps> {
    displayName: string;
}
declare const SkinFilled: SkinFilledIconType;
export default SkinFilled;
