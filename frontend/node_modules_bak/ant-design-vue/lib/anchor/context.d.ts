import type { Ref, InjectionKey, ComputedRef } from 'vue';
import type { AnchorDirection } from './Anchor';
export interface AnchorContext {
    registerLink: (link: string) => void;
    unregisterLink: (link: string) => void;
    activeLink: Ref<string>;
    scrollTo: (link: string) => void;
    handleClick: (e: Event, info: {
        title: any;
        href: string;
    }) => void;
    direction: ComputedRef<AnchorDirection>;
}
export declare const AnchorContextKey: InjectionKey<AnchorContext>;
declare const useProvideAnchor: (state: AnchorContext) => void;
declare const useInjectAnchor: () => AnchorContext;
export { useInjectAnchor, useProvideAnchor };
export default useProvideAnchor;
