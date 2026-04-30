export default initialState;
declare namespace initialState {
    const animating: boolean;
    const autoplaying: any;
    const currentDirection: number;
    const currentLeft: any;
    const currentSlide: number;
    const direction: number;
    const dragging: boolean;
    const edgeDragged: boolean;
    const initialized: boolean;
    const lazyLoadedList: any[];
    const listHeight: any;
    const listWidth: any;
    const scrolling: boolean;
    const slideCount: any;
    const slideHeight: any;
    const slideWidth: any;
    const swipeLeft: any;
    const swiped: boolean;
    const swiping: boolean;
    namespace touchObject {
        const startX: number;
        const startY: number;
        const curX: number;
        const curY: number;
    }
    const trackStyle: {};
    const trackWidth: number;
    const targetSlide: number;
}
