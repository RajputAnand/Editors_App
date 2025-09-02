import {FC, useState} from "react";
import {IDashboardWithSideBar} from "../DashboardWithSideBar.tsx";
import {AxiosResponse} from "axios";
import {useGetQuery} from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import AdmireCard from "../../../Components/Cards/AdmireCard.tsx";
import FooterCard from "../../../Components/Cards/FooterCard.tsx";

const FindPeople:FC<IDashboardWithSideBar> = (props) => {
    const {endpoints} = props
    const [seeMore, setSeeMore] = useState<boolean>(false)

    const handleFindPeopleFilter = (data: AxiosResponse) => {
        return data?.data?.data?.filter?.((_: any) => !_?.is_admiring)
    }

    const handleSeeMore = () => setSeeMore(_ => !_)

    const {isLoading , data, isRefetching} = useGetQuery({ queryKey: [endpoints.FindPeople, "GET", { page: 1, per_page: 10000 }],
     refetchOnMount: true }, false, handleFindPeopleFilter)

    const loadingWithText = (
        <div className="flex items-center gap-1 w-full justify-center my-8">
            <Loading iconClassName="!w-[2rem] !h-[2rem]"/>
            <Typography variant="title" size="large">Loading</Typography>
        </div>
    )


    const renderFindPeople = () => {
        if (isLoading || isRefetching) return loadingWithText
        return (
            <div className="flex flex-col gap-4">
                {data?.slice?.(0, seeMore ? 4 : 2)?.map?.((item: any, key: number) => <AdmireCard userNav userId={item?.id} key={key} name={item.name} image={item?.profile_image} username={item?.user_name}/>)}
                {
                    data?.length > 5 && !seeMore && (
                        <div className="my-4 flex items-center justify-end">
                            <Typography variant="body" size="medium" className="text-primary cursor-pointer" nodeProps={{ onClick: handleSeeMore }}>See more</Typography>
                        </div>
                    )
                }
            </div>
        )
    }
    return (
        <div className="hidden laptop:block w-[20%] pl-[1.5rem] relative">
            <Typography variant="title" size="large" className="!font-medium py-2">People you might Admire.</Typography>
            {renderFindPeople()}
            <Typography variant="title" size="large" className="!font-medium left-0 top-[70px] sticky ">
          <FooterCard />
        </Typography>
        </div>
    )
}

export default FindPeople