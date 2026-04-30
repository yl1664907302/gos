export interface ConfigurableWindow {
    window?: Window;
}
export interface ConfigurableDocument {
    document?: Document;
}
export interface ConfigurableNavigator {
    navigator?: Navigator;
}
export interface ConfigurableLocation {
    location?: Location;
}
export declare const defaultWindow: Window & typeof globalThis;
export declare const defaultDocument: Document;
export declare const defaultNavigator: Navigator;
export declare const defaultLocation: Location;
