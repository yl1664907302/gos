import type { Ref } from 'vue';
export type DisabledType = boolean | undefined;
export declare const useInjectDisabled: () => Ref<DisabledType, DisabledType>;
export declare const useProviderDisabled: (disabled: Ref<DisabledType>) => Ref<DisabledType, DisabledType>;
