import type { BaseOptionType, DefaultOptionType } from '../Select';
import type { VueNode } from '../../_util/type';
export declare function convertChildrenToData<OptionType extends BaseOptionType = DefaultOptionType>(nodes: VueNode[], optionOnly?: boolean): OptionType[];
