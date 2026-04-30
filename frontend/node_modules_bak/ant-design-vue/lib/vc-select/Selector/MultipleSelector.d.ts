import type { InnerSelectorProps } from './interface';
import type { VueNode } from '../../_util/type';
import type { DisplayValueType, RenderNode, CustomTagProps } from '../BaseSelect';
type SelectorProps = InnerSelectorProps & {
    removeIcon?: RenderNode;
    maxTagCount?: number | 'responsive';
    maxTagTextLength?: number;
    maxTagPlaceholder?: VueNode | ((omittedValues: DisplayValueType[]) => VueNode);
    tokenSeparators?: string[];
    tagRender?: (props: CustomTagProps) => VueNode;
    onToggleOpen: any;
    compositionStatus: boolean;
    choiceTransitionName?: string;
    onRemove: (value: DisplayValueType) => void;
};
declare const SelectSelector: import("vue").DefineComponent<SelectorProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<SelectorProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default SelectSelector;
