/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */
import type { BaseSelectProps } from '../BaseSelect';
export interface BaseSelectContextProps extends BaseSelectProps {
    triggerOpen: boolean;
    multiple: boolean;
    toggleOpen: (open?: boolean) => void;
}
export declare function useProvideBaseSelectProps(props: BaseSelectContextProps): void;
export default function useBaseProps(): BaseSelectContextProps;
