import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent, toRefs } from 'vue';
import classNames from '../_util/classNames';
import { isFunction } from '../_util/util';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import { tourStepProps } from './interface';
import LocaleReceiver from '../locale/LocaleReceiver';
import Button from '../button';
import defaultLocale from '../locale/en_US';
const panelRender = defineComponent({
  name: 'ATourPanel',
  inheritAttrs: false,
  props: tourStepProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      current,
      total
    } = toRefs(props);
    const isLastStep = computed(() => current.value === total.value - 1);
    const prevBtnClick = e => {
      var _a;
      const prevButtonProps = props.prevButtonProps;
      (_a = props.onPrev) === null || _a === void 0 ? void 0 : _a.call(props, e);
      if (typeof (prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.onClick) === 'function') {
        prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.onClick();
      }
    };
    const nextBtnClick = e => {
      var _a, _b;
      const nextButtonProps = props.nextButtonProps;
      if (isLastStep.value) {
        (_a = props.onFinish) === null || _a === void 0 ? void 0 : _a.call(props, e);
      } else {
        (_b = props.onNext) === null || _b === void 0 ? void 0 : _b.call(props, e);
      }
      if (typeof (nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.onClick) === 'function') {
        nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.onClick();
      }
    };
    return () => {
      const {
        prefixCls,
        title,
        onClose,
        cover,
        description,
        type: stepType,
        arrow
      } = props;
      const prevButtonProps = props.prevButtonProps;
      const nextButtonProps = props.nextButtonProps;
      let headerNode;
      if (title) {
        headerNode = _createVNode("div", {
          "class": `${prefixCls}-header`
        }, [_createVNode("div", {
          "class": `${prefixCls}-title`
        }, [title])]);
      }
      let descriptionNode;
      if (description) {
        descriptionNode = _createVNode("div", {
          "class": `${prefixCls}-description`
        }, [description]);
      }
      let coverNode;
      if (cover) {
        coverNode = _createVNode("div", {
          "class": `${prefixCls}-cover`
        }, [cover]);
      }
      let mergeIndicatorNode;
      if (slots.indicatorsRender) {
        mergeIndicatorNode = slots.indicatorsRender({
          current: current.value,
          total
        });
      } else {
        mergeIndicatorNode = [...Array.from({
          length: total.value
        }).keys()].map((stepItem, index) => _createVNode("span", {
          "key": stepItem,
          "class": classNames(index === current.value && `${prefixCls}-indicator-active`, `${prefixCls}-indicator`)
        }, null));
      }
      const mainBtnType = stepType === 'primary' ? 'default' : 'primary';
      const secondaryBtnProps = {
        type: 'default',
        ghost: stepType === 'primary'
      };
      return _createVNode(LocaleReceiver, {
        "componentName": "Tour",
        "defaultLocale": defaultLocale.Tour
      }, {
        default: contextLocale => {
          var _a;
          return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
            "class": classNames(stepType === 'primary' ? `${prefixCls}-primary` : '', attrs.class, `${prefixCls}-content`)
          }), [arrow && _createVNode("div", {
            "class": `${prefixCls}-arrow`,
            "key": "arrow"
          }, null), _createVNode("div", {
            "class": `${prefixCls}-inner`
          }, [_createVNode(CloseOutlined, {
            "class": `${prefixCls}-close`,
            "onClick": onClose
          }, null), coverNode, headerNode, descriptionNode, _createVNode("div", {
            "class": `${prefixCls}-footer`
          }, [total.value > 1 && _createVNode("div", {
            "class": `${prefixCls}-indicators`
          }, [mergeIndicatorNode]), _createVNode("div", {
            "class": `${prefixCls}-buttons`
          }, [current.value !== 0 ? _createVNode(Button, _objectSpread(_objectSpread(_objectSpread({}, secondaryBtnProps), prevButtonProps), {}, {
            "onClick": prevBtnClick,
            "size": "small",
            "class": classNames(`${prefixCls}-prev-btn`, prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.className)
          }), {
            default: () => [isFunction(prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.children) ? prevButtonProps.children() : (_a = prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.children) !== null && _a !== void 0 ? _a : contextLocale.Previous]
          }) : null, _createVNode(Button, _objectSpread(_objectSpread({
            "type": mainBtnType
          }, nextButtonProps), {}, {
            "onClick": nextBtnClick,
            "size": "small",
            "class": classNames(`${prefixCls}-next-btn`, nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.className)
          }), {
            default: () => [isFunction(nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.children) ? nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.children() : isLastStep.value ? contextLocale.Finish : contextLocale.Next]
          })])])])]);
        }
      });
    };
  }
});
export default panelRender;