/**
 * Cursor rule:
 * 1. Only `showSearch` enabled
 * 2. Only `open` is `true`
 * 3. When typing, set `open` to `true` which hit rule of 2
 *
 * Accessibility:
 * - https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
 */
import type { CustomTagProps, DisplayValueType, Mode, RenderNode } from '../BaseSelect';
import type { VueNode } from '../../_util/type';
import type { ScrollTo } from '../../vc-virtual-list/List';
export interface SelectorProps {
    id: string;
    prefixCls: string;
    showSearch?: boolean;
    open: boolean;
    values: DisplayValueType[];
    multiple?: boolean;
    mode: Mode;
    searchValue: string;
    activeValue: string;
    inputElement: VueNode;
    autofocus?: boolean;
    activeDescendantId?: string;
    tabindex?: number | string;
    disabled?: boolean;
    placeholder?: VueNode;
    removeIcon?: RenderNode;
    maxTagCount?: number | 'responsive';
    maxTagTextLength?: number;
    maxTagPlaceholder?: VueNode | ((omittedValues: DisplayValueType[]) => VueNode);
    tagRender?: (props: CustomTagProps) => VueNode;
    optionLabelRender?: (props: Record<string, any>) => VueNode;
    /** Check if `tokenSeparators` contains `\n` or `\r\n` */
    tokenWithEnter?: boolean;
    choiceTransitionName?: string;
    onToggleOpen: (open?: boolean) => void | any;
    /** `onSearch` returns go next step boolean to check if need do toggle open */
    onSearch: (searchText: string, fromTyping: boolean, isCompositing: boolean) => boolean;
    onSearchSubmit: (searchText: string) => void;
    onRemove: (value: DisplayValueType) => void;
    onInputKeyDown?: (e: KeyboardEvent) => void;
    /**
     * @private get real dom for trigger align.
     * This may be removed after React provides replacement of `findDOMNode`
     */
    domRef: () => HTMLDivElement;
}
export interface RefSelectorProps {
    focus: () => void;
    blur: () => void;
    scrollTo?: ScrollTo;
}
declare const Selector: import("vue").DefineComponent<SelectorProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<SelectorProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default Selector;
