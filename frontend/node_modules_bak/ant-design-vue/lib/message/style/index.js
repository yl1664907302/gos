"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _cssinjs = require("../../_util/cssinjs");
var _internal = require("../../theme/internal");
var _style = require("../../style");
// deps-lint-skip-all

const genMessageStyle = token => {
  const {
    componentCls,
    iconCls,
    boxShadowSecondary,
    colorBgElevated,
    colorSuccess,
    colorError,
    colorWarning,
    colorInfo,
    fontSizeLG,
    motionEaseInOutCirc,
    motionDurationSlow,
    marginXS,
    paddingXS,
    borderRadiusLG,
    zIndexPopup,
    // Custom token
    messageNoticeContentPadding
  } = token;
  const messageMoveIn = new _cssinjs.Keyframes('MessageMoveIn', {
    '0%': {
      padding: 0,
      transform: 'translateY(-100%)',
      opacity: 0
    },
    '100%': {
      padding: paddingXS,
      transform: 'translateY(0)',
      opacity: 1
    }
  });
  const messageMoveOut = new _cssinjs.Keyframes('MessageMoveOut', {
    '0%': {
      maxHeight: token.height,
      padding: paddingXS,
      opacity: 1
    },
    '100%': {
      maxHeight: 0,
      padding: 0,
      opacity: 0
    }
  });
  return [
  // ============================ Holder ============================
  {
    [componentCls]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.resetComponent)(token)), {
      position: 'fixed',
      top: marginXS,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      pointerEvents: 'none',
      zIndex: zIndexPopup,
      [`${componentCls}-move-up`]: {
        animationFillMode: 'forwards'
      },
      [`
        ${componentCls}-move-up-appear,
        ${componentCls}-move-up-enter
      `]: {
        animationName: messageMoveIn,
        animationDuration: motionDurationSlow,
        animationPlayState: 'paused',
        animationTimingFunction: motionEaseInOutCirc
      },
      [`
        ${componentCls}-move-up-appear${componentCls}-move-up-appear-active,
        ${componentCls}-move-up-enter${componentCls}-move-up-enter-active
      `]: {
        animationPlayState: 'running'
      },
      [`${componentCls}-move-up-leave`]: {
        animationName: messageMoveOut,
        animationDuration: motionDurationSlow,
        animationPlayState: 'paused',
        animationTimingFunction: motionEaseInOutCirc
      },
      [`${componentCls}-move-up-leave${componentCls}-move-up-leave-active`]: {
        animationPlayState: 'running'
      },
      '&-rtl': {
        direction: 'rtl',
        span: {
          direction: 'rtl'
        }
      }
    })
  },
  // ============================ Notice ============================
  {
    [`${componentCls}-notice`]: {
      padding: paddingXS,
      textAlign: 'center',
      [iconCls]: {
        verticalAlign: 'text-bottom',
        marginInlineEnd: marginXS,
        fontSize: fontSizeLG
      },
      [`${componentCls}-notice-content`]: {
        display: 'inline-block',
        padding: messageNoticeContentPadding,
        background: colorBgElevated,
        borderRadius: borderRadiusLG,
        boxShadow: boxShadowSecondary,
        pointerEvents: 'all'
      },
      [`${componentCls}-success ${iconCls}`]: {
        color: colorSuccess
      },
      [`${componentCls}-error ${iconCls}`]: {
        color: colorError
      },
      [`${componentCls}-warning ${iconCls}`]: {
        color: colorWarning
      },
      [`
        ${componentCls}-info ${iconCls},
        ${componentCls}-loading ${iconCls}`]: {
        color: colorInfo
      }
    }
  },
  // ============================= Pure =============================
  {
    [`${componentCls}-notice-pure-panel`]: {
      padding: 0,
      textAlign: 'start'
    }
  }];
};
// ============================== Export ==============================
var _default = exports.default = (0, _internal.genComponentStyleHook)('Message', token => {
  // Gen-style functions here
  const combinedToken = (0, _internal.mergeToken)(token, {
    messageNoticeContentPadding: `${(token.controlHeightLG - token.fontSize * token.lineHeight) / 2}px ${token.paddingSM}px`
  });
  return [genMessageStyle(combinedToken)];
}, token => ({
  height: 150,
  zIndexPopup: token.zIndexPopupBase + 10
}));