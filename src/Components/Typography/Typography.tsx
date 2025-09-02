import {createElement, DOMAttributes, FC, PropsWithChildren} from "react";

interface ITypography extends PropsWithChildren {
    component?: string,
    nodeProps?: DOMAttributes<any>,
    variant?: "display" | "headline" | "title" | "label" | "body",
    size?: "large" | "medium" | "small",
    className?: string,
    isError?: boolean
}

const Typography: FC<ITypography> = (props) => {
    const {
        component = "div",
        nodeProps,
        variant = "body",
        size = "large",
        className,
        children,
        isError
    } = props
    const capitalize = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return createElement(
        component,
        { className: `${isError ? "text-red-600" : ""} ${className} ${variant}${capitalize(size)}`, ...nodeProps },
        children
    )
}

export default Typography