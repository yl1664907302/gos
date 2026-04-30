import type { TableLocale } from './interface';
interface DefaultExpandIconProps<RecordType> {
    prefixCls: string;
    onExpand: (record: RecordType, e: MouseEvent) => void;
    record: RecordType;
    expanded: boolean;
    expandable: boolean;
}
declare function renderExpandIcon(locale: TableLocale): <RecordType>({ prefixCls, onExpand, record, expanded, expandable, }: DefaultExpandIconProps<RecordType>) => import("vue/jsx-runtime").JSX.Element;
export default renderExpandIcon;
