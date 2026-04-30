import type { ComputedRef, InjectionKey } from 'vue';
import type { MenuProps } from './Menu';
export interface OverrideContextProps {
    prefixCls?: ComputedRef<string>;
    mode?: ComputedRef<MenuProps['mode']>;
    selectable?: ComputedRef<boolean>;
    validator?: (menuProps: Pick<MenuProps, 'mode'>) => void;
    onClick?: () => void;
    expandIcon?: ComputedRef<any>;
}
export declare const OverrideContextKey: InjectionKey<OverrideContextProps>;
export declare const useInjectOverride: () => OverrideContextProps;
export declare const useProvideOverride: (props: OverrideContextProps) => void;
