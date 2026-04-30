"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _util = require("../_util/util");
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _interface = require("./interface");
var _LocaleReceiver = _interopRequireDefault(require("../locale/LocaleReceiver"));
var _button = _interopRequireDefault(require("../button"));
var _en_US = _interopRequireDefault(require("../locale/en_US"));
const panelRender = (0, _vue.defineComponent)({
  name: 'ATourPanel',
  inheritAttrs: false,
  props: (0, _interface.tourStepProps)(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      current,
      total
    } = (0, _vue.toRefs)(props);
    const isLastStep = (0, _vue.computed)(() => current.value === total.value - 1);
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
        headerNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-header`
        }, [(0, _vue.createVNode)("div", {
          "class": `${prefixCls}-title`
        }, [title])]);
      }
      let descriptionNode;
      if (description) {
        descriptionNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-description`
        }, [description]);
      }
      let coverNode;
      if (cover) {
        coverNode = (0, _vue.createVNode)("div", {
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
        }).keys()].map((stepItem, index) => (0, _vue.createVNode)("span", {
          "key": stepItem,
          "class": (0, _classNames.default)(index === current.value && `${prefixCls}-indicator-active`, `${prefixCls}-indicator`)
        }, null));
      }
      const mainBtnType = stepType === 'primary' ? 'default' : 'primary';
      const secondaryBtnProps = {
        type: 'default',
        ghost: stepType === 'primary'
      };
      return (0, _vue.createVNode)(_LocaleReceiver.default, {
        "componentName": "Tour",
        "defaultLocale": _en_US.default.Tour
      }, {
        default: contextLocale => {
          var _a;
          return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
            "class": (0, _classNames.default)(stepType === 'primary' ? `${prefixCls}-primary` : '', attrs.class, `${prefixCls}-content`)
          }), [arrow && (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-arrow`,
            "key": "arrow"
          }, null), (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-inner`
          }, [(0, _vue.createVNode)(_CloseOutlined.default, {
            "class": `${prefixCls}-close`,
            "onClick": onClose
          }, null), coverNode, headerNode, descriptionNode, (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-footer`
          }, [total.value > 1 && (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-indicators`
          }, [mergeIndicatorNode]), (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-buttons`
          }, [current.value !== 0 ? (0, _vue.createVNode)(_button.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, secondaryBtnProps), prevButtonProps), {}, {
            "onClick": prevBtnClick,
            "size": "small",
            "class": (0, _classNames.default)(`${prefixCls}-prev-btn`, prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.className)
          }), {
            default: () => [(0, _util.isFunction)(prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.children) ? prevButtonProps.children() : (_a = prevButtonProps === null || prevButtonProps === void 0 ? void 0 : prevButtonProps.children) !== null && _a !== void 0 ? _a : contextLocale.Previous]
          }) : null, (0, _vue.createVNode)(_button.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
            "type": mainBtnType
          }, nextButtonProps), {}, {
            "onClick": nextBtnClick,
            "size": "small",
            "class": (0, _classNames.default)(`${prefixCls}-next-btn`, nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.className)
          }), {
            default: () => [(0, _util.isFunction)(nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.children) ? nextButtonProps === null || nextButtonProps === void 0 ? void 0 : nextButtonProps.children() : isLastStep.value ? contextLocale.Finish : contextLocale.Next]
          })])])])]);
        }
      });
    };
  }
});
var _default = exports.default = panelRender;