import { createVNode as _createVNode } from "vue";
import { defineComponent, computed } from 'vue';
import PropTypes from '../_util/vue-types';
export const starProps = {
  value: Number,
  index: Number,
  prefixCls: String,
  allowHalf: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  character: PropTypes.any,
  characterRender: Function,
  focused: {
    type: Boolean,
    default: undefined
  },
  count: Number,
  onClick: Function,
  onHover: Function
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Star',
  inheritAttrs: false,
  props: starProps,
  emits: ['hover', 'click'],
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const onHover = e => {
      const {
        index
      } = props;
      emit('hover', e, index);
    };
    const onClick = e => {
      const {
        index
      } = props;
      emit('click', e, index);
    };
    const onKeyDown = e => {
      const {
        index
      } = props;
      if (e.keyCode === 13) {
        emit('click', e, index);
      }
    };
    const cls = computed(() => {
      const {
        prefixCls,
        index,
        value,
        allowHalf,
        focused
      } = props;
      const starValue = index + 1;
      let className = prefixCls;
      if (value === 0 && index === 0 && focused) {
        className += ` ${prefixCls}-focused`;
      } else if (allowHalf && value + 0.5 >= starValue && value < starValue) {
        className += ` ${prefixCls}-half ${prefixCls}-active`;
        if (focused) {
          className += ` ${prefixCls}-focused`;
        }
      } else {
        className += starValue <= value ? ` ${prefixCls}-full` : ` ${prefixCls}-zero`;
        if (starValue === value && focused) {
          className += ` ${prefixCls}-focused`;
        }
      }
      return className;
    });
    return () => {
      const {
        disabled,
        prefixCls,
        characterRender,
        character,
        index,
        count,
        value
      } = props;
      const characterNode = typeof character === 'function' ? character({
        disabled,
        prefixCls,
        index,
        count,
        value
      }) : character;
      let star = _createVNode("li", {
        "class": cls.value
      }, [_createVNode("div", {
        "onClick": disabled ? null : onClick,
        "onKeydown": disabled ? null : onKeyDown,
        "onMousemove": disabled ? null : onHover,
        "role": "radio",
        "aria-checked": value > index ? 'true' : 'false',
        "aria-posinset": index + 1,
        "aria-setsize": count,
        "tabindex": disabled ? -1 : 0
      }, [_createVNode("div", {
        "class": `${prefixCls}-first`
      }, [characterNode]), _createVNode("div", {
        "class": `${prefixCls}-second`
      }, [characterNode])])]);
      if (characterRender) {
        star = characterRender(star, props);
      }
      return star;
    };
  }
});