import type { PropType } from 'vue';
import type { VueTypeValidableDef, VueTypeDef } from 'vue-types';
declare const initDefaultProps: <T>(types: T, defaultProps: { [K in keyof T]?: T[K] extends VueTypeValidableDef<infer U> ? U : T[K] extends VueTypeDef<infer U_1> ? U_1 : T[K] extends {
    type: PropType<infer U_2>;
} ? U_2 : any; }) => T;
export default initDefaultProps;
