import type { CSSProperties } from 'vue';
import type { VueTypeValidableDef } from 'vue-types';
import type { VueNode } from '../type';
export declare function withUndefined<T extends {
    default?: any;
}>(type: T): T;
declare const _default: {
    new (): {};
    defaults: Partial<import("vue-types/dist/types").VueTypesDefaults>;
    sensibleDefaults: boolean | Partial<import("vue-types/dist/types").VueTypesDefaults>;
    readonly any: VueTypeValidableDef<any>;
    readonly func: VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    };
    readonly bool: VueTypeValidableDef<boolean> & {
        default: boolean;
    };
    readonly string: VueTypeValidableDef<string> & {
        default: string;
    };
    readonly number: VueTypeValidableDef<number> & {
        default: number;
    };
    readonly array: VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    readonly object: VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    readonly integer: import("vue-types").VueTypeDef<number> & {
        default: number;
    };
    readonly symbol: import("vue-types").VueTypeDef<symbol>;
    readonly custom: typeof import("vue-types").custom;
    readonly oneOf: typeof import("vue-types").oneOf;
    readonly instanceOf: typeof import("vue-types").instanceOf;
    readonly oneOfType: typeof import("vue-types").oneOfType;
    readonly arrayOf: typeof import("vue-types").arrayOf;
    readonly objectOf: typeof import("vue-types").objectOf;
    readonly shape: typeof import("vue-types").shape;
    extend<T>(props: import("vue-types/dist/types").ExtendProps<any> | import("vue-types/dist/types").ExtendProps<any>[]): T;
    utils: {
        validate<T_1, U>(value: T_1, type: U): boolean;
        toType<T_2 = unknown>(name: string, obj: import("vue-types/dist/types").PropOptions<T_2, T_2>, validable?: boolean): import("vue-types").VueTypeDef<T_2> | VueTypeValidableDef<T_2>;
    };
} & {
    readonly looseBool: VueTypeValidableDef<boolean>;
    readonly style: VueTypeValidableDef<CSSProperties>;
    readonly VueNode: VueTypeValidableDef<VueNode>;
};
export default _default;
