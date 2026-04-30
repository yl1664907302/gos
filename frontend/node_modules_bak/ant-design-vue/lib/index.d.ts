import type { App } from 'vue';
import { default as version } from './version';
import cssinjs from './_util/cssinjs';
export * from './components';
export * from './_util/cssinjs';
export { default as theme } from './theme';
export declare const install: (app: App) => App<any>;
export { version, cssinjs };
declare const _default: {
    version: string;
    install: (app: App<any>) => App<any>;
};
export default _default;
