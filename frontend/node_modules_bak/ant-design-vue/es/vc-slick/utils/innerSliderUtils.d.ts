export function clamp(number: any, lowerBound: any, upperBound: any): number;
export function safePreventDefault(event: any): void;
export function getOnDemandLazySlides(spec: any): number[];
export function getRequiredLazySlides(spec: any): number[];
export function lazyStartIndex(spec: any): number;
export function lazyEndIndex(spec: any): any;
export function lazySlidesOnLeft(spec: any): number;
export function lazySlidesOnRight(spec: any): any;
export function getWidth(elem: any): any;
export function getHeight(elem: any): any;
export function getSwipeDirection(touchObject: any, verticalSwiping?: boolean): "left" | "right" | "up" | "down" | "vertical";
export function canGoNext(spec: any): boolean;
export function extractObject(spec: any, keys: any): {};
export function initializedState(spec: any): {
    slideCount: any;
    slideWidth: number;
    listWidth: number;
    trackWidth: number;
    currentSlide: any;
    slideHeight: any;
    listHeight: number;
    lazyLoadedList: any;
};
export function slideHandler(spec: any): {
    state?: undefined;
    nextState?: undefined;
} | {
    state: {};
    nextState: {};
};
export function changeSlide(spec: any, options: any): any;
export function keyHandler(e: any, accessibility: any, rtl: any): "" | "previous" | "next";
export function swipeStart(e: any, swipe: any, draggable: any): "" | {
    dragging: boolean;
    touchObject: {
        startX: any;
        startY: any;
        curX: any;
        curY: any;
    };
};
export function swipeMove(e: any, spec: any): void | {
    edgeDragged: boolean;
    swiped: boolean;
    swiping: boolean;
} | {
    scrolling: boolean;
};
export function swipeEnd(e: any, spec: any): {};
export function getNavigableIndexes(spec: any): number[];
export function checkNavigable(spec: any, index: any): any;
export function getSlideCount(spec: any): any;
export function checkSpecKeys(spec: any, keysArray: any): void;
export function getTrackCSS(spec: any): {
    opacity: number;
    transition: string;
    WebkitTransition: string;
};
export function getTrackAnimateCSS(spec: any): {
    opacity: number;
    transition: string;
    WebkitTransition: string;
};
export function getTrackLeft(spec: any): number;
export function getPreClones(spec: any): any;
export function getPostClones(spec: any): any;
export function getTotalSlides(spec: any): any;
export function siblingDirection(spec: any): "left" | "right";
export function slidesOnRight({ slidesToShow, centerMode, rtl, centerPadding }: {
    slidesToShow: any;
    centerMode: any;
    rtl: any;
    centerPadding: any;
}): number;
export function slidesOnLeft({ slidesToShow, centerMode, rtl, centerPadding }: {
    slidesToShow: any;
    centerMode: any;
    rtl: any;
    centerPadding: any;
}): number;
export function canUseDOM(): boolean;
