interface IndentProps {
    prefixCls: string;
    level: number;
    isStart: boolean[];
    isEnd: boolean[];
}
declare const Indent: ({ prefixCls, level, isStart, isEnd }: IndentProps) => import("vue/jsx-runtime").JSX.Element;
export default Indent;
