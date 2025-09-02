import {FC, useEffect} from "react";
import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import Card from "../../../Components/Cards/Card.tsx";
import {useForm} from "react-hook-form";
import Dropdown from "../../../Components/Inputs/Dropdown/Dropdown.tsx";
import {ApproveAdmireRequest, PermissionDropDown, WhoCanAdmireMe,PermissionAdmireDropDown} from "../../../Constants/Common.ts";
import {useMutationQuery} from "../../../Api/QueryHooks/useMutationQuery.tsx";
import {extractKeyValuePairs, getValue} from "../../../Utils/extractKeyValuePairs.ts";
import toast from "react-hot-toast";
import {useGetQuery} from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";

const SettingsPage:FC<IWithRouter> = (props) => {

    const {endpoints} = props
    const { control, watch, handleSubmit } = useForm({ mode: "onChange" })
    const { data, isPending: isLoading, refetch } = useGetQuery({ queryKey: [endpoints.Me, "GET"], staleTime: Infinity});

    const handleOnSuccess = (data: any) => {
        toast.success(data?.message)
        refetch().then(r => r)
    }
    const {mutate} = useMutationQuery({ mutationKey: [endpoints.Me, "POST"], onSuccess: handleOnSuccess}, true)
    const onSubmit = (data: any) => mutate(extractKeyValuePairs(data))

    useEffect(() => {
        const subscription = watch(() => handleSubmit(onSubmit)())
        return () => subscription.unsubscribe();
    }, [watch(), onSubmit, handleSubmit])

    const renderFrom = () => {
        if (isLoading) return (
            <div className="w-full h-full flex items-center justify-center">
                <Loading/>
            </div>
        )
        return (
            <form className="flex flex-col gap-2 tablet:w-[80%] laptop:w-[60%] mx-auto pb-[3%]">
                    <Dropdown
                        label={"Who can admire me?"}
                        control={control}
                        defaultValue={getValue(WhoCanAdmireMe, data?.data?.admire_permission)}
                        name={"admire_permission"}
                        list={WhoCanAdmireMe}
                    />
                    <Dropdown
                        label={"Approve request when someone admires?"}
                        control={control}
                        defaultValue={getValue(ApproveAdmireRequest, data?.data?.approve_admire_request)}
                        name={"approve_admire_request"}
                        list={ApproveAdmireRequest}
                    />
                    <Dropdown
                        label={"Who can see my posts?"}
                        control={control}
                        defaultValue={getValue(PermissionDropDown, data?.data?.post_view_permission)}
                        name={"post_view_permission"}
                        list={PermissionDropDown}
                    />
                    <Dropdown
                        label={"Who can see my admirers?"}
                        control={control}
                        defaultValue={getValue(PermissionDropDown, data?.data?.admirers_view_permission)}
                        name={"admirers_view_permission"}
                        list={PermissionDropDown}
                    />

                    <Dropdown
                        label={"Who can comment?"}
                        control={control}
                        name={"comment_permission"}
                        defaultValue={getValue(PermissionAdmireDropDown, data?.data?.comment_permission)}
                        list={PermissionAdmireDropDown}
                    />
                    <Dropdown
                        label={"Who can view my live?"}
                        control={control}
                        name={"live_view_permission"}
                        defaultValue={getValue(PermissionDropDown, data?.data?.live_view_permission)}
                        list={PermissionDropDown}
                    />
            </form>
        )
    }

    return (
        <DashboardInnerPageTemplate navBarProps={{title: "Settings"}} isMobFullScreen>
            <Card className="tablet:py-10 h-[87%]">
                {renderFrom()}
            </Card>
        </DashboardInnerPageTemplate>
    )
}

export default SettingsPage