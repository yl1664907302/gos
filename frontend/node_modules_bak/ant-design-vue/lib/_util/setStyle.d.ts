import type { CSSProperties } from 'vue';
/**
 * Easy to set element style, return previous style
 * IE browser compatible(IE browser doesn't merge overflow style, need to set it separately)
 * https://github.com/ant-design/ant-design/issues/19393
 *
 */
export interface SetStyleOptions {
    element?: HTMLElement;
}
declare function setStyle(style: CSSProperties, options?: SetStyleOptions): CSSProperties;
export default setStyle;
