import {FC, PropsWithChildren} from "react";

interface ICard extends PropsWithChildren {
    className?: string
}

const Card:FC<ICard> = (props) => {

    const { children, className } = props

    return (
        <div className={`p-4 tablet:rounded-[1.25rem] tablet:border border-outline-light tablet:mx-[10%] ${className}`}>
            {children}
        </div>
    )
}

export default Card