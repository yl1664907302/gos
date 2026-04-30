import type { ScreenSizeMap } from '../_util/responsiveObserve';
export type AvatarSize = 'large' | 'small' | 'default' | number | ScreenSizeMap;
export interface AvatarContextType {
    size?: AvatarSize;
    shape?: 'circle' | 'square';
}
export declare const useAvatarInjectContext: () => AvatarContextType;
export declare const useAvatarProviderContext: (context: AvatarContextType) => void;
