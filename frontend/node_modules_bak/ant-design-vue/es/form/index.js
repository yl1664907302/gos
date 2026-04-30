import Form, { formProps } from './Form';
import FormItem, { formItemProps } from './FormItem';
import useForm from './useForm';
import FormItemRest, { useInjectFormItemContext } from './FormItemContext';
Form.useInjectFormItemContext = useInjectFormItemContext;
Form.ItemRest = FormItemRest;
/* istanbul ignore next */
Form.install = function (app) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  app.component(FormItemRest.name, FormItemRest);
  return app;
};
export { FormItem, formItemProps, formProps, FormItemRest, useForm, useInjectFormItemContext };
export default Form;