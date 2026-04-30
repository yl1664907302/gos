import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
import { defineComponent } from 'vue';
import classNames from '../../_util/classNames';
import { tourStepProps } from '../interface';
const DefaultPanel = defineComponent({
  name: 'DefaultPanel',
  inheritAttrs: false,
  props: tourStepProps(),
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    return () => {
      const {
        prefixCls,
        current,
        total,
        title,
        description,
        onClose,
        onPrev,
        onNext,
        onFinish
      } = props;
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": classNames(`${prefixCls}-content`, attrs.class)
      }), [_createVNode("div", {
        "class": `${prefixCls}-inner`
      }, [_createVNode("button", {
        "type": "button",
        "onClick": onClose,
        "aria-label": "Close",
        "class": `${prefixCls}-close`
      }, [_createVNode("span", {
        "class": `${prefixCls}-close-x`
      }, [_createTextVNode("\xD7")])]), _createVNode("div", {
        "class": `${prefixCls}-header`
      }, [_createVNode("div", {
        "class": `${prefixCls}-title`
      }, [title])]), _createVNode("div", {
        "class": `${prefixCls}-description`
      }, [description]), _createVNode("div", {
        "class": `${prefixCls}-footer`
      }, [_createVNode("div", {
        "class": `${prefixCls}-sliders`
      }, [total > 1 ? [...Array.from({
        length: total
      }).keys()].map((item, index) => {
        return _createVNode("span", {
          "key": item,
          "class": index === current ? 'active' : ''
        }, null);
      }) : null]), _createVNode("div", {
        "class": `${prefixCls}-buttons`
      }, [current !== 0 ? _createVNode("button", {
        "class": `${prefixCls}-prev-btn`,
        "onClick": onPrev
      }, [_createTextVNode("Prev")]) : null, current === total - 1 ? _createVNode("button", {
        "class": `${prefixCls}-finish-btn`,
        "onClick": onFinish
      }, [_createTextVNode("Finish")]) : _createVNode("button", {
        "class": `${prefixCls}-next-btn`,
        "onClick": onNext
      }, [_createTextVNode("Next")])])])])]);
    };
  }
});
export default DefaultPanel;