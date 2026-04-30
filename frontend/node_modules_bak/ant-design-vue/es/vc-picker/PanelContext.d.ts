import type { InjectionKey, Ref } from 'vue';
import type { OnSelect, PanelMode } from './interface';
export type ContextOperationRefProps = {
    onKeydown?: (e: KeyboardEvent) => boolean;
    onClose?: () => void;
};
export type PanelContextProps = {
    operationRef?: Ref<ContextOperationRefProps | null>;
    /** Only work with time panel */
    hideHeader?: Ref<boolean>;
    panelRef?: Ref<HTMLDivElement>;
    hidePrevBtn?: Ref<boolean>;
    hideNextBtn?: Ref<boolean>;
    onDateMouseenter?: (date: any) => void;
    onDateMouseleave?: (date: any) => void;
    onSelect?: OnSelect<any>;
    hideRanges?: Ref<boolean>;
    open?: Ref<boolean>;
    mode?: Ref<PanelMode>;
    /** Only used for TimePicker and this is a deprecated prop */
    defaultOpenValue?: Ref<any>;
};
declare const PanelContextKey: InjectionKey<PanelContextProps>;
export declare const useProvidePanel: (props: PanelContextProps) => void;
export declare const useInjectPanel: () => PanelContextProps;
export default PanelContextKey;
