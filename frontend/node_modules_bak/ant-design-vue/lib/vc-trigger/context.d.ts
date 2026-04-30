import type { Ref } from 'vue';
export interface PortalContextProps {
    shouldRender: Ref<boolean>;
    inTriggerContext: boolean;
}
export declare const useProvidePortal: (instance: any, config?: {
    inTriggerContext: boolean;
}) => void;
export declare const useInjectPortal: () => {
    shouldRender: import("vue").ComputedRef<boolean>;
};
