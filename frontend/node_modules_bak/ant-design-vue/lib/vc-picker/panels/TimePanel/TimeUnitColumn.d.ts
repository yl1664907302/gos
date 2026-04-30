export type Unit = {
    label: any;
    value: number;
    disabled: boolean;
};
export type TimeUnitColumnProps = {
    prefixCls?: string;
    units?: Unit[];
    value?: number;
    active?: boolean;
    hideDisabledOptions?: boolean;
    onSelect?: (value: number) => void;
};
declare const _default: import("vue").DefineComponent<{
    value?: any;
    onSelect?: any;
    active?: any;
    prefixCls?: any;
    units?: any;
    hideDisabledOptions?: any;
}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    value?: any;
    onSelect?: any;
    active?: any;
    prefixCls?: any;
    units?: any;
    hideDisabledOptions?: any;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
