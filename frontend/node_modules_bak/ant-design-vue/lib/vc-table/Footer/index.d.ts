import SummaryRow from './Row';
import SummaryCell from './Cell';
import type { DefaultRecordType, StickyOffsets } from '../interface';
import type { FlattenColumns } from '../context/SummaryContext';
export interface FooterProps<RecordType = DefaultRecordType> {
    stickyOffsets: StickyOffsets;
    flattenColumns: FlattenColumns<RecordType>;
}
declare const _default: import("vue").DefineComponent<FooterProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FooterProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
export { SummaryRow, SummaryCell };
export declare const FooterComponents: import("vue").DefineComponent<import("./Summary").SummaryProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("./Summary").SummaryProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
