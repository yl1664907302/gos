import type { InjectionKey, Ref } from 'vue';
export interface ListContext {
    grid?: Ref<any>;
    itemLayout?: Ref<string>;
}
export declare const ListContextKey: InjectionKey<ListContext>;
