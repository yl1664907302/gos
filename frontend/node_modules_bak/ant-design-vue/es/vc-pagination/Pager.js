import { createVNode as _createVNode } from "vue";
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { defineComponent } from 'vue';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Pager',
  inheritAttrs: false,
  props: {
    rootPrefixCls: String,
    page: Number,
    active: {
      type: Boolean,
      default: undefined
    },
    last: {
      type: Boolean,
      default: undefined
    },
    locale: PropTypes.object,
    showTitle: {
      type: Boolean,
      default: undefined
    },
    itemRender: {
      type: Function,
      default: () => {}
    },
    onClick: {
      type: Function
    },
    onKeypress: {
      type: Function
    }
  },
  eimt: ['click', 'keypress'],
  setup(props, _ref) {
    let {
      emit,
      attrs
    } = _ref;
    const handleClick = () => {
      emit('click', props.page);
    };
    const handleKeyPress = event => {
      emit('keypress', event, handleClick, props.page);
    };
    return () => {
      const {
        showTitle,
        page,
        itemRender
      } = props;
      const {
        class: _cls,
        style
      } = attrs;
      const prefixCls = `${props.rootPrefixCls}-item`;
      const cls = classNames(prefixCls, `${prefixCls}-${props.page}`, {
        [`${prefixCls}-active`]: props.active,
        [`${prefixCls}-disabled`]: !props.page
      }, _cls);
      return _createVNode("li", {
        "onClick": handleClick,
        "onKeypress": handleKeyPress,
        "title": showTitle ? String(page) : null,
        "tabindex": "0",
        "class": cls,
        "style": style
      }, [itemRender({
        page,
        type: 'page',
        originalElement: _createVNode("a", {
          "rel": "nofollow"
        }, [page])
      })]);
    };
  }
});