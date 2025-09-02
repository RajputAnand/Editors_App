import { FC } from "react";
import { IWithRouter } from "../../../../Hoc/WithRouter.tsx";
import { useGetQuery } from "../../../../Api/QueryHooks/useGetQuery.tsx";
import Typography from "../../../../Components/Typography/Typography.tsx";
import Loading from "../../../../Components/Common/Loading.tsx";
import FollowCard from "../../../../Components/Cards/FollowCard.tsx";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IListFollowing extends IWithRouter {
    id: string,
    isFollowing?: boolean,
    reFetchProfileData: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, any>>;
    currentUserid: number
}

const ListFollowing: FC<IListFollowing> = (props) => {

    const { id, isFollowing, endpoints, reFetchProfileData, currentUserid } = props

    const { isLoading, data, isRefetching } = useGetQuery({ queryKey: [(!isFollowing ? endpoints.ListAdmirer : endpoints.ListAdmirning).replaceWithObject({ id: id }), "GET", { page: 1, per_page: 999999 }], refetchOnMount: true })
    // Sort the data alphabetically by name
    const sortedData = data?.data?.sort((a: any, b: any) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });
    const renderListing = () => {
        if (isLoading || isRefetching) return <Loading className="w-full h-[40rem] items-center justify-center flex" />
        return (
            <div className="flex flex-col gap-2">
                {
                    sortedData.map((item: any) => {
                        return <FollowCard {...item} currentUserid={currentUserid} reFetchProfileData={reFetchProfileData} isFollow={isFollowing} key={item?.id} />
                    })
                }
            </div>
        )
    }

    return (
        <div>
            <Typography variant={"title"} className="py-2 font-medium !text-[1.25rem] pl-2">{isFollowing ? "Admiring" : "Admirers"}</Typography>
            {renderListing()}
        </div>
    )
}

export default ListFollowing