import type { DataNode, ChangeEventExtra, RawValueType } from '../interface';
import type { VueNode } from '../../_util/type';
import type { DefaultOptionType, FieldNames } from '../TreeSelect';
export declare function convertChildrenToData(rootNodes: VueNode[]): DataNode[];
export declare function fillLegacyProps(dataNode: DataNode): any;
export declare function fillAdditionalInfo(extra: ChangeEventExtra, triggerValue: RawValueType, checkedValues: RawValueType[], treeData: DefaultOptionType[], showPosition: boolean, fieldNames: FieldNames): void;
