import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { AnchorLinkItemProps } from './AnchorLink';
export type AnchorDirection = 'vertical' | 'horizontal';
export type AnchorContainer = HTMLElement | Window;
export declare const anchorProps: () => {
    prefixCls: StringConstructor;
    offsetTop: NumberConstructor;
    bounds: NumberConstructor;
    affix: {
        type: BooleanConstructor;
        default: boolean;
    };
    showInkInFixed: {
        type: BooleanConstructor;
        default: boolean;
    };
    getContainer: PropType<() => AnchorContainer>;
    wrapperClass: StringConstructor;
    wrapperStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    getCurrentAnchor: PropType<(activeLink: string) => string>;
    targetOffset: NumberConstructor;
    items: {
        type: PropType<AnchorLinkItemProps[]>;
        default: AnchorLinkItemProps[];
    };
    direction: import("vue-types").VueTypeDef<AnchorDirection> & {
        default: AnchorDirection;
    };
    onChange: PropType<(currentActiveLink: string) => void>;
    onClick: PropType<(e: MouseEvent, link: {
        title: any;
        href: string;
    }) => void>;
};
export type AnchorProps = Partial<ExtractPropTypes<ReturnType<typeof anchorProps>>>;
export interface AnchorState {
    scrollContainer: HTMLElement | Window;
    links: string[];
    scrollEvent: any;
    animating: boolean;
}
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    offsetTop: NumberConstructor;
    bounds: NumberConstructor;
    affix: {
        type: BooleanConstructor;
        default: boolean;
    };
    showInkInFixed: {
        type: BooleanConstructor;
        default: boolean;
    };
    getContainer: PropType<() => AnchorContainer>;
    wrapperClass: StringConstructor;
    wrapperStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    getCurrentAnchor: PropType<(activeLink: string) => string>;
    targetOffset: NumberConstructor;
    items: {
        type: PropType<AnchorLinkItemProps[]>;
        default: AnchorLinkItemProps[];
    };
    direction: import("vue-types").VueTypeDef<AnchorDirection> & {
        default: AnchorDirection;
    };
    onChange: PropType<(currentActiveLink: string) => void>;
    onClick: PropType<(e: MouseEvent, link: {
        title: any;
        href: string;
    }) => void>;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    offsetTop: NumberConstructor;
    bounds: NumberConstructor;
    affix: {
        type: BooleanConstructor;
        default: boolean;
    };
    showInkInFixed: {
        type: BooleanConstructor;
        default: boolean;
    };
    getContainer: PropType<() => AnchorContainer>;
    wrapperClass: StringConstructor;
    wrapperStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    getCurrentAnchor: PropType<(activeLink: string) => string>;
    targetOffset: NumberConstructor;
    items: {
        type: PropType<AnchorLinkItemProps[]>;
        default: AnchorLinkItemProps[];
    };
    direction: import("vue-types").VueTypeDef<AnchorDirection> & {
        default: AnchorDirection;
    };
    onChange: PropType<(currentActiveLink: string) => void>;
    onClick: PropType<(e: MouseEvent, link: {
        title: any;
        href: string;
    }) => void>;
}>> & Readonly<{}>, {
    direction: AnchorDirection;
    items: AnchorLinkItemProps[];
    affix: boolean;
    showInkInFixed: boolean;
    wrapperStyle: CSSProperties;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
