import { FunctionalComponent } from 'vue';
import { AntdIconProps } from '../components/AntdIcon';
export interface ToolFilledIconType extends FunctionalComponent<AntdIconProps> {
    displayName: string;
}
declare const ToolFilled: ToolFilledIconType;
export default ToolFilled;
