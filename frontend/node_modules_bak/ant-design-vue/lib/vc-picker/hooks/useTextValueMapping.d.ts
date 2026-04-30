import type { ComputedRef, Ref } from 'vue';
export default function useTextValueMapping({ valueTexts, onTextChange, }: {
    /** Must useMemo, to assume that `valueTexts` only match on the first change */
    valueTexts: ComputedRef<string[]>;
    onTextChange: (text: string) => void;
}): [Ref<string>, (text: string) => void, () => void];
