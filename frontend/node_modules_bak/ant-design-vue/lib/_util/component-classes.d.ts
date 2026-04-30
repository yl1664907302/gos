/**
 * source by `component-classes`
 * https://github.com/component/classes.git
 */
export declare class ClassList {
    el: Element;
    list: DOMTokenList;
    constructor(el: Element);
    array(): string[];
    /**
     * Add class `name` if not already present.
     *
     * @param {String} name
     * @return {ClassList}
     * @api public
     */
    add(name: string): ClassList;
    /**
     * Remove class `name` when present, or
     * pass a regular expression to remove
     * any which match.
     *
     * @param {String|RegExp} name
     * @return {ClassList}
     * @api public
     */
    remove(name: string | RegExp): ClassList;
    /**
     * Remove all classes matching `re`.
     *
     * @param {RegExp} re
     * @return {ClassList}
     * @api private
     */
    _removeMatching(re: RegExp): ClassList;
    /**
     * Toggle class `name`, can force state via `force`.
     *
     * For browsers that support classList, but do not support `force` yet,
     * the mistake will be detected and corrected.
     *
     * @param {String} name
     * @param {Boolean} force
     * @return {ClassList}
     * @api public
     */
    toggle(name: string, force: boolean): ClassList;
    /**
     * Check if class `name` is present.
     *
     * @param {String} name
     * @api public
     */
    has(name: string): boolean;
    /**
     * Check if class `name` is present.
     *
     * @param {String} name
     * @api public
     */
    contains(name: string): boolean;
}
/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */
export default function (el: Element): ClassList;
