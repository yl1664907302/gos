"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMaxLevel;
var _vue = require("vue");
function useMaxLevel(keyEntities) {
  const maxLevel = (0, _vue.ref)(0);
  const levelEntities = (0, _vue.shallowRef)();
  (0, _vue.watchEffect)(() => {
    const newLevelEntities = new Map();
    let newMaxLevel = 0;
    const keyEntitiesValue = keyEntities.value || {};
    // Convert entities by level for calculation
    for (const key in keyEntitiesValue) {
      if (Object.prototype.hasOwnProperty.call(keyEntitiesValue, key)) {
        const entity = keyEntitiesValue[key];
        const {
          level
        } = entity;
        let levelSet = newLevelEntities.get(level);
        if (!levelSet) {
          levelSet = new Set();
          newLevelEntities.set(level, levelSet);
        }
        levelSet.add(entity);
        newMaxLevel = Math.max(newMaxLevel, level);
      }
    }
    maxLevel.value = newMaxLevel;
    levelEntities.value = newLevelEntities;
  });
  return {
    maxLevel,
    levelEntities
  };
}