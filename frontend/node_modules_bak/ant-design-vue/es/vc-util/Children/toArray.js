import { isFragment } from '../../_util/props-util';
export default function toArray(children) {
  let option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let ret = [];
  children.forEach(child => {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return;
    }
    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });
  return ret;
}