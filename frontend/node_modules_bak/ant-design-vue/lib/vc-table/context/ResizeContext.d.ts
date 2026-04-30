import type { InjectionKey } from 'vue';
import type { Key } from '../interface';
interface ResizeContextProps {
    onColumnResize: (columnKey: Key, width: number) => void;
}
export declare const ResizeContextKey: InjectionKey<ResizeContextProps>;
export declare const useProvideResize: (props: ResizeContextProps) => void;
export declare const useInjectResize: () => ResizeContextProps;
export {};
