import type { CSSProperties } from 'vue';
import type { VueNode } from '../_util/type';
import type { DropdownRender, Placement, RenderDOMFunc } from './BaseSelect';
import type { AlignType } from '../vc-trigger/interface';
export interface RefTriggerProps {
    getPopupElement: () => HTMLDivElement;
}
export interface SelectTriggerProps {
    prefixCls: string;
    disabled: boolean;
    visible: boolean;
    popupElement: VueNode;
    animation?: string;
    transitionName?: string;
    containerWidth: number;
    placement?: Placement;
    dropdownStyle: CSSProperties;
    dropdownClassName: string;
    direction: string;
    dropdownMatchSelectWidth?: boolean | number;
    dropdownRender?: DropdownRender;
    getPopupContainer?: RenderDOMFunc;
    dropdownAlign: AlignType;
    empty: boolean;
    getTriggerDOMNode: () => any;
    onPopupVisibleChange?: (visible: boolean) => void;
    onPopupMouseEnter: () => void;
    onPopupFocusin: () => void;
    onPopupFocusout: () => void;
}
declare const SelectTrigger: import("vue").DefineComponent<SelectTriggerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<SelectTriggerProps> & Readonly<{}>, {
    popupRef: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default SelectTrigger;
