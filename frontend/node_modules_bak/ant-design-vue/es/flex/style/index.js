import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { alignItemsValues, flexWrapValues, justifyContentValues } from '../utils';
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
  flexWrapValues.forEach(value => {
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
  alignItemsValues.forEach(value => {
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
  justifyContentValues.forEach(value => {
    justifyStyle[`${componentCls}-justify-${value}`] = {
      justifyContent: value
    };
  });
  return justifyStyle;
};
export default genComponentStyleHook('Flex', token => {
  const flexToken = mergeToken(token, {
    flexGapSM: token.paddingXS,
    flexGap: token.padding,
    flexGapLG: token.paddingLG
  });
  return [genFlexStyle(flexToken), genFlexGapStyle(flexToken), genFlexWrapStyle(flexToken), genAlignItemsStyle(flexToken), genJustifyContentStyle(flexToken)];
});