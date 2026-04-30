import type { DataEntity } from '../../vc-tree/interface';
import type { InternalFieldName } from '../TreeSelect';
import type { RawValueType, Key } from '../interface';
export declare const SHOW_ALL = "SHOW_ALL";
export declare const SHOW_PARENT = "SHOW_PARENT";
export declare const SHOW_CHILD = "SHOW_CHILD";
export type CheckedStrategy = typeof SHOW_ALL | typeof SHOW_PARENT | typeof SHOW_CHILD;
export declare function formatStrategyValues(values: Key[], strategy: CheckedStrategy, keyEntities: Record<Key, DataEntity>, fieldNames: InternalFieldName): RawValueType[];
