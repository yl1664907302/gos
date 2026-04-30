import type { VNodeTypes } from 'vue';
interface Option {
    rows: number;
    suffix?: string;
}
declare const _default: (originElement: HTMLElement, option: Option, content: string, fixedContent: VNodeTypes[], ellipsisStr: string) => {
    content: VNodeTypes;
    text: string;
    ellipsis: boolean;
};
export default _default;
