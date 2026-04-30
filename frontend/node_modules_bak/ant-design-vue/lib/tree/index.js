"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DirectoryTree", {
  enumerable: true,
  get: function () {
    return _DirectoryTree.default;
  }
});
exports.default = exports.TreeNode = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Tree = _interopRequireDefault(require("./Tree"));
var _vcTree = require("../vc-tree");
var _DirectoryTree = _interopRequireDefault(require("./DirectoryTree"));
/* istanbul ignore next */
const TreeNode = exports.TreeNode = _vcTree.TreeNode;
var _default = exports.default = (0, _extends2.default)(_Tree.default, {
  DirectoryTree: _DirectoryTree.default,
  TreeNode,
  install: app => {
    app.component(_Tree.default.name, _Tree.default);
    app.component(TreeNode.name, TreeNode);
    app.component(_DirectoryTree.default.name, _DirectoryTree.default);
    return app;
  }
});