import _extends from "@babel/runtime/helpers/esm/extends";
import { genCollapseMotion } from '../../style/motion';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, resetIcon } from '../../style';
export const genBaseStyle = token => {
  const {
    componentCls,
    collapseContentBg,
    padding,
    collapseContentPaddingHorizontal,
    collapseHeaderBg,
    collapseHeaderPadding,
    collapsePanelBorderRadius,
    lineWidth,
    lineType,
    colorBorder,
    colorText,
    colorTextHeading,
    colorTextDisabled,
    fontSize,
    lineHeight,
    marginSM,
    paddingSM,
    motionDurationSlow,
    fontSizeIcon
  } = token;
  const borderBase = `${lineWidth}px ${lineType} ${colorBorder}`;
  return {
    [componentCls]: _extends(_extends({}, resetComponent(token)), {
      backgroundColor: collapseHeaderBg,
      border: borderBase,
      borderBottom: 0,
      borderRadius: `${collapsePanelBorderRadius}px`,
      [`&-rtl`]: {
        direction: 'rtl'
      },
      [`& > ${componentCls}-item`]: {
        borderBottom: borderBase,
        [`&:last-child`]: {
          [`
            &,
            & > ${componentCls}-header`]: {
            borderRadius: `0 0 ${collapsePanelBorderRadius}px ${collapsePanelBorderRadius}px`
          }
        },
        [`> ${componentCls}-header`]: {
          position: 'relative',
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          padding: collapseHeaderPadding,
          color: colorTextHeading,
          lineHeight,
          cursor: 'pointer',
          transition: `all ${motionDurationSlow}, visibility 0s`,
          [`> ${componentCls}-header-text`]: {
            flex: 'auto'
          },
          '&:focus': {
            outline: 'none'
          },
          // >>>>> Arrow
          [`${componentCls}-expand-icon`]: {
            height: fontSize * lineHeight,
            display: 'flex',
            alignItems: 'center',
            paddingInlineEnd: marginSM
          },
          [`${componentCls}-arrow`]: _extends(_extends({}, resetIcon()), {
            fontSize: fontSizeIcon,
            svg: {
              transition: `transform ${motionDurationSlow}`
            }
          }),
          // >>>>> Text
          [`${componentCls}-header-text`]: {
            marginInlineEnd: 'auto'
          }
        },
        [`${componentCls}-header-collapsible-only`]: {
          cursor: 'default',
          [`${componentCls}-header-text`]: {
            flex: 'none',
            cursor: 'pointer'
          },
          [`${componentCls}-expand-icon`]: {
            cursor: 'pointer'
          }
        },
        [`${componentCls}-icon-collapsible-only`]: {
          cursor: 'default',
          [`${componentCls}-expand-icon`]: {
            cursor: 'pointer'
          }
        },
        [`&${componentCls}-no-arrow`]: {
          [`> ${componentCls}-header`]: {
            paddingInlineStart: paddingSM
          }
        }
      },
      [`${componentCls}-content`]: {
        color: colorText,
        backgroundColor: collapseContentBg,
        borderTop: borderBase,
        [`& > ${componentCls}-content-box`]: {
          padding: `${padding}px ${collapseContentPaddingHorizontal}px`
        },
        [`&-hidden`]: {
          display: 'none'
        }
      },
      [`${componentCls}-item:last-child`]: {
        [`> ${componentCls}-content`]: {
          borderRadius: `0 0 ${collapsePanelBorderRadius}px ${collapsePanelBorderRadius}px`
        }
      },
      [`& ${componentCls}-item-disabled > ${componentCls}-header`]: {
        [`
          &,
          & > .arrow
        `]: {
          color: colorTextDisabled,
          cursor: 'not-allowed'
        }
      },
      // ========================== Icon Position ==========================
      [`&${componentCls}-icon-position-end`]: {
        [`& > ${componentCls}-item`]: {
          [`> ${componentCls}-header`]: {
            [`${componentCls}-expand-icon`]: {
              order: 1,
              paddingInlineEnd: 0,
              paddingInlineStart: marginSM
            }
          }
        }
      }
    })
  };
};
const genArrowStyle = token => {
  const {
    componentCls
  } = token;
  const fixedSelector = `> ${componentCls}-item > ${componentCls}-header ${componentCls}-arrow svg`;
  return {
    [`${componentCls}-rtl`]: {
      [fixedSelector]: {
        transform: `rotate(180deg)`
      }
    }
  };
};
const genBorderlessStyle = token => {
  const {
    componentCls,
    collapseHeaderBg,
    paddingXXS,
    colorBorder
  } = token;
  return {
    [`${componentCls}-borderless`]: {
      backgroundColor: collapseHeaderBg,
      border: 0,
      [`> ${componentCls}-item`]: {
        borderBottom: `1px solid ${colorBorder}`
      },
      [`
        > ${componentCls}-item:last-child,
        > ${componentCls}-item:last-child ${componentCls}-header
      `]: {
        borderRadius: 0
      },
      [`> ${componentCls}-item:last-child`]: {
        borderBottom: 0
      },
      [`> ${componentCls}-item > ${componentCls}-content`]: {
        backgroundColor: 'transparent',
        borderTop: 0
      },
      [`> ${componentCls}-item > ${componentCls}-content > ${componentCls}-content-box`]: {
        paddingTop: paddingXXS
      }
    }
  };
};
const genGhostStyle = token => {
  const {
    componentCls,
    paddingSM
  } = token;
  return {
    [`${componentCls}-ghost`]: {
      backgroundColor: 'transparent',
      border: 0,
      [`> ${componentCls}-item`]: {
        borderBottom: 0,
        [`> ${componentCls}-content`]: {
          backgroundColor: 'transparent',
          border: 0,
          [`> ${componentCls}-content-box`]: {
            paddingBlock: paddingSM
          }
        }
      }
    }
  };
};
export default genComponentStyleHook('Collapse', token => {
  const collapseToken = mergeToken(token, {
    collapseContentBg: token.colorBgContainer,
    collapseHeaderBg: token.colorFillAlter,
    collapseHeaderPadding: `${token.paddingSM}px ${token.padding}px`,
    collapsePanelBorderRadius: token.borderRadiusLG,
    collapseContentPaddingHorizontal: 16 // Fixed value
  });
  return [genBaseStyle(collapseToken), genBorderlessStyle(collapseToken), genGhostStyle(collapseToken), genArrowStyle(collapseToken), genCollapseMotion(collapseToken)];
});