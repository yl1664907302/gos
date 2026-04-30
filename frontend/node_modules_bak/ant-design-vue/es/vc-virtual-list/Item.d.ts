import type { FunctionalComponent } from 'vue';
export interface ItemProps {
    setRef: (element: HTMLElement) => void;
}
declare const Item: FunctionalComponent<ItemProps>;
export default Item;
