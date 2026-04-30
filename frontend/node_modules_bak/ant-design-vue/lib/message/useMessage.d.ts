import type { MessageInstance, ConfigOptions } from './interface';
import type { VNode } from 'vue';
type HolderProps = ConfigOptions & {
    onAllRemoved?: VoidFunction;
};
export declare function useInternalMessage(messageConfig?: HolderProps): readonly [MessageInstance, () => VNode];
export default function useMessage(messageConfig?: ConfigOptions): readonly [MessageInstance, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>];
export {};
