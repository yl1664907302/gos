declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    id: StringConstructor;
    min: NumberConstructor;
    max: NumberConstructor;
    step: NumberConstructor;
    marks: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    included: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    handle: FunctionConstructor;
    dots: {
        type: BooleanConstructor;
        default: any;
    };
    vertical: {
        type: BooleanConstructor;
        default: any;
    };
    reverse: {
        type: BooleanConstructor;
        default: any;
    };
    minimumTrackStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    maximumTrackStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    handleStyle: import("vue-types").VueTypeDef<{
        [key: string]: any;
    } | {
        [key: string]: any;
    }[]>;
    trackStyle: import("vue-types").VueTypeDef<{
        [key: string]: any;
    } | {
        [key: string]: any;
    }[]>;
    railStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    dotStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    activeDotStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    draggableTrack: {
        type: BooleanConstructor;
        default: any;
    };
}>, {}, {}, {}, {
    defaultHandle({ index, directives, className, style, ...restProps }: {
        [x: string]: any;
        index: any;
        directives: any;
        className: any;
        style: any;
    }): import("vue/jsx-runtime").JSX.Element;
    onDown(e: any, position: any): void;
    onMouseDown(e: any): void;
    onTouchStart(e: any): void;
    onFocus(e: any): void;
    onBlur(e: any): void;
    onMouseUp(): void;
    onMouseMove(e: any): void;
    onTouchMove(e: any): void;
    onKeyDown(e: any): void;
    onClickMarkLabel(e: any, value: any): void;
    getSliderStart(): any;
    getSliderLength(): any;
    addDocumentTouchEvents(): void;
    addDocumentMouseEvents(): void;
    removeDocumentEvents(): void;
    focus(): void;
    blur(): void;
    calcValue(offset: any): any;
    calcValueByPos(position: any): any;
    calcOffset(value: any): number;
    saveSlider(slider: any): void;
    saveHandle(index: any, handle: any): void;
}, any, import("vue").ComponentOptionsMixin, ("blur" | "change" | "focus")[], "blur" | "change" | "focus", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: StringConstructor;
    min: NumberConstructor;
    max: NumberConstructor;
    step: NumberConstructor;
    marks: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    included: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    handle: FunctionConstructor;
    dots: {
        type: BooleanConstructor;
        default: any;
    };
    vertical: {
        type: BooleanConstructor;
        default: any;
    };
    reverse: {
        type: BooleanConstructor;
        default: any;
    };
    minimumTrackStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    maximumTrackStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    handleStyle: import("vue-types").VueTypeDef<{
        [key: string]: any;
    } | {
        [key: string]: any;
    }[]>;
    trackStyle: import("vue-types").VueTypeDef<{
        [key: string]: any;
    } | {
        [key: string]: any;
    }[]>;
    railStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    dotStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    activeDotStyle: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    draggableTrack: {
        type: BooleanConstructor;
        default: any;
    };
}>> & Readonly<{
    onFocus?: (...args: any[]) => any;
    onBlur?: (...args: any[]) => any;
    onChange?: (...args: any[]) => any;
}>, {
    vertical: boolean;
    dots: boolean;
    reverse: boolean;
    disabled: boolean;
    autofocus: boolean;
    included: boolean;
    marks: {
        [key: string]: any;
    };
    dotStyle: {
        [key: string]: any;
    };
    activeDotStyle: {
        [key: string]: any;
    };
    railStyle: {
        [key: string]: any;
    };
    minimumTrackStyle: {
        [key: string]: any;
    };
    maximumTrackStyle: {
        [key: string]: any;
    };
    draggableTrack: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
