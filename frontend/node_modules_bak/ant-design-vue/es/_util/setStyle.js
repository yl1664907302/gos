function setStyle(style) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    element = document.body
  } = options;
  const oldStyle = {};
  const styleKeys = Object.keys(style);
  // IE browser compatible
  styleKeys.forEach(key => {
    oldStyle[key] = element.style[key];
  });
  styleKeys.forEach(key => {
    element.style[key] = style[key];
  });
  return oldStyle;
}
export default setStyle;