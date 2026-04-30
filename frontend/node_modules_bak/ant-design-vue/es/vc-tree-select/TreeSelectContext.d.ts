import type { ExpandAction } from '../vc-tree/props';
import type { DefaultOptionType, InternalFieldName, OnInternalSelect } from './TreeSelect';
export interface TreeSelectContextProps {
    virtual?: boolean;
    dropdownMatchSelectWidth?: boolean | number;
    listHeight: number;
    listItemHeight: number;
    treeData: DefaultOptionType[];
    fieldNames: InternalFieldName;
    onSelect: OnInternalSelect;
    treeExpandAction?: ExpandAction;
}
export declare function useProvideSelectContext(props: TreeSelectContextProps): void;
export default function useInjectSelectContext(): TreeSelectContextProps;
