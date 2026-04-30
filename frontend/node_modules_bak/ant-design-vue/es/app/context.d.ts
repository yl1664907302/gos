import type { InjectionKey } from 'vue';
import type { MessageInstance, ConfigOptions as MessageConfig } from '../message/interface';
import type { NotificationInstance, NotificationConfig } from '../notification/interface';
import type { ModalStaticFunctions } from '../modal/confirm';
export type AppConfig = {
    message?: MessageConfig;
    notification?: NotificationConfig;
};
export declare const AppConfigContextKey: InjectionKey<AppConfig>;
export declare const useProvideAppConfigContext: (appConfigContext: AppConfig) => void;
export declare const useInjectAppConfigContext: () => AppConfig;
type ModalType = Omit<ModalStaticFunctions, 'warn'>;
export interface useAppProps {
    message: MessageInstance;
    notification: NotificationInstance;
    modal: ModalType;
}
export declare const AppContextKey: InjectionKey<useAppProps>;
export declare const useProvideAppContext: (appContext: useAppProps) => void;
export declare const useInjectAppContext: () => useAppProps;
export {};
