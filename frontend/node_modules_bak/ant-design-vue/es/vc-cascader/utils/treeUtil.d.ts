import type { Key } from '../../_util/type';
import type { SingleValueType, DefaultOptionType, InternalFieldNames, ShowCheckedStrategy } from '../Cascader';
import type { OptionsInfo } from '../hooks/useEntities';
export declare function formatStrategyValues(pathKeys: Key[], keyPathEntities: OptionsInfo['pathKeyEntities'], showCheckedStrategy: ShowCheckedStrategy): Key[];
export declare function toPathOptions(valueCells: SingleValueType, options: DefaultOptionType[], fieldNames: InternalFieldNames, stringMode?: boolean): {
    value: SingleValueType[number];
    index: number;
    option: DefaultOptionType;
}[];
