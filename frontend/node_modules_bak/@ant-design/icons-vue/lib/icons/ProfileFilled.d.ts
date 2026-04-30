import { FunctionalComponent } from 'vue';
import { AntdIconProps } from '../components/AntdIcon';
export interface ProfileFilledIconType extends FunctionalComponent<AntdIconProps> {
    displayName: string;
}
declare const ProfileFilled: ProfileFilledIconType;
export default ProfileFilled;
