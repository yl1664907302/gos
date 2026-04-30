import { booleanType, someType, functionType, stringType, anyType, objectType } from '../_util/type';
export const progressStatuses = ['normal', 'exception', 'active', 'success'];
const ProgressType = ['line', 'circle', 'dashboard'];
const ProgressSize = ['default', 'small'];
export const progressProps = () => ({
  prefixCls: String,
  type: stringType(),
  percent: Number,
  format: functionType(),
  status: stringType(),
  showInfo: booleanType(),
  strokeWidth: Number,
  strokeLinecap: stringType(),
  strokeColor: anyType(),
  trailColor: String,
  /** @deprecated Use `size` instead */
  width: Number,
  success: objectType(),
  gapDegree: Number,
  gapPosition: stringType(),
  size: someType([String, Number, Array]),
  steps: Number,
  /** @deprecated Use `success` instead */
  successPercent: Number,
  title: String,
  progressStatus: stringType()
});