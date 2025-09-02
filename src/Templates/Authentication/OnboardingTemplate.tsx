import {FC, PropsWithChildren} from "react";

interface IOnboardingTemplate extends PropsWithChildren {
    className?: string,
}

const OnboardingTemplate:FC<IOnboardingTemplate> = (props) => {
    const { children, className } = props


    return (
        <section className={`flex-grow responsiveContainer flex justify-center mt-[1.5rem] ${className}`}>
            <div className={"tablet:border tablet:border-outline-light tablet:shadow-[2px_4px_7px_0px_rgba(62,97,220,0.07)] rounded-[1.25rem] tablet:py-4 tablet:px-8 tablet:bg-white tablet:w-[31rem] max-h-[37.5rem]"}>
                {children}
            </div>
        </section>
    )
}

export default OnboardingTemplate