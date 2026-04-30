import type { GlobalToken } from './interface';
import defaultAlgorithm from './themes/default';
/** Get current context Design Token. Will be different if you are using nest theme config. */
declare function useToken(): {
    theme: import("vue").ComputedRef<import("..").Theme<import("./internal").SeedToken, import("./interface").MapToken>>;
    token: import("vue").ComputedRef<GlobalToken>;
    hashId: import("vue").ComputedRef<string>;
};
export { type GlobalToken };
declare const _default: {
    /** @private Test Usage. Do not use in production. */
    defaultConfig: {
        token: import("./internal").SeedToken;
        hashed: boolean;
    };
    /** Default seedToken */
    defaultSeed: import("./internal").SeedToken;
    useToken: typeof useToken;
    defaultAlgorithm: typeof defaultAlgorithm;
    darkAlgorithm: import("..").DerivativeFunc<import("./internal").SeedToken, import("./interface").MapToken>;
    compactAlgorithm: import("..").DerivativeFunc<import("./internal").SeedToken, import("./interface").MapToken>;
};
export default _default;
