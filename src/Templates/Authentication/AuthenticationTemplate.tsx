import {FC, PropsWithChildren} from "react";
import Typography from "../../Components/Typography/Typography.tsx";
import {LOGO, TITLE} from "../../Constants/Common.ts";

interface AuthenticationTemplate extends PropsWithChildren {
    className?: string,
    sectionClassName? : string
}

const AuthenticationTemplate:FC<AuthenticationTemplate> = (props) => {

    const { children, className, sectionClassName } = props

    return (
        <section className={`login responsiveContainer !pt-0 grid grid-cols-1 gap-1 laptop:grid-cols-2 flex-1 ${sectionClassName}`}>
            <div />
            <div className="flex items-end justify-center mb-3">
                <img
                    src={LOGO}
                    alt={TITLE}
                    className={`hidden tablet:block tablet:w-1/4 laptop:w-1/3 mt-3`}
                />
            </div>
            <div className="flex flex-col items-center laptop:items-start laptop:mt-[-3.875rem]">
                <Typography size={"small"} variant={"headline"} className="font-[Oswald] !text-[1.5rem] !text-center !not-italic !leading-[normal] tablet:!text-[2.8125rem] laptop:!text-start laptop:!text-[3.625rem] text-surface-10">Updates from around the world</Typography>
                <Typography className="font-[Lato] !font-[800] text-primary-100 !leading-[1.5rem] !text-[1rem] tablet:!text-[2rem] tablet:!leading-[2.5rem] laptop:!text-[2.25rem] laptop:!leading-[2.75rem] laptop:mt-[1.5rem] laptop:mb-4">Join:</Typography>
                <Typography size={"large"} variant={"body"} className={"font-[Oswald]  text-center text-[#00F] laptop:mt-0 pr-0 w-[16.25rem] laptop:pr-[6rem] tablet:text-[2rem] tablet:w-auto tablet:!leading-10 laptop:!text-start laptop:!text-[2.75rem] laptop:!leading-[2.875rem]"}>See Updates, latest posts from <span className="laptop:block">around the globe.</span></Typography>
            </div>
            <div className={`loginFrom mt-[1rem] tablet:mt-24 laptop:mt-0 ${className}`}>
                {children}
               
            </div>
           
        </section>
        
    )
}
export default AuthenticationTemplate;