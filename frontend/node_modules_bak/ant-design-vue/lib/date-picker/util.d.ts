import type { PickerMode } from '../vc-picker/interface';
import type { SelectCommonPlacement } from '../_util/transition';
import type { PickerLocale } from './generatePicker';
import type { DirectionType } from '../config-provider';
export declare function getPlaceholder(locale: PickerLocale, picker: PickerMode, customizePlaceholder?: string): string;
export declare function getRangePlaceholder(locale: PickerLocale, picker: PickerMode, customizePlaceholder?: [string, string]): [string, string];
export declare function transPlacement2DropdownAlign(direction: DirectionType, placement?: SelectCommonPlacement): {
    points: string[];
    offset: number[];
    overflow: {
        adjustX: number;
        adjustY: number;
    };
};
