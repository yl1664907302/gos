"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _internal = require("../../theme/internal");
var _style = require("../../style");
const genPageHeaderStyle = token => {
  const {
    componentCls,
    antCls
  } = token;
  return {
    [componentCls]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.resetComponent)(token)), {
      position: 'relative',
      padding: `${token.pageHeaderPaddingVertical}px ${token.pageHeaderPadding}px`,
      backgroundColor: token.colorBgContainer,
      [`&${componentCls}-ghost`]: {
        backgroundColor: token.pageHeaderGhostBg
      },
      [`&.has-footer`]: {
        paddingBottom: 0
      },
      [`${componentCls}-back`]: {
        marginRight: token.marginMD,
        fontSize: token.fontSizeLG,
        lineHeight: 1,
        [`&-button`]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.operationUnit)(token)), {
          color: token.pageHeaderBackColor,
          cursor: 'pointer'
        })
      },
      [`${antCls}-divider-vertical`]: {
        height: '14px',
        margin: `0 ${token.marginSM}`,
        verticalAlign: 'middle'
      },
      [`${antCls}-breadcrumb + &-heading`]: {
        marginTop: token.marginXS
      },
      [`${componentCls}-heading`]: {
        display: 'flex',
        justifyContent: 'space-between',
        [`&-left`]: {
          display: 'flex',
          alignItems: 'center',
          margin: `${token.marginXS / 2}px 0`,
          overflow: 'hidden'
        },
        [`&-title`]: (0, _extends2.default)({
          marginRight: token.marginSM,
          marginBottom: 0,
          color: token.colorTextHeading,
          fontWeight: 600,
          fontSize: token.pageHeaderHeadingTitle,
          lineHeight: `${token.controlHeight}px`
        }, _style.textEllipsis),
        [`${antCls}-avatar`]: {
          marginRight: token.marginSM
        },
        [`&-sub-title`]: (0, _extends2.default)({
          marginRight: token.marginSM,
          color: token.colorTextDescription,
          fontSize: token.pageHeaderHeadingSubTitle,
          lineHeight: token.lineHeight
        }, _style.textEllipsis),
        [`&-extra`]: {
          margin: `${token.marginXS / 2}px 0`,
          whiteSpace: 'nowrap',
          [`> *`]: {
            marginLeft: token.marginSM,
            whiteSpace: 'unset'
          },
          [`> *:first-child`]: {
            marginLeft: 0
          }
        }
      },
      [`${componentCls}-content`]: {
        paddingTop: token.pageHeaderContentPaddingVertical
      },
      [`${componentCls}-footer`]: {
        marginTop: token.marginMD,
        [`${antCls}-tabs`]: {
          [`> ${antCls}-tabs-nav`]: {
            margin: 0,
            [`&::before`]: {
              border: 'none'
            }
          },
          [`${antCls}-tabs-tab`]: {
            paddingTop: token.paddingXS,
            paddingBottom: token.paddingXS,
            fontSize: token.pageHeaderTabFontSize
          }
        }
      },
      [`${componentCls}-compact ${componentCls}-heading`]: {
        flexWrap: 'wrap'
      },
      // rtl style
      [`&${token.componentCls}-rtl`]: {
        direction: 'rtl'
      }
    })
  };
};
// ============================== Export ==============================
var _default = exports.default = (0, _internal.genComponentStyleHook)('PageHeader', token => {
  const PageHeaderToken = (0, _internal.mergeToken)(token, {
    pageHeaderPadding: token.paddingLG,
    pageHeaderPaddingVertical: token.paddingMD,
    pageHeaderPaddingBreadcrumb: token.paddingSM,
    pageHeaderContentPaddingVertical: token.paddingSM,
    pageHeaderBackColor: token.colorTextBase,
    pageHeaderGhostBg: 'transparent',
    pageHeaderHeadingTitle: token.fontSizeHeading4,
    pageHeaderHeadingSubTitle: token.fontSize,
    pageHeaderTabFontSize: token.fontSizeLG
  });
  return [genPageHeaderStyle(PageHeaderToken)];
});