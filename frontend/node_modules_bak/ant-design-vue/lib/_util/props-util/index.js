"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "camelize", {
  enumerable: true,
  get: function () {
    return _util.camelize;
  }
});
exports.default = void 0;
exports.filterEmpty = filterEmpty;
exports.filterEmptyWithUndefined = filterEmptyWithUndefined;
exports.flattenChildren = exports.findDOMNode = void 0;
exports.getClass = getClass;
exports.getComponent = void 0;
exports.getComponentName = getComponentName;
exports.getEvents = getEvents;
exports.getOptionProps = exports.getKey = void 0;
exports.getPropsSlot = getPropsSlot;
exports.getSlot = void 0;
exports.getStyle = getStyle;
exports.hasProp = exports.getTextFromElement = void 0;
Object.defineProperty(exports, "initDefaultProps", {
  enumerable: true,
  get: function () {
    return _initDefaultProps.default;
  }
});
exports.isEmptyContent = isEmptyContent;
exports.isEmptyElement = isEmptyElement;
exports.isEmptySlot = isEmptySlot;
exports.isFragment = isFragment;
exports.isStringElement = isStringElement;
exports.isValidElement = isValidElement;
exports.splitAttrs = exports.skipFlattenKey = exports.parseStyleText = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../classNames"));
var _vue = require("vue");
var _util = require("../util");
var _isValid = _interopRequireDefault(require("../isValid"));
var _initDefaultProps = _interopRequireDefault(require("./initDefaultProps"));
// function getType(fn) {
//   const match = fn && fn.toString().match(/^\s*function (\w+)/);
//   return match ? match[1] : '';
// }
const splitAttrs = attrs => {
  const allAttrs = Object.keys(attrs);
  const eventAttrs = {};
  const onEvents = {};
  const extraAttrs = {};
  for (let i = 0, l = allAttrs.length; i < l; i++) {
    const key = allAttrs[i];
    if ((0, _util.isOn)(key)) {
      eventAttrs[key[2].toLowerCase() + key.slice(3)] = attrs[key];
      onEvents[key] = attrs[key];
    } else {
      extraAttrs[key] = attrs[key];
    }
  }
  return {
    onEvents,
    events: eventAttrs,
    extraAttrs
  };
};
exports.splitAttrs = splitAttrs;
const parseStyleText = function () {
  let cssText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let camel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const res = {};
  const listDelimiter = /;(?![^(]*\))/g;
  const propertyDelimiter = /:(.+)/;
  if (typeof cssText === 'object') return cssText;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter);
      if (tmp.length > 1) {
        const k = camel ? (0, _util.camelize)(tmp[0].trim()) : tmp[0].trim();
        res[k] = tmp[1].trim();
      }
    }
  });
  return res;
};
exports.parseStyleText = parseStyleText;
const hasProp = (instance, prop) => {
  return instance[prop] !== undefined;
};
exports.hasProp = hasProp;
const skipFlattenKey = exports.skipFlattenKey = Symbol('skipFlatten');
const flattenChildren = function () {
  let children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let filterEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const temp = Array.isArray(children) ? children : [children];
  const res = [];
  temp.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...flattenChildren(child, filterEmpty));
    } else if (child && child.type === _vue.Fragment) {
      if (child.key === skipFlattenKey) {
        res.push(child);
      } else {
        res.push(...flattenChildren(child.children, filterEmpty));
      }
    } else if (child && (0, _vue.isVNode)(child)) {
      if (filterEmpty && !isEmptyElement(child)) {
        res.push(child);
      } else if (!filterEmpty) {
        res.push(child);
      }
    } else if ((0, _isValid.default)(child)) {
      res.push(child);
    }
  });
  return res;
};
exports.flattenChildren = flattenChildren;
const getSlot = function (self) {
  let name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if ((0, _vue.isVNode)(self)) {
    if (self.type === _vue.Fragment) {
      return name === 'default' ? flattenChildren(self.children) : [];
    } else if (self.children && self.children[name]) {
      return flattenChildren(self.children[name](options));
    } else {
      return [];
    }
  } else {
    const res = self.$slots[name] && self.$slots[name](options);
    return flattenChildren(res);
  }
};
exports.getSlot = getSlot;
const findDOMNode = instance => {
  var _a;
  let node = ((_a = instance === null || instance === void 0 ? void 0 : instance.vnode) === null || _a === void 0 ? void 0 : _a.el) || instance && (instance.$el || instance);
  while (node && !node.tagName) {
    node = node.nextSibling;
  }
  return node;
};
exports.findDOMNode = findDOMNode;
const getOptionProps = instance => {
  const res = {};
  if (instance.$ && instance.$.vnode) {
    const props = instance.$.vnode.props || {};
    Object.keys(instance.$props).forEach(k => {
      const v = instance.$props[k];
      const hyphenateKey = (0, _util.hyphenate)(k);
      if (v !== undefined || hyphenateKey in props) {
        res[k] = v; // 直接取 $props[k]
      }
    });
  } else if ((0, _vue.isVNode)(instance) && typeof instance.type === 'object') {
    const originProps = instance.props || {};
    const props = {};
    Object.keys(originProps).forEach(key => {
      props[(0, _util.camelize)(key)] = originProps[key];
    });
    const options = instance.type.props || {};
    Object.keys(options).forEach(k => {
      const v = (0, _util.resolvePropValue)(options, props, k, props[k]);
      if (v !== undefined || k in props) {
        res[k] = v;
      }
    });
  }
  return res;
};
exports.getOptionProps = getOptionProps;
const getComponent = function (instance) {
  let prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : instance;
  let execute = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  let com = undefined;
  if (instance.$) {
    const temp = instance[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(options) : temp;
    } else {
      com = instance.$slots[prop];
      com = execute && com ? com(options) : com;
    }
  } else if ((0, _vue.isVNode)(instance)) {
    const temp = instance.props && instance.props[prop];
    if (temp !== undefined && instance.props !== null) {
      return typeof temp === 'function' && execute ? temp(options) : temp;
    } else if (instance.type === _vue.Fragment) {
      com = instance.children;
    } else if (instance.children && instance.children[prop]) {
      com = instance.children[prop];
      com = execute && com ? com(options) : com;
    }
  }
  if (Array.isArray(com)) {
    com = flattenChildren(com);
    com = com.length === 1 ? com[0] : com;
    com = com.length === 0 ? undefined : com;
  }
  return com;
};
exports.getComponent = getComponent;
const getKey = ele => {
  const key = ele.key;
  return key;
};
exports.getKey = getKey;
function getEvents() {
  let ele = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let on = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let props = {};
  if (ele.$) {
    props = (0, _extends2.default)((0, _extends2.default)({}, props), ele.$attrs);
  } else {
    props = (0, _extends2.default)((0, _extends2.default)({}, props), ele.props);
  }
  return splitAttrs(props)[on ? 'onEvents' : 'events'];
}
function getClass(ele) {
  const props = ((0, _vue.isVNode)(ele) ? ele.props : ele.$attrs) || {};
  const tempCls = props.class || {};
  let cls = {};
  if (typeof tempCls === 'string') {
    tempCls.split(' ').forEach(c => {
      cls[c.trim()] = true;
    });
  } else if (Array.isArray(tempCls)) {
    (0, _classNames.default)(tempCls).split(' ').forEach(c => {
      cls[c.trim()] = true;
    });
  } else {
    cls = (0, _extends2.default)((0, _extends2.default)({}, cls), tempCls);
  }
  return cls;
}
function getStyle(ele, camel) {
  const props = ((0, _vue.isVNode)(ele) ? ele.props : ele.$attrs) || {};
  let style = props.style || {};
  if (typeof style === 'string') {
    style = parseStyleText(style, camel);
  } else if (camel && style) {
    // 驼峰化
    const res = {};
    Object.keys(style).forEach(k => res[(0, _util.camelize)(k)] = style[k]);
    return res;
  }
  return style;
}
function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}
function isFragment(c) {
  return c.length === 1 && c[0].type === _vue.Fragment;
}
function isEmptyContent(c) {
  return c === undefined || c === null || c === '' || Array.isArray(c) && c.length === 0;
}
function isEmptyElement(c) {
  return c && (c.type === _vue.Comment || c.type === _vue.Fragment && c.children.length === 0 || c.type === _vue.Text && c.children.trim() === '');
}
function isEmptySlot(c) {
  return !c || c().every(isEmptyElement);
}
function isStringElement(c) {
  return c && c.type === _vue.Text;
}
function filterEmpty() {
  let children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const res = [];
  children.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...child);
    } else if ((child === null || child === void 0 ? void 0 : child.type) === _vue.Fragment) {
      res.push(...filterEmpty(child.children));
    } else {
      res.push(child);
    }
  });
  return res.filter(c => !isEmptyElement(c));
}
function filterEmptyWithUndefined(children) {
  if (children) {
    const coms = filterEmpty(children);
    return coms.length ? coms : undefined;
  } else {
    return children;
  }
}
function isValidElement(element) {
  if (Array.isArray(element) && element.length === 1) {
    element = element[0];
  }
  return element && element.__v_isVNode && typeof element.type !== 'symbol'; // remove text node
}
function getPropsSlot(slots, props) {
  let prop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';
  var _a, _b;
  return (_a = props[prop]) !== null && _a !== void 0 ? _a : (_b = slots[prop]) === null || _b === void 0 ? void 0 : _b.call(slots);
}
const getTextFromElement = ele => {
  if (isValidElement(ele) && isStringElement(ele[0])) {
    return ele[0].children;
  }
  return ele;
};
exports.getTextFromElement = getTextFromElement;
var _default = exports.default = hasProp;