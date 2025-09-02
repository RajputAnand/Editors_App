import {FC} from "react";
import {MaterialSymbol} from "react-material-symbols";

interface IMoreComment {
    className?: string,
    onClick?: () => void
}

const MoreComment:FC<IMoreComment> = (props) => {

    const { className, onClick } = props

    return (
        <div className={`${className} flex items-center mx-auto cursor-pointer`} onClick={onClick}>
            <div className="w-[6.53125rem] h-[0.0625rem] bg-[#E2E3FF]"/>
            <MaterialSymbol icon={"keyboard_arrow_down"} className="!text-[2rem] text-primary"/>
            <div className="w-[6.53125rem] h-[0.0625rem] bg-[#E2E3FF]"/>
        </div>
    )
}

export default MoreComment