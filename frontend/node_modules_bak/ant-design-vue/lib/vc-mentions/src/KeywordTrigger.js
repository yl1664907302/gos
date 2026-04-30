"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vcTrigger = _interopRequireDefault(require("../../vc-trigger"));
var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));
const BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  bottomLeft: {
    points: ['tr', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['br', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'KeywordTrigger',
  props: {
    loading: {
      type: Boolean,
      default: undefined
    },
    options: {
      type: Array,
      default: () => []
    },
    prefixCls: String,
    placement: String,
    visible: {
      type: Boolean,
      default: undefined
    },
    transitionName: String,
    getPopupContainer: Function,
    direction: String,
    dropdownClassName: String
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const getDropdownPrefix = () => {
      return `${props.prefixCls}-dropdown`;
    };
    const getDropdownElement = () => {
      const {
        options
      } = props;
      return (0, _vue.createVNode)(_DropdownMenu.default, {
        "prefixCls": getDropdownPrefix(),
        "options": options
      }, {
        notFoundContent: slots.notFoundContent,
        option: slots.option
      });
    };
    const popupPlacement = (0, _vue.computed)(() => {
      const {
        placement,
        direction
      } = props;
      let popupPlacement = 'topRight';
      if (direction === 'rtl') {
        popupPlacement = placement === 'top' ? 'topLeft' : 'bottomLeft';
      } else {
        popupPlacement = placement === 'top' ? 'topRight' : 'bottomRight';
      }
      return popupPlacement;
    });
    return () => {
      const {
        visible,
        transitionName,
        getPopupContainer
      } = props;
      return (0, _vue.createVNode)(_vcTrigger.default, {
        "prefixCls": getDropdownPrefix(),
        "popupVisible": visible,
        "popup": getDropdownElement(),
        "popupClassName": props.dropdownClassName,
        "popupPlacement": popupPlacement.value,
        "popupTransitionName": transitionName,
        "builtinPlacements": BUILT_IN_PLACEMENTS,
        "getPopupContainer": getPopupContainer
      }, {
        default: slots.default
      });
    };
  }
});