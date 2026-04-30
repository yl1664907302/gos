import { inject, provide, computed } from 'vue';
import { defaultValidateMessages } from './utils/messages';
export const FormContextKey = Symbol('formContextKey');
export const useProvideForm = state => {
  provide(FormContextKey, state);
};
export const useInjectForm = () => {
  return inject(FormContextKey, {
    name: computed(() => undefined),
    labelAlign: computed(() => 'right'),
    vertical: computed(() => false),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addField: (_eventKey, _field) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeField: _eventKey => {},
    model: computed(() => undefined),
    rules: computed(() => undefined),
    colon: computed(() => undefined),
    labelWrap: computed(() => undefined),
    labelCol: computed(() => undefined),
    requiredMark: computed(() => false),
    validateTrigger: computed(() => undefined),
    onValidate: () => {},
    validateMessages: computed(() => defaultValidateMessages)
  });
};
export const FormItemPrefixContextKey = Symbol('formItemPrefixContextKey');
export const useProvideFormItemPrefix = state => {
  provide(FormItemPrefixContextKey, state);
};
export const useInjectFormItemPrefix = () => {
  return inject(FormItemPrefixContextKey, {
    prefixCls: computed(() => '')
  });
};