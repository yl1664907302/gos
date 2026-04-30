import type { Ref, InjectionKey } from 'vue';
export type SiderCollapsed = Ref<boolean>;
export declare const SiderCollapsedKey: InjectionKey<SiderCollapsed>;
export interface SiderHookProvider {
    addSider?: (id: string) => void;
    removeSider?: (id: string) => void;
}
export declare const SiderHookProviderKey: InjectionKey<SiderHookProvider>;
