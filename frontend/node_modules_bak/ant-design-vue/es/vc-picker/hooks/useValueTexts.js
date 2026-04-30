import { computed } from 'vue';
import useMemo from '../../_util/hooks/useMemo';
import shallowequal from '../../_util/shallowequal';
import { formatValue } from '../utils/dateUtil';
export default function useValueTexts(value, _ref) {
  let {
    formatList,
    generateConfig,
    locale
  } = _ref;
  const texts = useMemo(() => {
    if (!value.value) {
      return [[''], ''];
    }
    // We will convert data format back to first format
    let firstValueText = '';
    const fullValueTexts = [];
    for (let i = 0; i < formatList.value.length; i += 1) {
      const format = formatList.value[i];
      const formatStr = formatValue(value.value, {
        generateConfig: generateConfig.value,
        locale: locale.value,
        format
      });
      fullValueTexts.push(formatStr);
      if (i === 0) {
        firstValueText = formatStr;
      }
    }
    return [fullValueTexts, firstValueText];
  }, [value, formatList], (next, prev) => prev[0] !== next[0] || !shallowequal(prev[1], next[1]));
  const fullValueTexts = computed(() => texts.value[0]);
  const firstValueText = computed(() => texts.value[1]);
  return [fullValueTexts, firstValueText];
}