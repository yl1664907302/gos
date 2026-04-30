import type { ComputedRef } from 'vue';
import type { PresetDate } from '../interface';
export default function usePresets<T>(presets?: ComputedRef<PresetDate<T>[]>, legacyRanges?: ComputedRef<Record<string, T | (() => T)>>): ComputedRef<PresetDate<T>[]>;
