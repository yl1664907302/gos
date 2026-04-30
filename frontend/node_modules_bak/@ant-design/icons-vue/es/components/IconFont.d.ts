import { FunctionalComponent } from 'vue';
import { IconBaseProps } from './Icon';
export interface CustomIconOptions {
    scriptUrl?: string | string[];
    extraCommonProps?: {
        [key: string]: any;
    };
}
export interface IconFontProps extends IconBaseProps {
    type: string;
}
export interface IconFontType extends FunctionalComponent<IconFontProps> {
    displayName: string;
}
export default function create(options?: CustomIconOptions): FunctionalComponent<IconFontProps>;
