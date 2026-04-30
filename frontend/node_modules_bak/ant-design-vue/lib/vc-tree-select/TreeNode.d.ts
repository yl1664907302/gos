import type { FunctionalComponent } from 'vue';
import type { DataNode, Key } from './interface';
export interface TreeNodeProps extends Omit<DataNode, 'children'> {
    value: Key;
}
/** This is a placeholder, not real render in dom */
declare const TreeNode: FunctionalComponent<TreeNodeProps> & {
    isTreeSelectNode: boolean;
};
export default TreeNode;
