"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _internal = require("../../theme/internal");
var _utils = require("../utils");
const genFlexStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      display: 'flex',
      '&-vertical': {
        flexDirection: 'column'
      },
      '&-rtl': {
        direction: 'rtl'
      },
      '&:empty': {
        display: 'none'
      }
    }
  };
};
const genFlexGapStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      '&-gap-small': {
        gap: token.flexGapSM
      },
      '&-gap-middle': {
        gap: token.flexGap
      },
      '&-gap-large': {
        gap: token.flexGapLG
      }
    }
  };
};
const genFlexWrapStyle = token => {
  const {
    componentCls
  } = token;
  const wrapStyle = {};
  _utils.flexWrapValues.forEach(value => {
    wrapStyle[`${componentCls}-wrap-${value}`] = {
      flexWrap: value
    };
  });
  return wrapStyle;
};
const genAlignItemsStyle = token => {
  const {
    componentCls
  } = token;
  const alignStyle = {};
  _utils.alignItemsValues.forEach(value => {
    alignStyle[`${componentCls}-align-${value}`] = {
      alignItems: value
    };
  });
  return alignStyle;
};
const genJustifyContentStyle = token => {
  const {
    componentCls
  } = token;
  const justifyStyle = {};
  _utils.justifyContentValues.forEach(value => {
    justifyStyle[`${componentCls}-justify-${value}`] = {
      justifyContent: value
    };
  });
  return justifyStyle;
};
var _default = exports.default = (0, _internal.genComponentStyleHook)('Flex', token => {
  const flexToken = (0, _internal.mergeToken)(token, {
    flexGapSM: token.paddingXS,
    flexGap: token.padding,
    flexGapLG: token.paddingLG
  });
  return [genFlexStyle(flexToken), genFlexGapStyle(flexToken), genFlexWrapStyle(flexToken), genAlignItemsStyle(flexToken), genJustifyContentStyle(flexToken)];
});