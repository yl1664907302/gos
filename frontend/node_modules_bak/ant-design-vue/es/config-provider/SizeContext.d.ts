import type { Ref } from 'vue';
export type SizeType = 'small' | 'middle' | 'large' | undefined;
export declare const useInjectSize: () => Ref<SizeType, SizeType>;
export declare const useProviderSize: (size: Ref<SizeType>) => Ref<SizeType, SizeType>;
