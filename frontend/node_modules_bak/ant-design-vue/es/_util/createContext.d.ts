declare function createContext<T extends Record<string, any>>(defaultValue?: T): {
    useProvide: (props: T, newProps?: T) => import("vue").Reactive<T>;
    useInject: () => T;
};
export default createContext;
