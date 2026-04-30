import type { ExtractPropTypes } from 'vue';
export type SwipeDirection = 'left' | 'down' | 'right' | 'up' | string;
export type LazyLoadTypes = 'ondemand' | 'progressive';
export type CarouselEffect = 'scrollx' | 'fade';
export type DotPosition = 'top' | 'bottom' | 'left' | 'right';
export interface CarouselRef {
    goTo: (slide: number, dontAnimate?: boolean) => void;
    next: () => void;
    prev: () => void;
    autoplay: (palyType?: 'update' | 'leave' | 'blur') => void;
    innerSlider: any;
}
export declare const carouselProps: () => {
    effect: {
        type: import("vue").PropType<CarouselEffect>;
        default: CarouselEffect;
    };
    dots: {
        type: BooleanConstructor;
        default: boolean;
    };
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoplay: {
        type: BooleanConstructor;
        default: boolean;
    };
    easing: StringConstructor;
    beforeChange: {
        type: import("vue").PropType<(currentSlide: number, nextSlide: number) => void>;
        default: (currentSlide: number, nextSlide: number) => void;
    };
    afterChange: {
        type: import("vue").PropType<(currentSlide: number) => void>;
        default: (currentSlide: number) => void;
    };
    prefixCls: StringConstructor;
    accessibility: {
        type: BooleanConstructor;
        default: boolean;
    };
    nextArrow: import("vue-types").VueTypeValidableDef<any>;
    prevArrow: import("vue-types").VueTypeValidableDef<any>;
    pauseOnHover: {
        type: BooleanConstructor;
        default: boolean;
    };
    adaptiveHeight: {
        type: BooleanConstructor;
        default: boolean;
    };
    arrows: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoplaySpeed: NumberConstructor;
    centerMode: {
        type: BooleanConstructor;
        default: boolean;
    };
    centerPadding: StringConstructor;
    cssEase: StringConstructor;
    dotsClass: StringConstructor;
    draggable: {
        type: BooleanConstructor;
        default: boolean;
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
    initialSlide: NumberConstructor;
    lazyLoad: {
        type: import("vue").PropType<LazyLoadTypes>;
        default: LazyLoadTypes;
    };
    rtl: {
        type: BooleanConstructor;
        default: boolean;
    };
    slide: StringConstructor;
    slidesToShow: NumberConstructor;
    slidesToScroll: NumberConstructor;
    speed: NumberConstructor;
    swipe: {
        type: BooleanConstructor;
        default: boolean;
    };
    swipeToSlide: {
        type: BooleanConstructor;
        default: boolean;
    };
    swipeEvent: {
        type: import("vue").PropType<(swipeDirection: SwipeDirection) => void>;
        default: (swipeDirection: SwipeDirection) => void;
    };
    touchMove: {
        type: BooleanConstructor;
        default: boolean;
    };
    touchThreshold: NumberConstructor;
    variableWidth: {
        type: BooleanConstructor;
        default: boolean;
    };
    useCSS: {
        type: BooleanConstructor;
        default: boolean;
    };
    slickGoTo: NumberConstructor;
    responsive: ArrayConstructor;
    dotPosition: {
        type: import("vue").PropType<DotPosition>;
        default: DotPosition;
    };
    verticalSwiping: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type CarouselProps = Partial<ExtractPropTypes<ReturnType<typeof carouselProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        effect: {
            type: import("vue").PropType<CarouselEffect>;
            default: CarouselEffect;
        };
        dots: {
            type: BooleanConstructor;
            default: boolean;
        };
        vertical: {
            type: BooleanConstructor;
            default: boolean;
        };
        autoplay: {
            type: BooleanConstructor;
            default: boolean;
        };
        easing: StringConstructor;
        beforeChange: {
            type: import("vue").PropType<(currentSlide: number, nextSlide: number) => void>;
            default: (currentSlide: number, nextSlide: number) => void;
        };
        afterChange: {
            type: import("vue").PropType<(currentSlide: number) => void>;
            default: (currentSlide: number) => void;
        };
        prefixCls: StringConstructor;
        accessibility: {
            type: BooleanConstructor;
            default: boolean;
        };
        nextArrow: import("vue-types").VueTypeValidableDef<any>;
        prevArrow: import("vue-types").VueTypeValidableDef<any>;
        pauseOnHover: {
            type: BooleanConstructor;
            default: boolean;
        };
        adaptiveHeight: {
            type: BooleanConstructor;
            default: boolean;
        };
        arrows: {
            type: BooleanConstructor;
            default: boolean;
        };
        autoplaySpeed: NumberConstructor;
        centerMode: {
            type: BooleanConstructor;
            default: boolean;
        };
        centerPadding: StringConstructor;
        cssEase: StringConstructor;
        dotsClass: StringConstructor;
        draggable: {
            type: BooleanConstructor;
            default: boolean;
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
        initialSlide: NumberConstructor;
        lazyLoad: {
            type: import("vue").PropType<LazyLoadTypes>;
            default: LazyLoadTypes;
        };
        rtl: {
            type: BooleanConstructor;
            default: boolean;
        };
        slide: StringConstructor;
        slidesToShow: NumberConstructor;
        slidesToScroll: NumberConstructor;
        speed: NumberConstructor;
        swipe: {
            type: BooleanConstructor;
            default: boolean;
        };
        swipeToSlide: {
            type: BooleanConstructor;
            default: boolean;
        };
        swipeEvent: {
            type: import("vue").PropType<(swipeDirection: string) => void>;
            default: (swipeDirection: string) => void;
        };
        touchMove: {
            type: BooleanConstructor;
            default: boolean;
        };
        touchThreshold: NumberConstructor;
        variableWidth: {
            type: BooleanConstructor;
            default: boolean;
        };
        useCSS: {
            type: BooleanConstructor;
            default: boolean;
        };
        slickGoTo: NumberConstructor;
        responsive: ArrayConstructor;
        dotPosition: {
            type: import("vue").PropType<DotPosition>;
            default: DotPosition;
        };
        verticalSwiping: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        centerMode: boolean;
        rtl: boolean;
        vertical: boolean;
        fade: boolean;
        infinite: boolean;
        lazyLoad: LazyLoadTypes;
        useCSS: boolean;
        dots: boolean;
        swipeToSlide: boolean;
        verticalSwiping: boolean;
        swipeEvent: (swipeDirection: string) => void;
        swipe: boolean;
        variableWidth: boolean;
        adaptiveHeight: boolean;
        beforeChange: (currentSlide: number, nextSlide: number) => void;
        afterChange: (currentSlide: number) => void;
        accessibility: boolean;
        draggable: boolean;
        autoplay: boolean;
        focusOnSelect: boolean;
        pauseOnHover: boolean;
        arrows: boolean;
        touchMove: boolean;
        effect: CarouselEffect;
        dotPosition: DotPosition;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        effect: {
            type: import("vue").PropType<CarouselEffect>;
            default: CarouselEffect;
        };
        dots: {
            type: BooleanConstructor;
            default: boolean;
        };
        vertical: {
            type: BooleanConstructor;
            default: boolean;
        };
        autoplay: {
            type: BooleanConstructor;
            default: boolean;
        };
        easing: StringConstructor;
        beforeChange: {
            type: import("vue").PropType<(currentSlide: number, nextSlide: number) => void>;
            default: (currentSlide: number, nextSlide: number) => void;
        };
        afterChange: {
            type: import("vue").PropType<(currentSlide: number) => void>;
            default: (currentSlide: number) => void;
        };
        prefixCls: StringConstructor;
        accessibility: {
            type: BooleanConstructor;
            default: boolean;
        };
        nextArrow: import("vue-types").VueTypeValidableDef<any>;
        prevArrow: import("vue-types").VueTypeValidableDef<any>;
        pauseOnHover: {
            type: BooleanConstructor;
            default: boolean;
        };
        adaptiveHeight: {
            type: BooleanConstructor;
            default: boolean;
        };
        arrows: {
            type: BooleanConstructor;
            default: boolean;
        };
        autoplaySpeed: NumberConstructor;
        centerMode: {
            type: BooleanConstructor;
            default: boolean;
        };
        centerPadding: StringConstructor;
        cssEase: StringConstructor;
        dotsClass: StringConstructor;
        draggable: {
            type: BooleanConstructor;
            default: boolean;
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
        initialSlide: NumberConstructor;
        lazyLoad: {
            type: import("vue").PropType<LazyLoadTypes>;
            default: LazyLoadTypes;
        };
        rtl: {
            type: BooleanConstructor;
            default: boolean;
        };
        slide: StringConstructor;
        slidesToShow: NumberConstructor;
        slidesToScroll: NumberConstructor;
        speed: NumberConstructor;
        swipe: {
            type: BooleanConstructor;
            default: boolean;
        };
        swipeToSlide: {
            type: BooleanConstructor;
            default: boolean;
        };
        swipeEvent: {
            type: import("vue").PropType<(swipeDirection: string) => void>;
            default: (swipeDirection: string) => void;
        };
        touchMove: {
            type: BooleanConstructor;
            default: boolean;
        };
        touchThreshold: NumberConstructor;
        variableWidth: {
            type: BooleanConstructor;
            default: boolean;
        };
        useCSS: {
            type: BooleanConstructor;
            default: boolean;
        };
        slickGoTo: NumberConstructor;
        responsive: ArrayConstructor;
        dotPosition: {
            type: import("vue").PropType<DotPosition>;
            default: DotPosition;
        };
        verticalSwiping: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        centerMode: boolean;
        rtl: boolean;
        vertical: boolean;
        fade: boolean;
        infinite: boolean;
        lazyLoad: LazyLoadTypes;
        useCSS: boolean;
        dots: boolean;
        swipeToSlide: boolean;
        verticalSwiping: boolean;
        swipeEvent: (swipeDirection: string) => void;
        swipe: boolean;
        variableWidth: boolean;
        adaptiveHeight: boolean;
        beforeChange: (currentSlide: number, nextSlide: number) => void;
        afterChange: (currentSlide: number) => void;
        accessibility: boolean;
        draggable: boolean;
        autoplay: boolean;
        focusOnSelect: boolean;
        pauseOnHover: boolean;
        arrows: boolean;
        touchMove: boolean;
        effect: CarouselEffect;
        dotPosition: DotPosition;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    effect: {
        type: import("vue").PropType<CarouselEffect>;
        default: CarouselEffect;
    };
    dots: {
        type: BooleanConstructor;
        default: boolean;
    };
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoplay: {
        type: BooleanConstructor;
        default: boolean;
    };
    easing: StringConstructor;
    beforeChange: {
        type: import("vue").PropType<(currentSlide: number, nextSlide: number) => void>;
        default: (currentSlide: number, nextSlide: number) => void;
    };
    afterChange: {
        type: import("vue").PropType<(currentSlide: number) => void>;
        default: (currentSlide: number) => void;
    };
    prefixCls: StringConstructor;
    accessibility: {
        type: BooleanConstructor;
        default: boolean;
    };
    nextArrow: import("vue-types").VueTypeValidableDef<any>;
    prevArrow: import("vue-types").VueTypeValidableDef<any>;
    pauseOnHover: {
        type: BooleanConstructor;
        default: boolean;
    };
    adaptiveHeight: {
        type: BooleanConstructor;
        default: boolean;
    };
    arrows: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoplaySpeed: NumberConstructor;
    centerMode: {
        type: BooleanConstructor;
        default: boolean;
    };
    centerPadding: StringConstructor;
    cssEase: StringConstructor;
    dotsClass: StringConstructor;
    draggable: {
        type: BooleanConstructor;
        default: boolean;
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
    initialSlide: NumberConstructor;
    lazyLoad: {
        type: import("vue").PropType<LazyLoadTypes>;
        default: LazyLoadTypes;
    };
    rtl: {
        type: BooleanConstructor;
        default: boolean;
    };
    slide: StringConstructor;
    slidesToShow: NumberConstructor;
    slidesToScroll: NumberConstructor;
    speed: NumberConstructor;
    swipe: {
        type: BooleanConstructor;
        default: boolean;
    };
    swipeToSlide: {
        type: BooleanConstructor;
        default: boolean;
    };
    swipeEvent: {
        type: import("vue").PropType<(swipeDirection: string) => void>;
        default: (swipeDirection: string) => void;
    };
    touchMove: {
        type: BooleanConstructor;
        default: boolean;
    };
    touchThreshold: NumberConstructor;
    variableWidth: {
        type: BooleanConstructor;
        default: boolean;
    };
    useCSS: {
        type: BooleanConstructor;
        default: boolean;
    };
    slickGoTo: NumberConstructor;
    responsive: ArrayConstructor;
    dotPosition: {
        type: import("vue").PropType<DotPosition>;
        default: DotPosition;
    };
    verticalSwiping: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    centerMode: boolean;
    rtl: boolean;
    vertical: boolean;
    fade: boolean;
    infinite: boolean;
    lazyLoad: LazyLoadTypes;
    useCSS: boolean;
    dots: boolean;
    swipeToSlide: boolean;
    verticalSwiping: boolean;
    swipeEvent: (swipeDirection: string) => void;
    swipe: boolean;
    variableWidth: boolean;
    adaptiveHeight: boolean;
    beforeChange: (currentSlide: number, nextSlide: number) => void;
    afterChange: (currentSlide: number) => void;
    accessibility: boolean;
    draggable: boolean;
    autoplay: boolean;
    focusOnSelect: boolean;
    pauseOnHover: boolean;
    arrows: boolean;
    touchMove: boolean;
    effect: CarouselEffect;
    dotPosition: DotPosition;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
