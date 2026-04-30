import { FunctionalComponent } from 'vue';
import { AntdIconProps } from '../components/AntdIcon';
export interface CodeFilledIconType extends FunctionalComponent<AntdIconProps> {
    displayName: string;
}
declare const CodeFilled: CodeFilledIconType;
export default CodeFilled;
