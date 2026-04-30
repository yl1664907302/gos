/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */
import type { TreeProps } from '../tree';
import type { DataEntity, IconType } from '../vc-tree/interface';
import type { InternalDataEntity, Key, LegacyDataNode, RawValueType } from './interface';
export interface LegacyContextProps {
    checkable: boolean;
    checkedKeys: Key[];
    customCheckable: () => any;
    halfCheckedKeys: Key[];
    treeExpandedKeys: Key[];
    treeDefaultExpandedKeys: Key[];
    onTreeExpand: (keys: Key[]) => void;
    treeDefaultExpandAll: boolean;
    treeIcon: IconType;
    showTreeIcon: boolean;
    switcherIcon: IconType;
    treeLine: TreeProps['showLine'];
    treeNodeFilterProp: string;
    treeLoadedKeys: Key[];
    treeMotion: any;
    loadData: (treeNode: LegacyDataNode) => Promise<unknown>;
    onTreeLoad: (loadedKeys: Key[]) => void;
    keyEntities: Record<RawValueType, DataEntity<any>>;
    customSlots: {
        title?: (data: InternalDataEntity) => any;
        treeCheckable: () => any;
        [key: string]: ((...args: any[]) => any) | undefined;
    };
}
export declare function useProvideLegacySelectContext(props: LegacyContextProps): void;
export default function useInjectLegacySelectContext(): LegacyContextProps;
