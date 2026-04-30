import { IconDefinition } from '@ant-design/icons-svg/lib/types';
import { CSSProperties, FunctionalComponent } from 'vue';
export interface IconProps {
    icon: IconDefinition;
    class?: string;
    onClick?: (e?: Event) => void;
    style?: CSSProperties;
    primaryColor?: string;
    secondaryColor?: string;
    focusable?: string;
}
export interface TwoToneColorPaletteSetter {
    primaryColor: string;
    secondaryColor?: string;
}
export interface TwoToneColorPalette extends TwoToneColorPaletteSetter {
    calculated?: boolean;
}
interface Color {
    getTwoToneColors: () => TwoToneColorPalette;
    setTwoToneColors: (twoToneColors: TwoToneColorPaletteSetter) => void;
}
export interface IconBaseType extends Color, FunctionalComponent<IconProps> {
    displayName: string;
}
declare const IconBase: IconBaseType;
export default IconBase;
