import { useInjectCascader } from '../context';
import { watch } from 'vue';
import { useBaseProps } from '../../vc-select';
import useState from '../../_util/hooks/useState';
/**
 * Control the active open options path.
 */
export default (() => {
  const baseProps = useBaseProps();
  const {
    values
  } = useInjectCascader();
  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = useState([]);
  watch(() => baseProps.open, () => {
    if (baseProps.open && !baseProps.multiple) {
      const firstValueCells = values.value[0];
      setActiveValueCells(firstValueCells || []);
    }
  }, {
    immediate: true
  });
  return [activeValueCells, setActiveValueCells];
});