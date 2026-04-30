"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _tinycolor = require("@ctrl/tinycolor");
var _internal = require("../../theme/internal");
var _bordered = _interopRequireDefault(require("./bordered"));
var _ellipsis = _interopRequireDefault(require("./ellipsis"));
var _empty = _interopRequireDefault(require("./empty"));
var _expand = _interopRequireDefault(require("./expand"));
var _filter = _interopRequireDefault(require("./filter"));
var _fixed = _interopRequireDefault(require("./fixed"));
var _pagination = _interopRequireDefault(require("./pagination"));
var _radius = _interopRequireDefault(require("./radius"));
var _rtl = _interopRequireDefault(require("./rtl"));
var _selection = _interopRequireDefault(require("./selection"));
var _size = _interopRequireDefault(require("./size"));
var _resize = _interopRequireDefault(require("./resize"));
var _sorter = _interopRequireDefault(require("./sorter"));
var _sticky = _interopRequireDefault(require("./sticky"));
var _summary = _interopRequireDefault(require("./summary"));
var _style = require("../../style");
const genTableStyle = token => {
  const {
    componentCls,
    fontWeightStrong,
    tablePaddingVertical,
    tablePaddingHorizontal,
    lineWidth,
    lineType,
    tableBorderColor,
    tableFontSize,
    tableBg,
    tableRadius,
    tableHeaderTextColor,
    motionDurationMid,
    tableHeaderBg,
    tableHeaderCellSplitColor,
    tableRowHoverBg,
    tableSelectedRowBg,
    tableSelectedRowHoverBg,
    tableFooterTextColor,
    tableFooterBg,
    paddingContentVerticalLG
  } = token;
  const tableBorder = `${lineWidth}px ${lineType} ${tableBorderColor}`;
  return {
    [`${componentCls}-wrapper`]: (0, _extends2.default)((0, _extends2.default)({
      clear: 'both',
      maxWidth: '100%'
    }, (0, _style.clearFix)()), {
      [componentCls]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.resetComponent)(token)), {
        fontSize: tableFontSize,
        background: tableBg,
        borderRadius: `${tableRadius}px ${tableRadius}px 0 0`
      }),
      // https://github.com/ant-design/ant-design/issues/17611
      table: {
        width: '100%',
        textAlign: 'start',
        borderRadius: `${tableRadius}px ${tableRadius}px 0 0`,
        borderCollapse: 'separate',
        borderSpacing: 0
      },
      // ============================= Cell =============================
      [`
          ${componentCls}-thead > tr > th,
          ${componentCls}-tbody > tr > td,
          tfoot > tr > th,
          tfoot > tr > td
        `]: {
        position: 'relative',
        padding: `${paddingContentVerticalLG}px ${tablePaddingHorizontal}px`,
        overflowWrap: 'break-word'
      },
      // ============================ Title =============================
      [`${componentCls}-title`]: {
        padding: `${tablePaddingVertical}px ${tablePaddingHorizontal}px`
      },
      // ============================ Header ============================
      [`${componentCls}-thead`]: {
        [`
          > tr > th,
          > tr > td
        `]: {
          position: 'relative',
          color: tableHeaderTextColor,
          fontWeight: fontWeightStrong,
          textAlign: 'start',
          background: tableHeaderBg,
          borderBottom: tableBorder,
          transition: `background ${motionDurationMid} ease`,
          "&[colspan]:not([colspan='1'])": {
            textAlign: 'center'
          },
          [`&:not(:last-child):not(${componentCls}-selection-column):not(${componentCls}-row-expand-icon-cell):not([colspan])::before`]: {
            position: 'absolute',
            top: '50%',
            insetInlineEnd: 0,
            width: 1,
            height: '1.6em',
            backgroundColor: tableHeaderCellSplitColor,
            transform: 'translateY(-50%)',
            transition: `background-color ${motionDurationMid}`,
            content: '""'
          }
        },
        '> tr:not(:last-child) > th[colspan]': {
          borderBottom: 0
        }
      },
      // ============================ Body ============================
      // Borderless Table has unique hover style, which would be implemented with `borderTop`.
      [`${componentCls}:not(${componentCls}-bordered)`]: {
        [`${componentCls}-tbody`]: {
          '> tr': {
            '> td': {
              borderTop: tableBorder,
              borderBottom: 'transparent'
            },
            '&:last-child > td': {
              borderBottom: tableBorder
            },
            [`&:first-child > td,
              &${componentCls}-measure-row + tr > td`]: {
              borderTop: 'none',
              borderTopColor: 'transparent'
            }
          }
        }
      },
      // Bordered Table remains simple `borderBottom`.
      // Ref issue: https://github.com/ant-design/ant-design/issues/38724
      [`${componentCls}${componentCls}-bordered`]: {
        [`${componentCls}-tbody`]: {
          '> tr': {
            '> td': {
              borderBottom: tableBorder
            }
          }
        }
      },
      [`${componentCls}-tbody`]: {
        '> tr': {
          '> td': {
            transition: `background ${motionDurationMid}, border-color ${motionDurationMid}`,
            // ========================= Nest Table ===========================
            [`
              > ${componentCls}-wrapper:only-child,
              > ${componentCls}-expanded-row-fixed > ${componentCls}-wrapper:only-child
            `]: {
              [componentCls]: {
                marginBlock: `-${tablePaddingVertical}px`,
                marginInline: `${token.tableExpandColumnWidth - tablePaddingHorizontal}px -${tablePaddingHorizontal}px`,
                [`${componentCls}-tbody > tr:last-child > td`]: {
                  borderBottom: 0,
                  '&:first-child, &:last-child': {
                    borderRadius: 0
                  }
                }
              }
            }
          },
          [`
            &${componentCls}-row:hover > td,
            > td${componentCls}-cell-row-hover
          `]: {
            background: tableRowHoverBg
          },
          [`&${componentCls}-row-selected`]: {
            '> td': {
              background: tableSelectedRowBg
            },
            '&:hover > td': {
              background: tableSelectedRowHoverBg
            }
          }
        }
      },
      // ============================ Footer ============================
      [`${componentCls}-footer`]: {
        padding: `${tablePaddingVertical}px ${tablePaddingHorizontal}px`,
        color: tableFooterTextColor,
        background: tableFooterBg
      }
    })
  };
};
// ============================== Export ==============================
var _default = exports.default = (0, _internal.genComponentStyleHook)('Table', token => {
  const {
    controlItemBgActive,
    controlItemBgActiveHover,
    colorTextPlaceholder,
    colorTextHeading,
    colorSplit,
    colorBorderSecondary,
    fontSize,
    padding,
    paddingXS,
    paddingSM,
    controlHeight,
    colorFillAlter,
    colorIcon,
    colorIconHover,
    opacityLoading,
    colorBgContainer,
    borderRadiusLG,
    colorFillContent,
    colorFillSecondary,
    controlInteractiveSize: checkboxSize
  } = token;
  const baseColorAction = new _tinycolor.TinyColor(colorIcon);
  const baseColorActionHover = new _tinycolor.TinyColor(colorIconHover);
  const tableSelectedRowBg = controlItemBgActive;
  const zIndexTableFixed = 2;
  const colorFillSecondarySolid = new _tinycolor.TinyColor(colorFillSecondary).onBackground(colorBgContainer).toHexString();
  const colorFillContentSolid = new _tinycolor.TinyColor(colorFillContent).onBackground(colorBgContainer).toHexString();
  const colorFillAlterSolid = new _tinycolor.TinyColor(colorFillAlter).onBackground(colorBgContainer).toHexString();
  const tableToken = (0, _internal.mergeToken)(token, {
    tableFontSize: fontSize,
    tableBg: colorBgContainer,
    tableRadius: borderRadiusLG,
    tablePaddingVertical: padding,
    tablePaddingHorizontal: padding,
    tablePaddingVerticalMiddle: paddingSM,
    tablePaddingHorizontalMiddle: paddingXS,
    tablePaddingVerticalSmall: paddingXS,
    tablePaddingHorizontalSmall: paddingXS,
    tableBorderColor: colorBorderSecondary,
    tableHeaderTextColor: colorTextHeading,
    tableHeaderBg: colorFillAlterSolid,
    tableFooterTextColor: colorTextHeading,
    tableFooterBg: colorFillAlterSolid,
    tableHeaderCellSplitColor: colorBorderSecondary,
    tableHeaderSortBg: colorFillSecondarySolid,
    tableHeaderSortHoverBg: colorFillContentSolid,
    tableHeaderIconColor: baseColorAction.clone().setAlpha(baseColorAction.getAlpha() * opacityLoading).toRgbString(),
    tableHeaderIconColorHover: baseColorActionHover.clone().setAlpha(baseColorActionHover.getAlpha() * opacityLoading).toRgbString(),
    tableBodySortBg: colorFillAlterSolid,
    tableFixedHeaderSortActiveBg: colorFillSecondarySolid,
    tableHeaderFilterActiveBg: colorFillContent,
    tableFilterDropdownBg: colorBgContainer,
    tableRowHoverBg: colorFillAlterSolid,
    tableSelectedRowBg,
    tableSelectedRowHoverBg: controlItemBgActiveHover,
    zIndexTableFixed,
    zIndexTableSticky: zIndexTableFixed + 1,
    tableFontSizeMiddle: fontSize,
    tableFontSizeSmall: fontSize,
    tableSelectionColumnWidth: controlHeight,
    tableExpandIconBg: colorBgContainer,
    tableExpandColumnWidth: checkboxSize + 2 * token.padding,
    tableExpandedRowBg: colorFillAlter,
    // Dropdown
    tableFilterDropdownWidth: 120,
    tableFilterDropdownHeight: 264,
    tableFilterDropdownSearchWidth: 140,
    // Virtual Scroll Bar
    tableScrollThumbSize: 8,
    tableScrollThumbBg: colorTextPlaceholder,
    tableScrollThumbBgHover: colorTextHeading,
    tableScrollBg: colorSplit
  });
  return [genTableStyle(tableToken), (0, _pagination.default)(tableToken), (0, _summary.default)(tableToken), (0, _sorter.default)(tableToken), (0, _filter.default)(tableToken), (0, _bordered.default)(tableToken), (0, _radius.default)(tableToken), (0, _expand.default)(tableToken), (0, _summary.default)(tableToken), (0, _empty.default)(tableToken), (0, _selection.default)(tableToken), (0, _fixed.default)(tableToken), (0, _sticky.default)(tableToken), (0, _ellipsis.default)(tableToken), (0, _size.default)(tableToken), (0, _resize.default)(tableToken), (0, _rtl.default)(tableToken)];
});