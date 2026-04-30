"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spyElementPrototype = spyElementPrototype;
exports.spyElementPrototypes = spyElementPrototypes;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
const __NULL__ = {
  notExist: true
};
function spyElementPrototypes(Element, properties) {
  const propNames = Object.keys(properties);
  const originDescriptors = {};
  propNames.forEach(propName => {
    const originDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, propName);
    originDescriptors[propName] = originDescriptor || __NULL__;
    const spyProp = properties[propName];
    if (typeof spyProp === 'function') {
      // If is a function
      Element.prototype[propName] = function spyFunc() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return spyProp.call(this, originDescriptor, ...args);
      };
    } else {
      // Otherwise tread as a property
      Object.defineProperty(Element.prototype, propName, (0, _extends2.default)((0, _extends2.default)({}, spyProp), {
        set(value) {
          if (spyProp.set) {
            return spyProp.set.call(this, originDescriptor, value);
          }
          return originDescriptor.set(value);
        },
        get() {
          if (spyProp.get) {
            return spyProp.get.call(this, originDescriptor);
          }
          return originDescriptor.get();
        }
      }));
    }
  });
  return {
    mockRestore() {
      propNames.forEach(propName => {
        const originDescriptor = originDescriptors[propName];
        if (originDescriptor === __NULL__) {
          delete Element.prototype[propName];
        } else if (typeof originDescriptor === 'function') {
          Element.prototype[propName] = originDescriptor;
        } else {
          Object.defineProperty(Element.prototype, propName, originDescriptor);
        }
      });
    }
  };
}
function spyElementPrototype(Element, propName, property) {
  return spyElementPrototypes(Element, {
    [propName]: property
  });
}