import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode, Fragment as _Fragment } from "vue";
import Col from '../grid/Col';
import { useProvideForm, useInjectForm, useProvideFormItemPrefix } from './context';
import ErrorList from './ErrorList';
import classNames from '../_util/classNames';
import { computed, defineComponent } from 'vue';
import { filterEmpty } from '../_util/props-util';
const FormItemInput = defineComponent({
  compatConfig: {
    MODE: 3
  },
  slots: Object,
  inheritAttrs: false,
  props: ['prefixCls', 'errors', 'hasFeedback', 'onDomErrorVisibleChange', 'wrapperCol', 'help', 'extra', 'status', 'marginBottom', 'onErrorVisibleChanged'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const formContext = useInjectForm();
    const {
      wrapperCol: contextWrapperCol
    } = formContext;
    // Pass to sub FormItem should not with col info
    const subFormContext = _extends({}, formContext);
    delete subFormContext.labelCol;
    delete subFormContext.wrapperCol;
    useProvideForm(subFormContext);
    useProvideFormItemPrefix({
      prefixCls: computed(() => props.prefixCls),
      status: computed(() => props.status)
    });
    return () => {
      var _a, _b, _c;
      const {
        prefixCls,
        wrapperCol,
        marginBottom,
        onErrorVisibleChanged,
        help = (_a = slots.help) === null || _a === void 0 ? void 0 : _a.call(slots),
        errors = filterEmpty((_b = slots.errors) === null || _b === void 0 ? void 0 : _b.call(slots)),
        // hasFeedback,
        // status,
        extra = (_c = slots.extra) === null || _c === void 0 ? void 0 : _c.call(slots)
      } = props;
      const baseClassName = `${prefixCls}-item`;
      const mergedWrapperCol = wrapperCol || (contextWrapperCol === null || contextWrapperCol === void 0 ? void 0 : contextWrapperCol.value) || {};
      const className = classNames(`${baseClassName}-control`, mergedWrapperCol.class);
      // Should provides additional icon if `hasFeedback`
      // const IconNode = status && iconMap[status];
      return _createVNode(Col, _objectSpread(_objectSpread({}, mergedWrapperCol), {}, {
        "class": className
      }), {
        default: () => {
          var _a;
          return _createVNode(_Fragment, null, [_createVNode("div", {
            "class": `${baseClassName}-control-input`
          }, [_createVNode("div", {
            "class": `${baseClassName}-control-input-content`
          }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]), marginBottom !== null || errors.length ? _createVNode("div", {
            "style": {
              display: 'flex',
              flexWrap: 'nowrap'
            }
          }, [_createVNode(ErrorList, {
            "errors": errors,
            "help": help,
            "class": `${baseClassName}-explain-connected`,
            "onErrorVisibleChanged": onErrorVisibleChanged
          }, null), !!marginBottom && _createVNode("div", {
            "style": {
              width: 0,
              height: `${marginBottom}px`
            }
          }, null)]) : null, extra ? _createVNode("div", {
            "class": `${baseClassName}-extra`
          }, [extra]) : null]);
        }
      });
    };
  }
});
export default FormItemInput;