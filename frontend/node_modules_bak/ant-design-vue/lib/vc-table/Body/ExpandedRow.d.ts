import type { CustomizeComponent } from '../interface';
export interface ExpandedRowProps {
    prefixCls: string;
    component: CustomizeComponent;
    cellComponent: CustomizeComponent;
    expanded: boolean;
    colSpan: number;
    isEmpty: boolean;
}
declare const _default: import("vue").DefineComponent<ExpandedRowProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExpandedRowProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
