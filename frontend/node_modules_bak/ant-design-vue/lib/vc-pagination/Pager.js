"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Pager',
  inheritAttrs: false,
  props: {
    rootPrefixCls: String,
    page: Number,
    active: {
      type: Boolean,
      default: undefined
    },
    last: {
      type: Boolean,
      default: undefined
    },
    locale: _vueTypes.default.object,
    showTitle: {
      type: Boolean,
      default: undefined
    },
    itemRender: {
      type: Function,
      default: () => {}
    },
    onClick: {
      type: Function
    },
    onKeypress: {
      type: Function
    }
  },
  eimt: ['click', 'keypress'],
  setup(props, _ref) {
    let {
      emit,
      attrs
    } = _ref;
    const handleClick = () => {
      emit('click', props.page);
    };
    const handleKeyPress = event => {
      emit('keypress', event, handleClick, props.page);
    };
    return () => {
      const {
        showTitle,
        page,
        itemRender
      } = props;
      const {
        class: _cls,
        style
      } = attrs;
      const prefixCls = `${props.rootPrefixCls}-item`;
      const cls = (0, _classNames.default)(prefixCls, `${prefixCls}-${props.page}`, {
        [`${prefixCls}-active`]: props.active,
        [`${prefixCls}-disabled`]: !props.page
      }, _cls);
      return (0, _vue.createVNode)("li", {
        "onClick": handleClick,
        "onKeypress": handleKeyPress,
        "title": showTitle ? String(page) : null,
        "tabindex": "0",
        "class": cls,
        "style": style
      }, [itemRender({
        page,
        type: 'page',
        originalElement: (0, _vue.createVNode)("a", {
          "rel": "nofollow"
        }, [page])
      })]);
    };
  }
});