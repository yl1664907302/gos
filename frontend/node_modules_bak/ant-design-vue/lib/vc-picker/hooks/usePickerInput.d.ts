import type { ComputedRef, HTMLAttributes, Ref } from 'vue';
import type { FocusEventHandler } from '../../_util/EventInterface';
export default function usePickerInput({ open, value, isClickOutside, triggerOpen, forwardKeydown, onKeydown, blurToCancel, onSubmit, onCancel, onFocus, onBlur, }: {
    open: Ref<boolean>;
    value: Ref<string>;
    isClickOutside: (clickElement: EventTarget | null) => boolean;
    triggerOpen: (open: boolean) => void;
    forwardKeydown: (e: KeyboardEvent) => boolean;
    onKeydown: (e: KeyboardEvent, preventDefault: () => void) => void;
    blurToCancel?: ComputedRef<boolean>;
    onSubmit: () => void | boolean;
    onCancel: () => void;
    onFocus?: FocusEventHandler;
    onBlur?: FocusEventHandler;
}): [ComputedRef<HTMLAttributes>, {
    focused: Ref<boolean>;
    typing: Ref<boolean>;
}];
