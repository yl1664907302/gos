import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { isEmptyElement, initDefaultProps, flattenChildren, isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { collapseProps } from './commonProps';
import { getDataAndAriaProps } from '../_util/util';
import { computed, defineComponent, ref, watch } from 'vue';
import RightOutlined from "@ant-design/icons-vue/es/icons/RightOutlined";
import firstNotUndefined from '../_util/firstNotUndefined';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import collapseMotion from '../_util/collapseMotion';
// CSSINJS
import useStyle from './style';
function getActiveKeysArray(activeKey) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    const activeKeyType = typeof currentActiveKey;
    currentActiveKey = activeKeyType === 'number' || activeKeyType === 'string' ? [currentActiveKey] : [];
  }
  return currentActiveKey.map(key => String(key));
}
export { collapseProps };
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ACollapse',
  inheritAttrs: false,
  props: initDefaultProps(collapseProps(), {
    accordion: false,
    destroyInactivePanel: false,
    bordered: true,
    expandIconPosition: 'start'
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const stateActiveKey = ref(getActiveKeysArray(firstNotUndefined([props.activeKey, props.defaultActiveKey])));
    watch(() => props.activeKey, () => {
      stateActiveKey.value = getActiveKeysArray(props.activeKey);
    }, {
      deep: true
    });
    const {
      prefixCls,
      direction,
      rootPrefixCls
    } = useConfigInject('collapse', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const iconPosition = computed(() => {
      const {
        expandIconPosition
      } = props;
      if (expandIconPosition !== undefined) {
        return expandIconPosition;
      }
      return direction.value === 'rtl' ? 'end' : 'start';
    });
    const renderExpandIcon = panelProps => {
      const {
        expandIcon = slots.expandIcon
      } = props;
      const icon = expandIcon ? expandIcon(panelProps) : _createVNode(RightOutlined, {
        "rotate": panelProps.isActive ? 90 : undefined
      }, null);
      return _createVNode("div", {
        "class": [`${prefixCls.value}-expand-icon`, hashId.value],
        "onClick": () => ['header', 'icon'].includes(props.collapsible) && onClickItem(panelProps.panelKey)
      }, [isValidElement(Array.isArray(expandIcon) ? icon[0] : icon) ? cloneElement(icon, {
        class: `${prefixCls.value}-arrow`
      }, false) : icon]);
    };
    const setActiveKey = activeKey => {
      if (props.activeKey === undefined) {
        stateActiveKey.value = activeKey;
      }
      const newKey = props.accordion ? activeKey[0] : activeKey;
      emit('update:activeKey', newKey);
      emit('change', newKey);
    };
    const onClickItem = key => {
      let activeKey = stateActiveKey.value;
      if (props.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [...activeKey];
        const index = activeKey.indexOf(key);
        const isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      setActiveKey(activeKey);
    };
    const getNewChild = (child, index) => {
      var _a, _b, _c;
      if (isEmptyElement(child)) return;
      const activeKey = stateActiveKey.value;
      const {
        accordion,
        destroyInactivePanel,
        collapsible,
        openAnimation
      } = props;
      const animation = openAnimation || collapseMotion(`${rootPrefixCls.value}-motion-collapse`);
      // If there is no key provide, use the panel order as default key
      const key = String((_a = child.key) !== null && _a !== void 0 ? _a : index);
      const {
        header = (_c = (_b = child.children) === null || _b === void 0 ? void 0 : _b.header) === null || _c === void 0 ? void 0 : _c.call(_b),
        headerClass,
        collapsible: childCollapsible,
        disabled
      } = child.props || {};
      let isActive = false;
      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }
      let mergeCollapsible = childCollapsible !== null && childCollapsible !== void 0 ? childCollapsible : collapsible;
      // legacy 2.x
      if (disabled || disabled === '') {
        mergeCollapsible = 'disabled';
      }
      const newProps = {
        key,
        panelKey: key,
        header,
        headerClass,
        isActive,
        prefixCls: prefixCls.value,
        destroyInactivePanel,
        openAnimation: animation,
        accordion,
        onItemClick: mergeCollapsible === 'disabled' ? null : onClickItem,
        expandIcon: renderExpandIcon,
        collapsible: mergeCollapsible
      };
      return cloneElement(child, newProps);
    };
    const getItems = () => {
      var _a;
      return flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)).map(getNewChild);
    };
    return () => {
      const {
        accordion,
        bordered,
        ghost
      } = props;
      const collapseClassName = classNames(prefixCls.value, {
        [`${prefixCls.value}-borderless`]: !bordered,
        [`${prefixCls.value}-icon-position-${iconPosition.value}`]: true,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-ghost`]: !!ghost,
        [attrs.class]: !!attrs.class
      }, hashId.value);
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({
        "class": collapseClassName
      }, getDataAndAriaProps(attrs)), {}, {
        "style": attrs.style,
        "role": accordion ? 'tablist' : null
      }), [getItems()]));
    };
  }
});