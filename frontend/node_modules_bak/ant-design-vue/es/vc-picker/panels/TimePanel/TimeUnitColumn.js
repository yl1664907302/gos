import { createVNode as _createVNode } from "vue";
import { scrollTo, waitElementReady } from '../../utils/uiUtil';
import { useInjectPanel } from '../../PanelContext';
import classNames from '../../../_util/classNames';
import { ref, onBeforeUnmount, watch, defineComponent, nextTick, shallowRef } from 'vue';
export default defineComponent({
  name: 'TimeUnitColumn',
  props: ['prefixCls', 'units', 'onSelect', 'value', 'active', 'hideDisabledOptions'],
  setup(props) {
    const {
      open
    } = useInjectPanel();
    const ulRef = shallowRef(null);
    const liRefs = ref(new Map());
    const scrollRef = ref();
    watch(() => props.value, () => {
      const li = liRefs.value.get(props.value);
      if (li && open.value !== false) {
        scrollTo(ulRef.value, li.offsetTop, 120);
      }
    });
    onBeforeUnmount(() => {
      var _a;
      (_a = scrollRef.value) === null || _a === void 0 ? void 0 : _a.call(scrollRef);
    });
    watch(open, () => {
      var _a;
      (_a = scrollRef.value) === null || _a === void 0 ? void 0 : _a.call(scrollRef);
      nextTick(() => {
        if (open.value) {
          const li = liRefs.value.get(props.value);
          if (li) {
            scrollRef.value = waitElementReady(li, () => {
              scrollTo(ulRef.value, li.offsetTop, 0);
            });
          }
        }
      });
    }, {
      immediate: true,
      flush: 'post'
    });
    return () => {
      const {
        prefixCls,
        units,
        onSelect,
        value,
        active,
        hideDisabledOptions
      } = props;
      const cellPrefixCls = `${prefixCls}-cell`;
      return _createVNode("ul", {
        "class": classNames(`${prefixCls}-column`, {
          [`${prefixCls}-column-active`]: active
        }),
        "ref": ulRef,
        "style": {
          position: 'relative'
        }
      }, [units.map(unit => {
        if (hideDisabledOptions && unit.disabled) {
          return null;
        }
        return _createVNode("li", {
          "key": unit.value,
          "ref": element => {
            liRefs.value.set(unit.value, element);
          },
          "class": classNames(cellPrefixCls, {
            [`${cellPrefixCls}-disabled`]: unit.disabled,
            [`${cellPrefixCls}-selected`]: value === unit.value
          }),
          "onClick": () => {
            if (unit.disabled) {
              return;
            }
            onSelect(unit.value);
          }
        }, [_createVNode("div", {
          "class": `${cellPrefixCls}-inner`
        }, [unit.label])]);
      })]);
    };
  }
});