import { Ref } from 'vue';
export interface IconContextProps {
    prefixCls?: Ref<string>;
    rootClassName?: Ref<string>;
    csp?: Ref<{
        nonce?: string;
    }>;
}
export declare const useProvideIconContext: (props: IconContextProps) => IconContextProps;
export declare const useInjectIconContext: () => IconContextProps;
