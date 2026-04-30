import type { Ref } from 'vue';
import type { TabSizeMap, TabOffsetMap, Tab } from '../interface';
export default function useOffsets(tabs: Ref<Tab[]>, tabSizes: Ref<TabSizeMap>): Ref<TabOffsetMap>;
