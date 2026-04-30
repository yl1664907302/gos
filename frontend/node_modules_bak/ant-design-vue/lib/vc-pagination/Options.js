"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _KeyCode = _interopRequireDefault(require("./KeyCode"));
var _BaseInput = _interopRequireDefault(require("../_util/BaseInput"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  props: {
    disabled: {
      type: Boolean,
      default: undefined
    },
    changeSize: Function,
    quickGo: Function,
    selectComponentClass: _vueTypes.default.any,
    current: Number,
    pageSizeOptions: _vueTypes.default.array.def(['10', '20', '50', '100']),
    pageSize: Number,
    buildOptionText: Function,
    locale: _vueTypes.default.object,
    rootPrefixCls: String,
    selectPrefixCls: String,
    goButton: _vueTypes.default.any
  },
  setup(props) {
    const goInputText = (0, _vue.ref)('');
    const validValue = (0, _vue.computed)(() => {
      return !goInputText.value || isNaN(goInputText.value) ? undefined : Number(goInputText.value);
    });
    const defaultBuildOptionText = opt => {
      return `${opt.value} ${props.locale.items_per_page}`;
    };
    const handleChange = e => {
      const {
        value
      } = e.target;
      if (goInputText.value === value) return;
      goInputText.value = value;
    };
    const handleBlur = e => {
      const {
        goButton,
        quickGo,
        rootPrefixCls
      } = props;
      if (goButton || goInputText.value === '') {
        return;
      }
      if (e.relatedTarget && (e.relatedTarget.className.indexOf(`${rootPrefixCls}-item-link`) >= 0 || e.relatedTarget.className.indexOf(`${rootPrefixCls}-item`) >= 0)) {
        goInputText.value = '';
        return;
      } else {
        quickGo(validValue.value);
        goInputText.value = '';
      }
    };
    const go = e => {
      if (goInputText.value === '') {
        return;
      }
      if (e.keyCode === _KeyCode.default.ENTER || e.type === 'click') {
        // https://github.com/vueComponent/ant-design-vue/issues/1316
        props.quickGo(validValue.value);
        goInputText.value = '';
      }
    };
    const pageSizeOptions = (0, _vue.computed)(() => {
      const {
        pageSize,
        pageSizeOptions
      } = props;
      if (pageSizeOptions.some(option => option.toString() === pageSize.toString())) {
        return pageSizeOptions;
      }
      return pageSizeOptions.concat([pageSize.toString()]).sort((a, b) => {
        // eslint-disable-next-line no-restricted-globals
        const numberA = isNaN(Number(a)) ? 0 : Number(a);
        // eslint-disable-next-line no-restricted-globals
        const numberB = isNaN(Number(b)) ? 0 : Number(b);
        return numberA - numberB;
      });
    });
    return () => {
      const {
        rootPrefixCls,
        locale,
        changeSize,
        quickGo,
        goButton,
        selectComponentClass: Select,
        selectPrefixCls,
        pageSize,
        disabled
      } = props;
      const prefixCls = `${rootPrefixCls}-options`;
      let changeSelect = null;
      let goInput = null;
      let gotoButton = null;
      if (!changeSize && !quickGo) {
        return null;
      }
      if (changeSize && Select) {
        const buildOptionText = props.buildOptionText || defaultBuildOptionText;
        const options = pageSizeOptions.value.map((opt, i) => (0, _vue.createVNode)(Select.Option, {
          "key": i,
          "value": opt
        }, {
          default: () => [buildOptionText({
            value: opt
          })]
        }));
        changeSelect = (0, _vue.createVNode)(Select, {
          "disabled": disabled,
          "prefixCls": selectPrefixCls,
          "showSearch": false,
          "class": `${prefixCls}-size-changer`,
          "optionLabelProp": "children",
          "value": (pageSize || pageSizeOptions.value[0]).toString(),
          "onChange": value => changeSize(Number(value)),
          "getPopupContainer": triggerNode => triggerNode.parentNode
        }, {
          default: () => [options]
        });
      }
      if (quickGo) {
        if (goButton) {
          gotoButton = typeof goButton === 'boolean' ? (0, _vue.createVNode)("button", {
            "type": "button",
            "onClick": go,
            "onKeyup": go,
            "disabled": disabled,
            "class": `${prefixCls}-quick-jumper-button`
          }, [locale.jump_to_confirm]) : (0, _vue.createVNode)("span", {
            "onClick": go,
            "onKeyup": go
          }, [goButton]);
        }
        goInput = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-quick-jumper`
        }, [locale.jump_to, (0, _vue.createVNode)(_BaseInput.default, {
          "disabled": disabled,
          "type": "text",
          "value": goInputText.value,
          "onInput": handleChange,
          "onChange": handleChange,
          "onKeyup": go,
          "onBlur": handleBlur
        }, null), locale.page, gotoButton]);
      }
      return (0, _vue.createVNode)("li", {
        "class": `${prefixCls}`
      }, [changeSelect, goInput]);
    };
  }
});