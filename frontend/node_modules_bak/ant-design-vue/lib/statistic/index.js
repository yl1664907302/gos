"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StatisticCountdown = void 0;
var _Statistic = _interopRequireDefault(require("./Statistic"));
var _Countdown = _interopRequireDefault(require("./Countdown"));
_Statistic.default.Countdown = _Countdown.default;
/* istanbul ignore next */
_Statistic.default.install = function (app) {
  app.component(_Statistic.default.name, _Statistic.default);
  app.component(_Statistic.default.Countdown.name, _Statistic.default.Countdown);
  return app;
};
const StatisticCountdown = exports.StatisticCountdown = _Statistic.default.Countdown;
var _default = exports.default = _Statistic.default;