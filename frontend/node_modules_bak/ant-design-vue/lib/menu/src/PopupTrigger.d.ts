import type { PropType } from 'vue';
import type { MenuMode } from './interface';
import type { CustomSlotsType } from '../../_util/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    mode: PropType<MenuMode>;
    visible: BooleanConstructor;
    popupClassName: StringConstructor;
    popupOffset: PropType<number[]>;
    disabled: BooleanConstructor;
    onVisibleChange: PropType<(visible: boolean) => void>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "visibleChange"[], "visibleChange", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    mode: PropType<MenuMode>;
    visible: BooleanConstructor;
    popupClassName: StringConstructor;
    popupOffset: PropType<number[]>;
    disabled: BooleanConstructor;
    onVisibleChange: PropType<(visible: boolean) => void>;
}>> & Readonly<{
    onVisibleChange?: (...args: any[]) => any;
}>, {
    visible: boolean;
    disabled: boolean;
}, CustomSlotsType<{
    default?: any;
    popup?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
