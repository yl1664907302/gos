import { anyType, booleanType, someType, stringType } from '../_util/type';
export const flexProps = () => ({
  prefixCls: stringType(),
  vertical: booleanType(),
  wrap: stringType(),
  justify: stringType(),
  align: stringType(),
  flex: someType([Number, String]),
  gap: someType([Number, String]),
  component: anyType()
});