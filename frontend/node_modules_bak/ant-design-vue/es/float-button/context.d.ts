import type { Ref } from 'vue';
import type { FloatButtonShape } from './interface';
interface FloatButtonGroupContext {
    shape: Ref<FloatButtonShape>;
}
export declare const useProvideFloatButtonGroupContext: (props: FloatButtonGroupContext) => FloatButtonGroupContext;
export declare const useInjectFloatButtonGroupContext: () => FloatButtonGroupContext;
export {};
