"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _internal = require("../../theme/internal");
var _mixins = require("./mixins");
var _style = require("../../style");
const genTypographyStyle = token => {
  const {
    componentCls,
    sizeMarginHeadingVerticalStart
  } = token;
  return {
    [componentCls]: (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
      color: token.colorText,
      wordBreak: 'break-word',
      lineHeight: token.lineHeight,
      [`&${componentCls}-secondary`]: {
        color: token.colorTextDescription
      },
      [`&${componentCls}-success`]: {
        color: token.colorSuccess
      },
      [`&${componentCls}-warning`]: {
        color: token.colorWarning
      },
      [`&${componentCls}-danger`]: {
        color: token.colorError,
        'a&:active, a&:focus': {
          color: token.colorErrorActive
        },
        'a&:hover': {
          color: token.colorErrorHover
        }
      },
      [`&${componentCls}-disabled`]: {
        color: token.colorTextDisabled,
        cursor: 'not-allowed',
        userSelect: 'none'
      },
      [`
        div&,
        p
      `]: {
        marginBottom: '1em'
      }
    }, (0, _mixins.getTitleStyles)(token)), {
      [`
      & + h1${componentCls},
      & + h2${componentCls},
      & + h3${componentCls},
      & + h4${componentCls},
      & + h5${componentCls}
      `]: {
        marginTop: sizeMarginHeadingVerticalStart
      },
      [`
      div,
      ul,
      li,
      p,
      h1,
      h2,
      h3,
      h4,
      h5`]: {
        [`
        + h1,
        + h2,
        + h3,
        + h4,
        + h5
        `]: {
          marginTop: sizeMarginHeadingVerticalStart
        }
      }
    }), (0, _mixins.getResetStyles)()), (0, _mixins.getLinkStyles)(token)), {
      // Operation
      [`
        ${componentCls}-expand,
        ${componentCls}-edit,
        ${componentCls}-copy
      `]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.operationUnit)(token)), {
        marginInlineStart: token.marginXXS
      })
    }), (0, _mixins.getEditableStyles)(token)), (0, _mixins.getCopiableStyles)(token)), (0, _mixins.getEllipsisStyles)()), {
      '&-rtl': {
        direction: 'rtl'
      }
    })
  };
};
// ============================== Export ==============================
var _default = exports.default = (0, _internal.genComponentStyleHook)('Typography', token => [genTypographyStyle(token)], {
  sizeMarginHeadingVerticalStart: '1.2em',
  sizeMarginHeadingVerticalEnd: '0.5em'
});