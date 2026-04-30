declare namespace _default {
    const name: string;
    const mixins: {
        methods: {
            setState(state: {}, callback: () => any): void;
            __emit(): void;
        };
    }[];
    const inheritAttrs: boolean;
    const props: {
        accessibility: {
            type: BooleanConstructor;
            default: boolean;
        };
        adaptiveHeight: {
            type: BooleanConstructor;
            default: boolean;
        };
        afterChange: import("vue-types").VueTypeValidableDef<any> & {
            default: any;
        };
        arrows: {
            type: BooleanConstructor;
            default: boolean;
        };
        autoplay: {
            type: BooleanConstructor;
            default: boolean;
        };
        autoplaySpeed: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        beforeChange: import("vue-types").VueTypeValidableDef<any> & {
            default: any;
        };
        centerMode: {
            type: BooleanConstructor;
            default: boolean;
        };
        centerPadding: import("vue-types").VueTypeValidableDef<string> & {
            default: string;
        } & {
            default: string;
        };
        cssEase: import("vue-types").VueTypeValidableDef<string> & {
            default: string;
        } & {
            default: string;
        };
        dots: {
            type: BooleanConstructor;
            default: boolean;
        };
        dotsClass: import("vue-types").VueTypeValidableDef<string> & {
            default: string;
        } & {
            default: string;
        };
        draggable: {
            type: BooleanConstructor;
            default: boolean;
        };
        unslick: {
            type: BooleanConstructor;
            default: boolean;
        };
        easing: import("vue-types").VueTypeValidableDef<string> & {
            default: string;
        } & {
            default: string;
        };
        edgeFriction: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        fade: {
            type: BooleanConstructor;
            default: boolean;
        };
        focusOnSelect: {
            type: BooleanConstructor;
            default: boolean;
        };
        infinite: {
            type: BooleanConstructor;
            default: boolean;
        };
        initialSlide: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        lazyLoad: import("vue-types").VueTypeValidableDef<any> & {
            default: any;
        };
        verticalSwiping: {
            type: BooleanConstructor;
            default: boolean;
        };
        asNavFor: import("vue-types").VueTypeValidableDef<any> & {
            default: any;
        };
        pauseOnDotsHover: {
            type: BooleanConstructor;
            default: boolean;
        };
        pauseOnFocus: {
            type: BooleanConstructor;
            default: boolean;
        };
        pauseOnHover: {
            type: BooleanConstructor;
            default: boolean;
        };
        responsive: import("vue-types").VueTypeValidableDef<unknown[]> & {
            default: () => unknown[];
        };
        rows: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        rtl: {
            type: BooleanConstructor;
            default: boolean;
        };
        slide: import("vue-types").VueTypeValidableDef<string> & {
            default: string;
        } & {
            default: string;
        };
        slidesPerRow: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        slidesToScroll: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        slidesToShow: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        speed: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        swipe: {
            type: BooleanConstructor;
            default: boolean;
        };
        swipeEvent: import("vue-types").VueTypeValidableDef<any> & {
            default: any;
        };
        swipeToSlide: {
            type: BooleanConstructor;
            default: boolean;
        };
        touchMove: {
            type: BooleanConstructor;
            default: boolean;
        };
        touchThreshold: import("vue-types").VueTypeValidableDef<number> & {
            default: number;
        } & {
            default: number;
        };
        useCSS: {
            type: BooleanConstructor;
            default: boolean;
        };
        useTransform: {
            type: BooleanConstructor;
            default: boolean;
        };
        variableWidth: {
            type: BooleanConstructor;
            default: boolean;
        };
        vertical: {
            type: BooleanConstructor;
            default: boolean;
        };
        waitForAnimate: {
            type: BooleanConstructor;
            default: boolean;
        };
        children: import("vue-types").VueTypeValidableDef<unknown[]> & {
            default: () => unknown[];
        };
        __propsSymbol__: import("vue-types").VueTypeValidableDef<any>;
    };
    function data(): any;
    namespace watch {
        function autoplay(newValue: any, oldValue: any): void;
        function __propsSymbol__(): void;
    }
    function mounted(): void;
    function beforeUnmount(): void;
    function updated(): void;
    namespace methods {
        function listRefHandler(ref: any): void;
        function trackRefHandler(ref: any): void;
        function adaptHeight(): void;
        function onWindowResized(setTrackStyle: any): void;
        function resizeWindow(setTrackStyle?: boolean): void;
        function updateState(spec: any, setTrackStyle: any, callback: any): void;
        function ssrInit(): {
            trackStyle: {
                width: string;
                left: string;
            };
            slideWidth?: undefined;
        } | {
            slideWidth: string;
            trackStyle: {
                width: string;
                left: string;
            };
        };
        function checkImagesLoad(): void;
        function progressiveLazyLoad(): void;
        function slideHandler(index: any, dontAnimate?: boolean): void;
        function changeSlide(options: any, dontAnimate?: boolean): void;
        function clickHandler(e: any): void;
        function keyHandler(e: any): void;
        function selectHandler(options: any): void;
        function disableBodyScroll(): void;
        function enableBodyScroll(): void;
        function swipeStart(e: any): void;
        function swipeMove(e: any): void;
        function swipeEnd(e: any): void;
        function touchEnd(e: any): void;
        function slickPrev(): void;
        function slickNext(): void;
        function slickGoTo(slide: any, dontAnimate?: boolean): string;
        function play(): boolean;
        function handleAutoPlay(playType: any): void;
        function pause(pauseType: any): void;
        function onDotsOver(): void;
        function onDotsLeave(): void;
        function onTrackOver(): void;
        function onTrackLeave(): void;
        function onSlideFocus(): void;
        function onSlideBlur(): void;
        function customPaging({ i }: {
            i: any;
        }): import("vue/jsx-runtime").JSX.Element;
        function appendDots({ dots }: {
            dots: any;
        }): import("vue/jsx-runtime").JSX.Element;
    }
    function render(): import("vue/jsx-runtime").JSX.Element;
}
export default _default;
