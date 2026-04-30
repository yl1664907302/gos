import type { Ref } from 'vue';
/**
 * Popup should follow the steps for each component work correctly:
 * measure - check for the value stretch size
 * align - let component align the position
 * aligned - re-align again in case additional className changed the size
 * afterAlign - choice next step is trigger motion or finished
 * beforeMotion - should reset motion to invisible so that CSSMotion can do normal motion
 * motion - play the motion
 * stable - everything is done
 */
type PopupStatus = null | 'measure' | 'align' | 'aligned' | 'motion' | 'stable';
type Func = () => void;
declare const _default: (visible: Ref<boolean>, doMeasure: Func) => [Ref<PopupStatus, PopupStatus>, (callback?: () => void) => void];
export default _default;
