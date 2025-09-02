import { FC, useEffect } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import SelectBoxField from "../../../Components/Inputs/SelectBox/SelectBoxField.tsx";
import { useForm } from "react-hook-form";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import { COMMON_MESSAGE, TITLE } from "../../../Constants/Common.ts";
import Button from "../../../Components/Buttons/Button.tsx";
import useLogin from "../../../Hooks/useLogin.tsx";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import toast from "react-hot-toast";

const SelectUpdatesPage: FC<IWithRouter> = (props) => {
    const { endpoints, paths, navigate } = props

    const { isPending, data, isError } = useGetQuery({ queryKey: [endpoints.Category, "GET", { page: 1, per_page: 500 }] })

    const { control, handleSubmit } = useForm({ defaultValues: { category_ids: [] } })
    const handleOnSuccess = (data: any) => {
        toast.success(data?.message)
        return navigate(paths.YouAreIn)
    }
    const { mutate, isPending: updateIsPending } = useMutationQuery({ mutationKey: [endpoints.UpdateProfile, "POST"], onSuccess: handleOnSuccess }, true)

    const { Logout } = useLogin()
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


    const triggerSubmit = (data: any) => mutate(data)


    const renderListing = () => {
        if (isPending) return (<Loading className="w-full h-full items-center flex justify-center" />)
        if (isError) return (<Typography variant="display" size="large">{COMMON_MESSAGE}</Typography>)
        return (
            <div className="grid grid-cols-2 gap-2 mobile:grid-cols-3 tablet:grid-cols-4 tablet:gap-4 laptop:grid-cols-5 laptop:gap-6 laptopL:grid-cols-7 desktop:grid-cols-8  ">
                {
                    data?.data?.sort((a: any, b: any) => (a?.name ?? '').localeCompare(b?.name ?? ''))?.map?.((item: any, key: number) => (
                        <SelectBoxField
                            control={control}
                            label={item?.name}
                            name="category_ids"
                            value={item?.id}
                            id={`selectBox_${key}`}
                            key={key}
                        />
                    ))
                }
            </div>
        )
    }

    return (
        <section className="mx-[5%] flex-grow pb-28">
            <div className="mt-[4rem] mb-[1.5rem]">
                <Typography variant="headline" size="small" className="text-primary text-center !font-medium mt-[1.5rem] tablet:!text-[2.125rem] tablet:!leading-[1.75rem] laptop:!text-[2.375rem]">What are your topics of interest?</Typography>
                <Typography variant="body" size="large" className="text-surface-10 text-center tablet:text-[1.5rem] tablet:!leading-[2rem] mt-[1rem]">Select updates you want on {TITLE}</Typography>
            </div>
            {renderListing()}
            <div className="responsiveContainer !px-[5%] !pb-0 whiteFadeLinearGradient h-[7rem] fixed bottom-0 left-0 right-0 w-full m-auto">
                <div className="flex items-center justify-center">
                    <Button variant="primary" isLoading={updateIsPending} className="leading-[1.5rem] w-full tablet:w-[19.5rem]" onClick={handleSubmit(triggerSubmit)}>Continue</Button>
                </div>
                <div className="mt-[1rem] flex items-center justify-center">
                    <Typography variant={"body"} size={"large"} className="text-center" >Already have an account? <span onClick={() => Logout(paths.SingIn)} className="text-primary cursor-pointer">Sign in</span></Typography>
                </div>
            </div>
        </section>
    )
}

export default SelectUpdatesPage