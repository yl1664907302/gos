"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Divider", {
  enumerable: true,
  get: function () {
    return _Divider.default;
  }
});
Object.defineProperty(exports, "Item", {
  enumerable: true,
  get: function () {
    return _MenuItem.default;
  }
});
Object.defineProperty(exports, "ItemGroup", {
  enumerable: true,
  get: function () {
    return _ItemGroup.default;
  }
});
Object.defineProperty(exports, "MenuDivider", {
  enumerable: true,
  get: function () {
    return _Divider.default;
  }
});
Object.defineProperty(exports, "MenuItem", {
  enumerable: true,
  get: function () {
    return _MenuItem.default;
  }
});
Object.defineProperty(exports, "MenuItemGroup", {
  enumerable: true,
  get: function () {
    return _ItemGroup.default;
  }
});
Object.defineProperty(exports, "SubMenu", {
  enumerable: true,
  get: function () {
    return _SubMenu.default;
  }
});
exports.default = void 0;
var _Menu = _interopRequireDefault(require("./src/Menu"));
var _MenuItem = _interopRequireDefault(require("./src/MenuItem"));
var _SubMenu = _interopRequireDefault(require("./src/SubMenu"));
var _ItemGroup = _interopRequireDefault(require("./src/ItemGroup"));
var _Divider = _interopRequireDefault(require("./src/Divider"));
/* istanbul ignore next */
_Menu.default.install = function (app) {
  app.component(_Menu.default.name, _Menu.default);
  app.component(_MenuItem.default.name, _MenuItem.default);
  app.component(_SubMenu.default.name, _SubMenu.default);
  app.component(_Divider.default.name, _Divider.default);
  app.component(_ItemGroup.default.name, _ItemGroup.default);
  return app;
};
_Menu.default.Item = _MenuItem.default;
_Menu.default.Divider = _Divider.default;
_Menu.default.SubMenu = _SubMenu.default;
_Menu.default.ItemGroup = _ItemGroup.default;
var _default = exports.default = _Menu.default;