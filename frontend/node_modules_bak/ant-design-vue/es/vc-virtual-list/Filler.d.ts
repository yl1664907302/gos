import type { FunctionalComponent } from 'vue';
interface FillerProps {
    prefixCls?: string;
    /** Virtual filler height. Should be `count * itemMinHeight` */
    height: number;
    /** Set offset of visible items. Should be the top of start item position */
    offset?: number;
    onInnerResize?: () => void;
}
declare const Filter: FunctionalComponent<FillerProps>;
export default Filter;
