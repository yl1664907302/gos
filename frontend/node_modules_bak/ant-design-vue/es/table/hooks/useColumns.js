import _extends from "@babel/runtime/helpers/esm/extends";
import devWarning from '../../vc-util/devWarning';
import { SELECTION_COLUMN } from './useSelection';
import { EXPAND_COLUMN } from '../../vc-table';
import { customRenderSlot } from '../../_util/vnode';
function fillSlots(columns, contextSlots) {
  const $slots = contextSlots.value;
  return columns.map(column => {
    var _a;
    if (column === SELECTION_COLUMN || column === EXPAND_COLUMN) return column;
    const cloneColumn = _extends({}, column);
    const {
      slots = {}
    } = cloneColumn;
    cloneColumn.__originColumn__ = column;
    devWarning(!('slots' in cloneColumn), 'Table', '`column.slots` is deprecated. Please use `v-slot:headerCell` `v-slot:bodyCell` instead.');
    Object.keys(slots).forEach(key => {
      const name = slots[key];
      if (cloneColumn[key] === undefined && $slots[name]) {
        cloneColumn[key] = $slots[name];
      }
    });
    if (contextSlots.value.headerCell && !((_a = column.slots) === null || _a === void 0 ? void 0 : _a.title)) {
      cloneColumn.title = customRenderSlot(contextSlots.value, 'headerCell', {
        title: column.title,
        column
      }, () => [column.title]);
    }
    if ('children' in cloneColumn && Array.isArray(cloneColumn.children)) {
      cloneColumn.children = fillSlots(cloneColumn.children, contextSlots);
    }
    return cloneColumn;
  });
}
export default function useColumns(contextSlots) {
  const filledColumns = columns => fillSlots(columns, contextSlots);
  return [filledColumns];
}