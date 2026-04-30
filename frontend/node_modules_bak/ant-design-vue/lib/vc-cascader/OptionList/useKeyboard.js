"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vcSelect = require("../../vc-select");
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
var _useSearchOptions = require("../hooks/useSearchOptions");
var _default = (context, options, fieldNames, activeValueCells, setActiveValueCells,
// containerRef: Ref<HTMLElement>,
onKeyBoardSelect) => {
  const baseProps = (0, _vcSelect.useBaseProps)();
  const rtl = (0, _vue.computed)(() => baseProps.direction === 'rtl');
  const [validActiveValueCells, lastActiveIndex, lastActiveOptions] = [(0, _vue.ref)([]), (0, _vue.ref)(), (0, _vue.ref)([])];
  (0, _vue.watchEffect)(() => {
    let activeIndex = -1;
    let currentOptions = options.value;
    const mergedActiveIndexes = [];
    const mergedActiveValueCells = [];
    const len = activeValueCells.value.length;
    // Fill validate active value cells and index
    for (let i = 0; i < len && currentOptions; i += 1) {
      // Mark the active index for current options
      const nextActiveIndex = currentOptions.findIndex(option => option[fieldNames.value.value] === activeValueCells.value[i]);
      if (nextActiveIndex === -1) {
        break;
      }
      activeIndex = nextActiveIndex;
      mergedActiveIndexes.push(activeIndex);
      mergedActiveValueCells.push(activeValueCells.value[i]);
      currentOptions = currentOptions[activeIndex][fieldNames.value.children];
    }
    // Fill last active options
    let activeOptions = options.value;
    for (let i = 0; i < mergedActiveIndexes.length - 1; i += 1) {
      activeOptions = activeOptions[mergedActiveIndexes[i]][fieldNames.value.children];
    }
    [validActiveValueCells.value, lastActiveIndex.value, lastActiveOptions.value] = [mergedActiveValueCells, activeIndex, activeOptions];
  });
  // Update active value cells and scroll to target element
  const internalSetActiveValueCells = next => {
    setActiveValueCells(next);
  };
  // Same options offset
  const offsetActiveOption = offset => {
    const len = lastActiveOptions.value.length;
    let currentIndex = lastActiveIndex.value;
    if (currentIndex === -1 && offset < 0) {
      currentIndex = len;
    }
    for (let i = 0; i < len; i += 1) {
      currentIndex = (currentIndex + offset + len) % len;
      const option = lastActiveOptions.value[currentIndex];
      if (option && !option.disabled) {
        const value = option[fieldNames.value.value];
        const nextActiveCells = validActiveValueCells.value.slice(0, -1).concat(value);
        internalSetActiveValueCells(nextActiveCells);
        return;
      }
    }
  };
  // Different options offset
  const prevColumn = () => {
    if (validActiveValueCells.value.length > 1) {
      const nextActiveCells = validActiveValueCells.value.slice(0, -1);
      internalSetActiveValueCells(nextActiveCells);
    } else {
      baseProps.toggleOpen(false);
    }
  };
  const nextColumn = () => {
    var _a;
    const nextOptions = ((_a = lastActiveOptions.value[lastActiveIndex.value]) === null || _a === void 0 ? void 0 : _a[fieldNames.value.children]) || [];
    const nextOption = nextOptions.find(option => !option.disabled);
    if (nextOption) {
      const nextActiveCells = [...validActiveValueCells.value, nextOption[fieldNames.value.value]];
      internalSetActiveValueCells(nextActiveCells);
    }
  };
  context.expose({
    // scrollTo: treeRef.current?.scrollTo,
    onKeydown: event => {
      const {
        which
      } = event;
      switch (which) {
        // >>> Arrow keys
        case _KeyCode.default.UP:
        case _KeyCode.default.DOWN:
          {
            let offset = 0;
            if (which === _KeyCode.default.UP) {
              offset = -1;
            } else if (which === _KeyCode.default.DOWN) {
              offset = 1;
            }
            if (offset !== 0) {
              offsetActiveOption(offset);
            }
            break;
          }
        case _KeyCode.default.LEFT:
          {
            if (rtl.value) {
              nextColumn();
            } else {
              prevColumn();
            }
            break;
          }
        case _KeyCode.default.RIGHT:
          {
            if (rtl.value) {
              prevColumn();
            } else {
              nextColumn();
            }
            break;
          }
        case _KeyCode.default.BACKSPACE:
          {
            if (!baseProps.searchValue) {
              prevColumn();
            }
            break;
          }
        // >>> Select
        case _KeyCode.default.ENTER:
          {
            if (validActiveValueCells.value.length) {
              const option = lastActiveOptions.value[lastActiveIndex.value];
              // Search option should revert back of origin options
              const originOptions = (option === null || option === void 0 ? void 0 : option[_useSearchOptions.SEARCH_MARK]) || [];
              if (originOptions.length) {
                onKeyBoardSelect(originOptions.map(opt => opt[fieldNames.value.value]), originOptions[originOptions.length - 1]);
              } else {
                onKeyBoardSelect(validActiveValueCells.value, option);
              }
            }
            break;
          }
        // >>> Close
        case _KeyCode.default.ESC:
          {
            baseProps.toggleOpen(false);
            if (open) {
              event.stopPropagation();
            }
          }
      }
    },
    onKeyup: () => {}
  });
};
exports.default = _default;