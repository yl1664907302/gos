import _extends from "@babel/runtime/helpers/esm/extends";
import classNames from '../classNames';
import { isVNode, Fragment, Comment, Text } from 'vue';
import { camelize, hyphenate, isOn, resolvePropValue } from '../util';
import isValid from '../isValid';
import initDefaultProps from './initDefaultProps';
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
    if (isOn(key)) {
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
        const k = camel ? camelize(tmp[0].trim()) : tmp[0].trim();
        res[k] = tmp[1].trim();
      }
    }
  });
  return res;
};
const hasProp = (instance, prop) => {
  return instance[prop] !== undefined;
};
export const skipFlattenKey = Symbol('skipFlatten');
const flattenChildren = function () {
  let children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let filterEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const temp = Array.isArray(children) ? children : [children];
  const res = [];
  temp.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...flattenChildren(child, filterEmpty));
    } else if (child && child.type === Fragment) {
      if (child.key === skipFlattenKey) {
        res.push(child);
      } else {
        res.push(...flattenChildren(child.children, filterEmpty));
      }
    } else if (child && isVNode(child)) {
      if (filterEmpty && !isEmptyElement(child)) {
        res.push(child);
      } else if (!filterEmpty) {
        res.push(child);
      }
    } else if (isValid(child)) {
      res.push(child);
    }
  });
  return res;
};
const getSlot = function (self) {
  let name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (isVNode(self)) {
    if (self.type === Fragment) {
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
const findDOMNode = instance => {
  var _a;
  let node = ((_a = instance === null || instance === void 0 ? void 0 : instance.vnode) === null || _a === void 0 ? void 0 : _a.el) || instance && (instance.$el || instance);
  while (node && !node.tagName) {
    node = node.nextSibling;
  }
  return node;
};
const getOptionProps = instance => {
  const res = {};
  if (instance.$ && instance.$.vnode) {
    const props = instance.$.vnode.props || {};
    Object.keys(instance.$props).forEach(k => {
      const v = instance.$props[k];
      const hyphenateKey = hyphenate(k);
      if (v !== undefined || hyphenateKey in props) {
        res[k] = v; // 直接取 $props[k]
      }
    });
  } else if (isVNode(instance) && typeof instance.type === 'object') {
    const originProps = instance.props || {};
    const props = {};
    Object.keys(originProps).forEach(key => {
      props[camelize(key)] = originProps[key];
    });
    const options = instance.type.props || {};
    Object.keys(options).forEach(k => {
      const v = resolvePropValue(options, props, k, props[k]);
      if (v !== undefined || k in props) {
        res[k] = v;
      }
    });
  }
  return res;
};
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
  } else if (isVNode(instance)) {
    const temp = instance.props && instance.props[prop];
    if (temp !== undefined && instance.props !== null) {
      return typeof temp === 'function' && execute ? temp(options) : temp;
    } else if (instance.type === Fragment) {
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
const getKey = ele => {
  const key = ele.key;
  return key;
};
export function getEvents() {
  let ele = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let on = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let props = {};
  if (ele.$) {
    props = _extends(_extends({}, props), ele.$attrs);
  } else {
    props = _extends(_extends({}, props), ele.props);
  }
  return splitAttrs(props)[on ? 'onEvents' : 'events'];
}
export function getClass(ele) {
  const props = (isVNode(ele) ? ele.props : ele.$attrs) || {};
  const tempCls = props.class || {};
  let cls = {};
  if (typeof tempCls === 'string') {
    tempCls.split(' ').forEach(c => {
      cls[c.trim()] = true;
    });
  } else if (Array.isArray(tempCls)) {
    classNames(tempCls).split(' ').forEach(c => {
      cls[c.trim()] = true;
    });
  } else {
    cls = _extends(_extends({}, cls), tempCls);
  }
  return cls;
}
export function getStyle(ele, camel) {
  const props = (isVNode(ele) ? ele.props : ele.$attrs) || {};
  let style = props.style || {};
  if (typeof style === 'string') {
    style = parseStyleText(style, camel);
  } else if (camel && style) {
    // 驼峰化
    const res = {};
    Object.keys(style).forEach(k => res[camelize(k)] = style[k]);
    return res;
  }
  return style;
}
export function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}
export function isFragment(c) {
  return c.length === 1 && c[0].type === Fragment;
}
export function isEmptyContent(c) {
  return c === undefined || c === null || c === '' || Array.isArray(c) && c.length === 0;
}
export function isEmptyElement(c) {
  return c && (c.type === Comment || c.type === Fragment && c.children.length === 0 || c.type === Text && c.children.trim() === '');
}
export function isEmptySlot(c) {
  return !c || c().every(isEmptyElement);
}
export function isStringElement(c) {
  return c && c.type === Text;
}
export function filterEmpty() {
  let children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const res = [];
  children.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...child);
    } else if ((child === null || child === void 0 ? void 0 : child.type) === Fragment) {
      res.push(...filterEmpty(child.children));
    } else {
      res.push(child);
    }
  });
  return res.filter(c => !isEmptyElement(c));
}
export function filterEmptyWithUndefined(children) {
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
export const getTextFromElement = ele => {
  if (isValidElement(ele) && isStringElement(ele[0])) {
    return ele[0].children;
  }
  return ele;
};
export { splitAttrs, hasProp, getOptionProps, getComponent, getKey, parseStyleText, initDefaultProps, isValidElement, camelize, getSlot, findDOMNode, flattenChildren, getPropsSlot };
export default hasProp;