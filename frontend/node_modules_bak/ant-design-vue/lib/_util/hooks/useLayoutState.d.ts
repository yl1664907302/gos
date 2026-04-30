import type { Ref } from 'vue';
export type Updater<State> = (prev: State) => State;
/**
 * Execute code before next frame but async
 */
export declare function useLayoutState<State>(defaultState: State): [Ref<State>, (updater: Updater<State>) => void];
