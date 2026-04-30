import type { VueNode } from '../_util/type';
export interface RenderEmptyProps {
    componentName?: string;
}
export declare const DefaultRenderEmpty: (props: RenderEmptyProps) => import("vue/jsx-runtime").JSX.Element;
declare function renderEmpty(componentName?: string): VueNode;
export type RenderEmptyHandler = typeof renderEmpty;
export default renderEmpty;
