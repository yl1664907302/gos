import { onBeforeUpdate, ref } from 'vue';
const useRefs = () => {
  const refs = ref(new Map());
  const setRef = key => el => {
    refs.value.set(key, el);
  };
  onBeforeUpdate(() => {
    refs.value = new Map();
  });
  return [setRef, refs];
};
export default useRefs;