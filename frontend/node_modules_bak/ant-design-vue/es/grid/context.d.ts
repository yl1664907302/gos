import type { Ref, InjectionKey, ComputedRef } from 'vue';
export interface RowContext {
    gutter: ComputedRef<[number, number]>;
    wrap: ComputedRef<boolean>;
    supportFlexGap: Ref<boolean>;
}
export declare const RowContextKey: InjectionKey<RowContext>;
declare const useProvideRow: (state: RowContext) => void;
declare const useInjectRow: () => RowContext;
export { useInjectRow, useProvideRow };
export default useProvideRow;
