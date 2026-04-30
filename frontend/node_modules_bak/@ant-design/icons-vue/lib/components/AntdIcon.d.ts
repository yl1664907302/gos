import { IconBaseProps } from './Icon';
import { IconDefinition } from '@ant-design/icons-svg/lib/types';
import { TwoToneColor } from './twoTonePrimaryColor';
import { FunctionalComponent } from 'vue';
export interface AntdIconProps extends IconBaseProps {
    twoToneColor?: TwoToneColor;
}
export interface IconComponentProps extends AntdIconProps {
    icon: IconDefinition;
}
interface Color {
    getTwoToneColor: () => TwoToneColor;
    setTwoToneColor: (twoToneColor: TwoToneColor) => void;
}
export interface AntdIconType extends Color, FunctionalComponent<IconComponentProps> {
    displayName: string;
}
declare const Icon: AntdIconType;
export default Icon;
