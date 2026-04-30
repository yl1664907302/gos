"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _style = require("../../style");
const genListStyle = token => {
  const {
    componentCls,
    antCls,
    iconCls,
    fontSize,
    lineHeight
  } = token;
  const itemCls = `${componentCls}-list-item`;
  const actionsCls = `${itemCls}-actions`;
  const actionCls = `${itemCls}-action`;
  const listItemHeightSM = Math.round(fontSize * lineHeight);
  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-list`]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.clearFix)()), {
        lineHeight: token.lineHeight,
        [itemCls]: {
          position: 'relative',
          height: token.lineHeight * fontSize,
          marginTop: token.marginXS,
          fontSize,
          display: 'flex',
          alignItems: 'center',
          transition: `background-color ${token.motionDurationSlow}`,
          '&:hover': {
            backgroundColor: token.controlItemBgHover
          },
          [`${itemCls}-name`]: (0, _extends2.default)((0, _extends2.default)({}, _style.textEllipsis), {
            padding: `0 ${token.paddingXS}px`,
            lineHeight,
            flex: 'auto',
            transition: `all ${token.motionDurationSlow}`
          }),
          [actionsCls]: {
            [actionCls]: {
              opacity: 0
            },
            [`${actionCls}${antCls}-btn-sm`]: {
              height: listItemHeightSM,
              border: 0,
              lineHeight: 1,
              // FIXME: should not override small button
              '> span': {
                transform: 'scale(1)'
              }
            },
            [`
              ${actionCls}:focus,
              &.picture ${actionCls}
            `]: {
              opacity: 1
            },
            [iconCls]: {
              color: token.colorTextDescription,
              transition: `all ${token.motionDurationSlow}`
            },
            [`&:hover ${iconCls}`]: {
              color: token.colorText
            }
          },
          [`${componentCls}-icon ${iconCls}`]: {
            color: token.colorTextDescription,
            fontSize
          },
          [`${itemCls}-progress`]: {
            position: 'absolute',
            bottom: -token.uploadProgressOffset,
            width: '100%',
            paddingInlineStart: fontSize + token.paddingXS,
            fontSize,
            lineHeight: 0,
            pointerEvents: 'none',
            '> div': {
              margin: 0
            }
          }
        },
        [`${itemCls}:hover ${actionCls}`]: {
          opacity: 1,
          color: token.colorText
        },
        [`${itemCls}-error`]: {
          color: token.colorError,
          [`${itemCls}-name, ${componentCls}-icon ${iconCls}`]: {
            color: token.colorError
          },
          [actionsCls]: {
            [`${iconCls}, ${iconCls}:hover`]: {
              color: token.colorError
            },
            [actionCls]: {
              opacity: 1
            }
          }
        },
        [`${componentCls}-list-item-container`]: {
          transition: `opacity ${token.motionDurationSlow}, height ${token.motionDurationSlow}`,
          // For smooth removing animation
          '&::before': {
            display: 'table',
            width: 0,
            height: 0,
            content: '""'
          }
        }
      })
    }
  };
};
var _default = exports.default = genListStyle;