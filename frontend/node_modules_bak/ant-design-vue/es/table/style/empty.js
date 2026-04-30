// ========================= Placeholder ==========================
const genEmptyStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-tbody > tr${componentCls}-placeholder`]: {
        textAlign: 'center',
        color: token.colorTextDisabled,
        '&:hover > td': {
          background: token.colorBgContainer
        }
      }
    }
  };
};
export default genEmptyStyle;