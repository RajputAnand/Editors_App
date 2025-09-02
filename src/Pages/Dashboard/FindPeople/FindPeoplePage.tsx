import { FC, useEffect } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import AdmireCard from "../../../Components/Cards/AdmireCard.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import { COMMON_MESSAGE } from "../../../Constants/Common.ts";
import useLogin from "../../../Hooks/useLogin.tsx";

const FindPeoplePage: FC<IWithRouter> = (props) => {

    const { endpoints, paths, navigatePage } = props
    const { Logout } = useLogin()
    const { isLoading, data, isError } = useGetQuery({ queryKey: [endpoints.FindPeople, "GET", { page: 1, per_page: 1000 }] })

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const element = document.getElementById("publicLayout");
            if (element) {
                element.classList.add("!bg-white");
            } else {
                console.error("Element with ID publicLayout not found.");
            }
        }
    }, [])


    const renderListing = () => {

        if (isLoading) return (<Loading className="flex items-center justify-center h-full" />)
        if (isError) return (<Typography variant={"body"} size="large">{COMMON_MESSAGE}</Typography>)
        return (
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-4 laptopL:grid-cols-5 desktop:grid-cols-6 place-items-stretch content-center pb-24">
                {data?.data?.map?.((item: any, key: number) => <AdmireCard userId={item?.id} key={key} name={item.name} image={item?.profile_image} username={item?.user_name} />)}
            </div>
        )
    }

    return (
        <section className="findPeoples responsiveContainer flex-1 grow flex flex-col">
            <Typography variant="headline" size="small" className="text-primary text-center !font-medium mt-[1.5rem] tablet:!text-[2.125rem] tablet:!leading-[1.75rem] laptop:!text-[2.375rem]">Find people to admire.</Typography>
            <Typography variant="body" size="large" className="text-surface-10 text-center tablet:text-[1.5rem] tablet:!leading-[2rem] mt-[1rem]">Once you admire a user, their new posts or updates will appear in your timeline.</Typography>
            <div className="mt-[2.5rem] flex-1">
                {renderListing()}
            </div>
            <div className="responsiveContainer !pb-0 whiteFadeLinearGradient h-[7rem] fixed bottom-0 left-0 right-0 w-full m-auto">
                <div className="flex items-center justify-center">
                    <Button variant="primary" className="leading-[1.5rem] w-full tablet:w-[19.5rem]" onClick={navigatePage(paths.SelectUpdates)}>Continue</Button>
                </div>
                <div className="mt-[1rem] flex items-center justify-center">
                    <Typography variant={"body"} size={"large"} className="text-center" >Already have an account? <span onClick={() => Logout(paths.SingIn)} className="text-primary cursor-pointer">Sign in</span></Typography>
                </div>
            </div>
        </section>
    )
}

export default FindPeoplePage