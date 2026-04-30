"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _warning = _interopRequireWildcard(require("../../vc-util/warning"));
var _legacyUtil = require("./legacyUtil");
var _commonUtil = require("./commonUtil");
var _propsUtil = require("../../_util/props-util");
var _BaseSelect = require("../BaseSelect");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function warningProps(props) {
  const {
    mode,
    options,
    children,
    backfill,
    allowClear,
    placeholder,
    getInputElement,
    showSearch,
    onSearch,
    defaultOpen,
    autofocus,
    labelInValue,
    value,
    inputValue,
    optionLabelProp
  } = props;
  const multiple = (0, _BaseSelect.isMultiple)(mode);
  const mergedShowSearch = showSearch !== undefined ? showSearch : multiple || mode === 'combobox';
  const mergedOptions = options || (0, _legacyUtil.convertChildrenToData)(children);
  // `tags` should not set option as disabled
  (0, _warning.default)(mode !== 'tags' || mergedOptions.every(opt => !opt.disabled), 'Please avoid setting option to disabled in tags mode since user can always type text as tag.');
  // `combobox` should not use `optionLabelProp`
  (0, _warning.default)(mode !== 'combobox' || !optionLabelProp, '`combobox` mode not support `optionLabelProp`. Please set `value` on Option directly.');
  // Only `combobox` support `backfill`
  (0, _warning.default)(mode === 'combobox' || !backfill, '`backfill` only works with `combobox` mode.');
  // Only `combobox` support `getInputElement`
  (0, _warning.default)(mode === 'combobox' || !getInputElement, '`getInputElement` only work with `combobox` mode.');
  // Customize `getInputElement` should not use `allowClear` & `placeholder`
  (0, _warning.noteOnce)(mode !== 'combobox' || !getInputElement || !allowClear || !placeholder, 'Customize `getInputElement` should customize clear and placeholder logic instead of configuring `allowClear` and `placeholder`.');
  // `onSearch` should use in `combobox` or `showSearch`
  if (onSearch && !mergedShowSearch && mode !== 'combobox' && mode !== 'tags') {
    (0, _warning.default)(false, '`onSearch` should work with `showSearch` instead of use alone.');
  }
  (0, _warning.noteOnce)(!defaultOpen || autofocus, '`defaultOpen` makes Select open without focus which means it will not close by click outside. You can set `autofocus` if needed.');
  if (value !== undefined && value !== null) {
    const values = (0, _commonUtil.toArray)(value);
    (0, _warning.default)(!labelInValue || values.every(val => typeof val === 'object' && ('key' in val || 'value' in val)), '`value` should in shape of `{ value: string | number, label?: any }` when you set `labelInValue` to `true`');
    (0, _warning.default)(!multiple || Array.isArray(value), '`value` should be array when `mode` is `multiple` or `tags`');
  }
  // Syntactic sugar should use correct children type
  if (children) {
    let invalidateChildType = null;
    children.some(node => {
      var _a;
      if (!(0, _propsUtil.isValidElement)(node) || !node.type) {
        return false;
      }
      const {
        type
      } = node;
      if (type.isSelectOption) {
        return false;
      }
      if (type.isSelectOptGroup) {
        const childs = ((_a = node.children) === null || _a === void 0 ? void 0 : _a.default()) || [];
        const allChildrenValid = childs.every(subNode => {
          if (!(0, _propsUtil.isValidElement)(subNode) || !node.type || subNode.type.isSelectOption) {
            return true;
          }
          invalidateChildType = subNode.type;
          return false;
        });
        if (allChildrenValid) {
          return false;
        }
        return true;
      }
      invalidateChildType = type;
      return true;
    });
    if (invalidateChildType) {
      (0, _warning.default)(false, `\`children\` should be \`Select.Option\` or \`Select.OptGroup\` instead of \`${invalidateChildType.displayName || invalidateChildType.name || invalidateChildType}\`.`);
    }
    (0, _warning.default)(inputValue === undefined, '`inputValue` is deprecated, please use `searchValue` instead.');
  }
}
var _default = exports.default = warningProps;