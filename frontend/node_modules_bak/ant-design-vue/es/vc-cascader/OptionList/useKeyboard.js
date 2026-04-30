import { computed, ref, watchEffect } from 'vue';
import { useBaseProps } from '../../vc-select';
import KeyCode from '../../_util/KeyCode';
import { SEARCH_MARK } from '../hooks/useSearchOptions';
export default ((context, options, fieldNames, activeValueCells, setActiveValueCells,
// containerRef: Ref<HTMLElement>,
onKeyBoardSelect) => {
  const baseProps = useBaseProps();
  const rtl = computed(() => baseProps.direction === 'rtl');
  const [validActiveValueCells, lastActiveIndex, lastActiveOptions] = [ref([]), ref(), ref([])];
  watchEffect(() => {
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
        case KeyCode.UP:
        case KeyCode.DOWN:
          {
            let offset = 0;
            if (which === KeyCode.UP) {
              offset = -1;
            } else if (which === KeyCode.DOWN) {
              offset = 1;
            }
            if (offset !== 0) {
              offsetActiveOption(offset);
            }
            break;
          }
        case KeyCode.LEFT:
          {
            if (rtl.value) {
              nextColumn();
            } else {
              prevColumn();
            }
            break;
          }
        case KeyCode.RIGHT:
          {
            if (rtl.value) {
              prevColumn();
            } else {
              nextColumn();
            }
            break;
          }
        case KeyCode.BACKSPACE:
          {
            if (!baseProps.searchValue) {
              prevColumn();
            }
            break;
          }
        // >>> Select
        case KeyCode.ENTER:
          {
            if (validActiveValueCells.value.length) {
              const option = lastActiveOptions.value[lastActiveIndex.value];
              // Search option should revert back of origin options
              const originOptions = (option === null || option === void 0 ? void 0 : option[SEARCH_MARK]) || [];
              if (originOptions.length) {
                onKeyBoardSelect(originOptions.map(opt => opt[fieldNames.value.value]), originOptions[originOptions.length - 1]);
              } else {
                onKeyBoardSelect(validActiveValueCells.value, option);
              }
            }
            break;
          }
        // >>> Close
        case KeyCode.ESC:
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
});