"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addObserveTarget = addObserveTarget;
exports.getFixedBottom = getFixedBottom;
exports.getFixedTop = getFixedTop;
exports.getObserverEntities = getObserverEntities;
exports.getTargetRect = getTargetRect;
exports.removeObserveTarget = removeObserveTarget;
var _addEventListener = _interopRequireDefault(require("../vc-util/Dom/addEventListener"));
var _supportsPassive = _interopRequireDefault(require("../_util/supportsPassive"));
function getTargetRect(target) {
  return target !== window ? target.getBoundingClientRect() : {
    top: 0,
    bottom: window.innerHeight
  };
}
function getFixedTop(placeholderRect, targetRect, offsetTop) {
  if (offsetTop !== undefined && targetRect.top > placeholderRect.top - offsetTop) {
    return `${offsetTop + targetRect.top}px`;
  }
  return undefined;
}
function getFixedBottom(placeholderRect, targetRect, offsetBottom) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderRect.bottom + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;
    return `${offsetBottom + targetBottomOffset}px`;
  }
  return undefined;
}
// ======================== Observer ========================
const TRIGGER_EVENTS = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
let observerEntities = [];
function getObserverEntities() {
  // Only used in test env. Can be removed if refactor.
  return observerEntities;
}
function addObserveTarget(target, affix) {
  if (!target) return;
  let entity = observerEntities.find(item => item.target === target);
  if (entity) {
    entity.affixList.push(affix);
  } else {
    entity = {
      target,
      affixList: [affix],
      eventHandlers: {}
    };
    observerEntities.push(entity);
    // Add listener
    TRIGGER_EVENTS.forEach(eventName => {
      entity.eventHandlers[eventName] = (0, _addEventListener.default)(target, eventName, () => {
        entity.affixList.forEach(targetAffix => {
          const {
            lazyUpdatePosition
          } = targetAffix.exposed;
          lazyUpdatePosition();
        }, (eventName === 'touchstart' || eventName === 'touchmove') && _supportsPassive.default ? {
          passive: true
        } : false);
      });
    });
  }
}
function removeObserveTarget(affix) {
  const observerEntity = observerEntities.find(oriObserverEntity => {
    const hasAffix = oriObserverEntity.affixList.some(item => item === affix);
    if (hasAffix) {
      oriObserverEntity.affixList = oriObserverEntity.affixList.filter(item => item !== affix);
    }
    return hasAffix;
  });
  if (observerEntity && observerEntity.affixList.length === 0) {
    observerEntities = observerEntities.filter(item => item !== observerEntity);
    // Remove listener
    TRIGGER_EVENTS.forEach(eventName => {
      const handler = observerEntity.eventHandlers[eventName];
      if (handler && handler.remove) {
        handler.remove();
      }
    });
  }
}