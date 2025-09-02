import {FC} from "react";
import {LOGO, TITLE} from "../../../Constants/Common.ts";
import Typography from "../../Typography/Typography.tsx";
import {IPublicLayout} from "../PublicLayout.tsx";
import {useNavigate} from "react-router-dom";
import {PathConstants} from "../../../Router/PathConstants.ts";

interface IPublicHeader extends IPublicLayout {

}

const PublicHeader: FC<IPublicHeader> = (props) => {
    const { isOnboarding } = props

    const navigate = useNavigate();

    return (
        <header className={`flex items-center justify-between flex-col-reverse gap-1 p-[1.5rem] pb-0 tablet:flex-row tablet:items-start ${isOnboarding ? "" : "responsiveContainer text-[#0000FF] font-[Lato] !font-[800] laptop:fixed !pt-[2rem]"}`}>
            <Typography nodeProps={{ onClick: () => navigate(PathConstants.SingIn) }} size={isOnboarding ? "large" : "medium"} variant={isOnboarding ? "display" : "headline"} className={`${isOnboarding ? "!text-[1.75rem] !leading-[2.75rem] tablet:!text-[2.25rem] laptop:!text-[2.8125rem] laptop:!leading-[3.25rem]" : "tablet:text-4xl laptop:text-[2.8125rem] !text-primary-100"} text-primary cursor-pointer`} component={"h1"} >{TITLE}</Typography>
            <img
                src={LOGO}
                alt={TITLE}
                className={`${isOnboarding ? "w-[3rem] h-[3rem] tablet:w-[6.5rem] tablet:h-[6.5rem] laptop:w-[7.5rem] laptop:h-[7.5rem] " : "w-12 h-12 tablet:w-[12.5rem] tablet:h-[12.5rem] laptop:w-1/8 laptop:h-auto tablet:hidden"}`}
            />
        </header>
    )
}

export default PublicHeader