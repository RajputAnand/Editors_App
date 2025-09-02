import {FC} from "react";
import Typography from "../Typography/Typography.tsx";
import {MaterialSymbol} from "react-material-symbols";
import {useNavigate} from "react-router-dom";

export interface INavigationBar {
    title: string,
    backButton?: () => void
}

const NavigationBar:FC<INavigationBar> = (props) => {

    const { title, backButton } = props

    const navigate = useNavigate()

    const handleNavigation = () => {
        if (backButton) return backButton()
        return navigate(-1)
    }

    return (
        <div className="flex items-center p-4 laptop:px-[2.8rem] laptop:py-[1.5rem]">
            <MaterialSymbol as="a" onClick={handleNavigation} icon={"arrow_back"} className="!text-[1.5rem] mr-3"/>
            <Typography variant="headline" size="small" className="!text-xl text-black !leading-6">{title}</Typography>
        </div>
    )
}

export default NavigationBar