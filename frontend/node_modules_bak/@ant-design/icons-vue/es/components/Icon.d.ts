import { Component, FunctionalComponent, HTMLAttributes } from 'vue';
export interface IconBaseProps extends HTMLAttributes {
    spin?: boolean;
    rotate?: number;
}
export interface CustomIconComponentProps {
    width: string | number;
    height: string | number;
    fill: string;
    viewBox?: string;
}
export interface IconComponentProps extends IconBaseProps {
    viewBox?: string;
    component?: Component;
    ariaLabel?: string;
}
export interface IconType extends FunctionalComponent<IconComponentProps> {
    displayName: string;
}
declare const Icon: IconType;
export default Icon;
