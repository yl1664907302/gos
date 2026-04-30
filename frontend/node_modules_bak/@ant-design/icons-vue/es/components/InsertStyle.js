import { defineComponent } from 'vue';
import { useInsertStyles } from '../utils';
export var InsertStyles = defineComponent({
  name: 'InsertStyles',
  setup: function setup() {
    useInsertStyles();
    return function () {
      return null;
    };
  }
});