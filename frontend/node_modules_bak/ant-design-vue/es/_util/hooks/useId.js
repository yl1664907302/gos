import { ref } from 'vue';
import canUseDom from '../../_util/canUseDom';
let uuid = 0;
/** Is client side and not jsdom */
export const isBrowserClient = process.env.NODE_ENV !== 'test' && canUseDom();
/** Get unique id for accessibility usage */
export function getUUID() {
  let retId;
  // Test never reach
  /* istanbul ignore if */
  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = 'TEST_OR_SSR';
  }
  return retId;
}
export default function useId() {
  let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ref('');
  // Inner id for accessibility usage. Only work in client side
  const innerId = `vc_unique_${getUUID()}`;
  return id.value || innerId;
}