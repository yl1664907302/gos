/**
 * Get index with specific start index one by one. e.g.
 * min: 3, max: 9, start: 6
 *
 * Return index is:
 * [0]: 6
 * [1]: 7
 * [2]: 5
 * [3]: 8
 * [4]: 4
 * [5]: 9
 * [6]: 3
 */
export function getIndexByStartLoc(min: any, max: any, start: any, index: any): any;
/**
 * We assume that 2 list has only 1 item diff and others keeping the order.
 * So we can use dichotomy algorithm to find changed one.
 */
export function findListDiffIndex(originList: any, targetList: any, getKey: any): {
    index: number;
    multiple: boolean;
};
