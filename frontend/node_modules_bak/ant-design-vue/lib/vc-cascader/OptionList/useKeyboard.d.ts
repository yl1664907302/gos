import type { Key } from '../../_util/type';
import type { Ref, SetupContext } from 'vue';
import type { DefaultOptionType, InternalFieldNames, SingleValueType } from '../Cascader';
declare const _default: (context: SetupContext, options: Ref<DefaultOptionType[]>, fieldNames: Ref<InternalFieldNames>, activeValueCells: Ref<Key[]>, setActiveValueCells: (activeValueCells: Key[]) => void, onKeyBoardSelect: (valueCells: SingleValueType, option: DefaultOptionType) => void) => void;
export default _default;
