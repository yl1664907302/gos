import type { Plugin } from 'vue';
import type { AnchorProps } from './Anchor';
import type { AnchorLinkProps, AnchorLinkItemProps } from './AnchorLink';
import AnchorLink from './AnchorLink';
export type { AnchorLinkProps, AnchorProps, AnchorLinkItemProps };
export { AnchorLink, AnchorLink as Link };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
        getContainer: import("vue").PropType<() => import("./Anchor").AnchorContainer>;
        wrapperClass: StringConstructor;
        wrapperStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        getCurrentAnchor: import("vue").PropType<(activeLink: string) => string>;
        targetOffset: NumberConstructor;
        items: {
            type: import("vue").PropType<AnchorLinkItemProps[]>;
            default: AnchorLinkItemProps[];
        };
        direction: import("vue-types").VueTypeDef<import("./Anchor").AnchorDirection> & {
            default: import("./Anchor").AnchorDirection;
        };
        onChange: import("vue").PropType<(currentActiveLink: string) => void>;
        onClick: import("vue").PropType<(e: MouseEvent, link: {
            title: any;
            href: string;
        }) => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        direction: import("./Anchor").AnchorDirection;
        items: AnchorLinkItemProps[];
        affix: boolean;
        showInkInFixed: boolean;
        wrapperStyle: import("vue").CSSProperties;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
        getContainer: import("vue").PropType<() => import("./Anchor").AnchorContainer>;
        wrapperClass: StringConstructor;
        wrapperStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        getCurrentAnchor: import("vue").PropType<(activeLink: string) => string>;
        targetOffset: NumberConstructor;
        items: {
            type: import("vue").PropType<AnchorLinkItemProps[]>;
            default: AnchorLinkItemProps[];
        };
        direction: import("vue-types").VueTypeDef<import("./Anchor").AnchorDirection> & {
            default: import("./Anchor").AnchorDirection;
        };
        onChange: import("vue").PropType<(currentActiveLink: string) => void>;
        onClick: import("vue").PropType<(e: MouseEvent, link: {
            title: any;
            href: string;
        }) => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        direction: import("./Anchor").AnchorDirection;
        items: AnchorLinkItemProps[];
        affix: boolean;
        showInkInFixed: boolean;
        wrapperStyle: import("vue").CSSProperties;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
    getContainer: import("vue").PropType<() => import("./Anchor").AnchorContainer>;
    wrapperClass: StringConstructor;
    wrapperStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    getCurrentAnchor: import("vue").PropType<(activeLink: string) => string>;
    targetOffset: NumberConstructor;
    items: {
        type: import("vue").PropType<AnchorLinkItemProps[]>;
        default: AnchorLinkItemProps[];
    };
    direction: import("vue-types").VueTypeDef<import("./Anchor").AnchorDirection> & {
        default: import("./Anchor").AnchorDirection;
    };
    onChange: import("vue").PropType<(currentActiveLink: string) => void>;
    onClick: import("vue").PropType<(e: MouseEvent, link: {
        title: any;
        href: string;
    }) => void>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    direction: import("./Anchor").AnchorDirection;
    items: AnchorLinkItemProps[];
    affix: boolean;
    showInkInFixed: boolean;
    wrapperStyle: import("vue").CSSProperties;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Link: typeof AnchorLink;
};
export default _default;
