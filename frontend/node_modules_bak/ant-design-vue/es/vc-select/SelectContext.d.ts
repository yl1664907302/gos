/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */
import type { RawValueType, RenderNode } from './BaseSelect';
import type { FlattenOptionData } from './interface';
import type { BaseOptionType, FieldNames, OnActiveValue, OnInternalSelect } from './Select';
export interface SelectContextProps {
    options: BaseOptionType[];
    flattenOptions: FlattenOptionData<BaseOptionType>[];
    onActiveValue: OnActiveValue;
    defaultActiveFirstOption?: boolean;
    onSelect: OnInternalSelect;
    menuItemSelectedIcon?: RenderNode;
    rawValues: Set<RawValueType>;
    fieldNames?: FieldNames;
    virtual?: boolean;
    listHeight?: number;
    listItemHeight?: number;
    childrenAsData?: boolean;
}
export declare function useProvideSelectProps(props: SelectContextProps): void;
export default function useSelectProps(): SelectContextProps;
