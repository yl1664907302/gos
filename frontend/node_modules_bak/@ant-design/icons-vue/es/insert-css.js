// https://github.com/substack/insert-css
var containers = []; // will store container HTMLElement references

var styleElements = []; // will store {prepend: HTMLElement, append: HTMLElement}

var usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';

function createStyleElement() {
  var styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');
  return styleElement;
} // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types


function insertCss(css, options) {
  options = options || {};

  if (css === undefined) {
    throw new Error(usage);
  }

  var position = options.prepend === true ? 'prepend' : 'append';
  var container = options.container !== undefined ? options.container : document.querySelector('head');
  var containerId = containers.indexOf(container); // first time we see this container, create the necessary entries

  if (containerId === -1) {
    containerId = containers.push(container) - 1;
    styleElements[containerId] = {};
  } // try to get the correponding container + position styleElement, create it otherwise


  var styleElement;

  if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
    styleElement = styleElements[containerId][position];
  } else {
    styleElement = styleElements[containerId][position] = createStyleElement();
    var referenceNode = position === 'prepend' ? container.childNodes[0] || null : null;
    container.insertBefore(styleElement, referenceNode);
  } // strip potential UTF-8 BOM if css was read from a file


  if (css.charCodeAt(0) === 0xfeff) {
    css = css.substr(1, css.length);
  } // actually add the stylesheet


  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText += css;
  } else {
    styleElement.textContent += css;
  }

  return styleElement;
}

export default insertCss;