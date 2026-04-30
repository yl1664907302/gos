/**
 * Safari has the elasticity effect which provides negative `scrollTop` value.
 * We should ignore it since will make scroll animation shake.
 */
export function alignScrollTop(scrollTop: any, scrollRange: any): any;
/**
 * Get node `offsetHeight`. We prefer node is a dom element directly.
 * But if not provided, downgrade to `findDOMNode` to get the real dom element.
 */
export function getNodeHeight(node: any): any;
/**
 * Calculate the located item absolute top with whole scroll height
 */
export function getItemAbsoluteTop({ scrollTop, ...rest }: {
    [x: string]: any;
    scrollTop: any;
}): any;
/**
 * Calculate the located item related top with current window height
 */
export function getItemRelativeTop({ itemIndex, itemOffsetPtg, itemElementHeights, scrollPtg, clientHeight, getItemKey, }: {
    itemIndex: any;
    itemOffsetPtg: any;
    itemElementHeights: any;
    scrollPtg: any;
    clientHeight: any;
    getItemKey: any;
}): number;
export function getCompareItemRelativeTop({ locatedItemRelativeTop, locatedItemIndex, compareItemIndex, startIndex, endIndex, getItemKey, itemElementHeights, }: {
    locatedItemRelativeTop: any;
    locatedItemIndex: any;
    compareItemIndex: any;
    startIndex: any;
    endIndex: any;
    getItemKey: any;
    itemElementHeights: any;
}): any;
export function getScrollPercentage({ scrollTop, scrollHeight, clientHeight }: {
    scrollTop: any;
    scrollHeight: any;
    clientHeight: any;
}): number;
export function getElementScrollPercentage(element: any): number;
/**
 * Get display items start, end, located item index. This is pure math calculation
 */
export function getRangeIndex(scrollPtg: any, itemCount: any, visibleCount: any): {
    itemIndex: number;
    itemOffsetPtg: number;
    startIndex: number;
    endIndex: number;
};
export function requireVirtual(height: any, itemHeight: any, count: any, virtual: any): boolean;
/**
 * Our algorithm have additional one ghost item
 * whose index as `data.length` to simplify the calculation
 */
export const GHOST_ITEM_KEY: "__vc_ghost_item__";
