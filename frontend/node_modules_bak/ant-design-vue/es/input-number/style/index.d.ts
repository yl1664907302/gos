export interface ComponentToken {
    controlWidth: number;
    handleWidth: number;
    handleFontSize: number;
    /** Default `auto`. Set `true` will always show the handle */
    handleVisible: 'auto' | true;
}
declare const _default: (_prefixCls?: import("vue").Ref<string, string>) => import("../../theme/internal").UseComponentStyleResult;
export default _default;
