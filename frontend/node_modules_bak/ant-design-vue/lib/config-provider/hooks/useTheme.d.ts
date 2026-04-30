import type { ThemeConfig } from '../context';
import type { Ref } from 'vue';
export default function useTheme(theme?: Ref<ThemeConfig>, parentTheme?: Ref<ThemeConfig>): import("vue").ComputedRef<ThemeConfig>;
