export declare function hasPrefixSuffix(propsAndSlots: any): number | boolean;
export declare function hasAddon(propsAndSlots: any): number | boolean;
export declare function fixControlledValue(value: string | number): string;
export declare function resolveOnChange(target: HTMLInputElement, e: Event, onChange: Function, targetValue?: string): void;
export interface InputFocusOptions extends FocusOptions {
    cursor?: 'start' | 'end' | 'all';
}
export declare function triggerFocus(element?: HTMLInputElement | HTMLTextAreaElement, option?: InputFocusOptions): void;
