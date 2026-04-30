"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _tinycolor = require("@ctrl/tinycolor");
var _internal = require("../../theme/internal");
var _style = require("../../style");
var _placementArrow = _interopRequireWildcard(require("../../style/placementArrow"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// =============================== Base ===============================
const genBaseStyle = token => {
  const {
    componentCls,
    lineHeight,
    padding,
    paddingXS,
    borderRadius,
    borderRadiusXS,
    colorPrimary,
    colorText,
    colorFill,
    indicatorHeight,
    indicatorWidth,
    boxShadowTertiary,
    tourZIndexPopup,
    fontSize,
    colorBgContainer,
    fontWeightStrong,
    marginXS,
    colorTextLightSolid,
    tourBorderRadius,
    colorWhite,
    colorBgTextHover,
    tourCloseSize,
    motionDurationSlow,
    antCls
  } = token;
  return [{
    [componentCls]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.resetComponent)(token)), {
      color: colorText,
      position: 'absolute',
      zIndex: tourZIndexPopup,
      display: 'block',
      visibility: 'visible',
      fontSize,
      lineHeight,
      width: 520,
      '--antd-arrow-background-color': colorBgContainer,
      '&-pure': {
        maxWidth: '100%',
        position: 'relative'
      },
      [`&${componentCls}-hidden`]: {
        display: 'none'
      },
      // ============================= panel content ============================
      [`${componentCls}-content`]: {
        position: 'relative'
      },
      [`${componentCls}-inner`]: {
        textAlign: 'start',
        textDecoration: 'none',
        borderRadius: tourBorderRadius,
        boxShadow: boxShadowTertiary,
        position: 'relative',
        backgroundColor: colorBgContainer,
        border: 'none',
        backgroundClip: 'padding-box',
        [`${componentCls}-close`]: {
          position: 'absolute',
          top: padding,
          insetInlineEnd: padding,
          color: token.colorIcon,
          outline: 'none',
          width: tourCloseSize,
          height: tourCloseSize,
          borderRadius: token.borderRadiusSM,
          transition: `background-color ${token.motionDurationMid}, color ${token.motionDurationMid}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            color: token.colorIconHover,
            backgroundColor: token.wireframe ? 'transparent' : token.colorFillContent
          }
        },
        [`${componentCls}-cover`]: {
          textAlign: 'center',
          padding: `${padding + tourCloseSize + paddingXS}px ${padding}px 0`,
          img: {
            width: '100%'
          }
        },
        [`${componentCls}-header`]: {
          padding: `${padding}px ${padding}px ${paddingXS}px`,
          [`${componentCls}-title`]: {
            lineHeight,
            fontSize,
            fontWeight: fontWeightStrong
          }
        },
        [`${componentCls}-description`]: {
          padding: `0 ${padding}px`,
          lineHeight,
          wordWrap: 'break-word'
        },
        [`${componentCls}-footer`]: {
          padding: `${paddingXS}px ${padding}px ${padding}px`,
          textAlign: 'end',
          borderRadius: `0 0 ${borderRadiusXS}px ${borderRadiusXS}px`,
          display: 'flex',
          [`${componentCls}-indicators`]: {
            display: 'inline-block',
            [`${componentCls}-indicator`]: {
              width: indicatorWidth,
              height: indicatorHeight,
              display: 'inline-block',
              borderRadius: '50%',
              background: colorFill,
              '&:not(:last-child)': {
                marginInlineEnd: indicatorHeight
              },
              '&-active': {
                background: colorPrimary
              }
            }
          },
          [`${componentCls}-buttons`]: {
            marginInlineStart: 'auto',
            [`${antCls}-btn`]: {
              marginInlineStart: marginXS
            }
          }
        }
      },
      // =============================  primary type  ===========================
      // `$` for panel, `&$` for pure panel
      [`${componentCls}-primary, &${componentCls}-primary`]: {
        '--antd-arrow-background-color': colorPrimary,
        [`${componentCls}-inner`]: {
          color: colorTextLightSolid,
          textAlign: 'start',
          textDecoration: 'none',
          backgroundColor: colorPrimary,
          borderRadius,
          boxShadow: boxShadowTertiary,
          [`${componentCls}-close`]: {
            color: colorTextLightSolid
          },
          [`${componentCls}-indicators`]: {
            [`${componentCls}-indicator`]: {
              background: new _tinycolor.TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
              '&-active': {
                background: colorTextLightSolid
              }
            }
          },
          [`${componentCls}-prev-btn`]: {
            color: colorTextLightSolid,
            borderColor: new _tinycolor.TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
            backgroundColor: colorPrimary,
            '&:hover': {
              backgroundColor: new _tinycolor.TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
              borderColor: 'transparent'
            }
          },
          [`${componentCls}-next-btn`]: {
            color: colorPrimary,
            borderColor: 'transparent',
            background: colorWhite,
            '&:hover': {
              background: new _tinycolor.TinyColor(colorBgTextHover).onBackground(colorWhite).toRgbString()
            }
          }
        }
      }
    }),
    // ============================= mask ===========================
    [`${componentCls}-mask`]: {
      [`${componentCls}-placeholder-animated`]: {
        transition: `all ${motionDurationSlow}`
      }
    },
    // =========== Limit left and right placement radius ==============
    [['&-placement-left', '&-placement-leftTop', '&-placement-leftBottom', '&-placement-right', '&-placement-rightTop', '&-placement-rightBottom'].join(',')]: {
      [`${componentCls}-inner`]: {
        borderRadius: Math.min(tourBorderRadius, _placementArrow.MAX_VERTICAL_CONTENT_RADIUS)
      }
    }
  },
  // ============================= Arrow ===========================
  (0, _placementArrow.default)(token, {
    colorBg: 'var(--antd-arrow-background-color)',
    contentRadius: tourBorderRadius,
    limitVerticalRadius: true
  })];
};
// ============================== Export ==============================
var _default = exports.default = (0, _internal.genComponentStyleHook)('Tour', token => {
  const {
    borderRadiusLG,
    fontSize,
    lineHeight
  } = token;
  const TourToken = (0, _internal.mergeToken)(token, {
    tourZIndexPopup: token.zIndexPopupBase + 70,
    indicatorWidth: 6,
    indicatorHeight: 6,
    tourBorderRadius: borderRadiusLG,
    tourCloseSize: fontSize * lineHeight
  });
  return [genBaseStyle(TourToken)];
});