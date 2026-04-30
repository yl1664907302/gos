import { resetWarned } from '../vc-util/warning';
export { resetWarned };
export declare function noop(): void;
type Warning = (valid: boolean, component: string, message?: string) => void;
declare let warning: Warning;
export default warning;
