import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { watch, computed, defineComponent, ref, TransitionGroup } from 'vue';
import Notice from './Notice';
import { getTransitionGroupProps } from '../_util/transition';
import classNames from '../_util/classNames';
import Portal from '../_util/Portal';
let seed = 0;
const now = Date.now();
export function getUuid() {
  const id = seed;
  seed += 1;
  return `rcNotification_${now}_${id}`;
}
const Notification = defineComponent({
  name: 'HookNotification',
  inheritAttrs: false,
  props: ['prefixCls', 'transitionName', 'animation', 'maxCount', 'closeIcon', 'hashId', 'remove', 'notices', 'getStyles', 'getClassName', 'onAllRemoved', 'getContainer'],
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const hookRefs = new Map();
    const notices = computed(() => props.notices);
    const transitionProps = computed(() => {
      let name = props.transitionName;
      if (!name && props.animation) {
        switch (typeof props.animation) {
          case 'string':
            name = props.animation;
            break;
          case 'function':
            name = props.animation().name;
            break;
          case 'object':
            name = props.animation.name;
            break;
          default:
            name = `${props.prefixCls}-fade`;
            break;
        }
      }
      return getTransitionGroupProps(name);
    });
    const remove = key => props.remove(key);
    const placements = ref({});
    watch(notices, () => {
      const nextPlacements = {};
      // init placements with animation
      Object.keys(placements.value).forEach(placement => {
        nextPlacements[placement] = [];
      });
      props.notices.forEach(config => {
        const {
          placement = 'topRight'
        } = config.notice;
        if (placement) {
          nextPlacements[placement] = nextPlacements[placement] || [];
          nextPlacements[placement].push(config);
        }
      });
      placements.value = nextPlacements;
    });
    const placementList = computed(() => Object.keys(placements.value));
    return () => {
      var _a;
      const {
        prefixCls,
        closeIcon = (_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots, {
          prefixCls
        })
      } = props;
      const noticeNodes = placementList.value.map(placement => {
        var _a, _b;
        const noticesForPlacement = placements.value[placement];
        const classes = (_a = props.getClassName) === null || _a === void 0 ? void 0 : _a.call(props, placement);
        const styles = (_b = props.getStyles) === null || _b === void 0 ? void 0 : _b.call(props, placement);
        const noticeNodesForPlacement = noticesForPlacement.map((_ref2, index) => {
          let {
            notice,
            holderCallback
          } = _ref2;
          const updateMark = index === notices.value.length - 1 ? notice.updateMark : undefined;
          const {
            key,
            userPassKey
          } = notice;
          const {
            content
          } = notice;
          const noticeProps = _extends(_extends(_extends({
            prefixCls,
            closeIcon: typeof closeIcon === 'function' ? closeIcon({
              prefixCls
            }) : closeIcon
          }, notice), notice.props), {
            key,
            noticeKey: userPassKey || key,
            updateMark,
            onClose: noticeKey => {
              var _a;
              remove(noticeKey);
              (_a = notice.onClose) === null || _a === void 0 ? void 0 : _a.call(notice);
            },
            onClick: notice.onClick
          });
          if (holderCallback) {
            return _createVNode("div", {
              "key": key,
              "class": `${prefixCls}-hook-holder`,
              "ref": div => {
                if (typeof key === 'undefined') {
                  return;
                }
                if (div) {
                  hookRefs.set(key, div);
                  holderCallback(div, noticeProps);
                } else {
                  hookRefs.delete(key);
                }
              }
            }, null);
          }
          return _createVNode(Notice, _objectSpread(_objectSpread({}, noticeProps), {}, {
            "class": classNames(noticeProps.class, props.hashId)
          }), {
            default: () => [typeof content === 'function' ? content({
              prefixCls
            }) : content]
          });
        });
        const className = {
          [prefixCls]: 1,
          [`${prefixCls}-${placement}`]: 1,
          [attrs.class]: !!attrs.class,
          [props.hashId]: true,
          [classes]: !!classes
        };
        function onAfterLeave() {
          var _a;
          if (noticesForPlacement.length > 0) {
            return;
          }
          Reflect.deleteProperty(placements.value, placement);
          (_a = props.onAllRemoved) === null || _a === void 0 ? void 0 : _a.call(props);
        }
        return _createVNode("div", {
          "key": placement,
          "class": className,
          "style": attrs.style || styles || {
            top: '65px',
            left: '50%'
          }
        }, [_createVNode(TransitionGroup, _objectSpread(_objectSpread({
          "tag": "div"
        }, transitionProps.value), {}, {
          "onAfterLeave": onAfterLeave
        }), {
          default: () => [noticeNodesForPlacement]
        })]);
      });
      return _createVNode(Portal, {
        "getContainer": props.getContainer
      }, {
        default: () => [noticeNodes]
      });
    };
  }
});
export default Notification;