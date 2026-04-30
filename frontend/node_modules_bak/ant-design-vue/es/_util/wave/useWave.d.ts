import type { ComputedRef, Ref } from 'vue';
export default function useWave(className: Ref<string>, wave?: ComputedRef<{
    disabled?: boolean;
}>): VoidFunction;
