import { FC } from "react"
import { IWithRouter } from "../../../../Hoc/WithRouter"
import { useGetQuery } from "../../../../Api/QueryHooks/useGetQuery";
import Typography from "../../../../Components/Typography/Typography";
import Loading from "../../../../Components/Common/Loading";
import NetworkCard from "../../../../Components/Cards/NetworkCard";

interface IListNetwork extends IWithRouter {
    id: string;
}
const ListNetwork: FC<IListNetwork> = (props) => {
    const { id, endpoints } = props;
    const NETWORK_LIST_API = `${endpoints.FollowNetwork}?page=1&per_page=999999&admirer_user_id=${id}`
    const { isLoading, data, isRefetching } = useGetQuery({
        queryKey: [NETWORK_LIST_API],
        refetchOnMount: true
    });
    // Sort the data alphabetically by name
    const sortedData = data?.data?.sort((a: any, b: any) => {
        if (a.admired.name.toLowerCase() < b.admired.name.toLowerCase()) return -1;
        if (a.admired.name.toLowerCase() > b.admired.name.toLowerCase()) return 1;
        return 0;
    });
    const renderListing = () => {
        if (isLoading || isRefetching) return <Loading className="w-full h-[40rem] items-center justify-center flex" />
        return (
            <div className="flex flex-col gap-2">
                {
                    sortedData?.map((item: any) => {
                        return <NetworkCard {...item} />
                    })
                }
            </div>
        )
    }

    return (
        <div>
            <Typography variant={"title"} className="py-2 font-medium !text-[1.25rem] pl-2">Admiring Networks</Typography>
            {renderListing()}
        </div>
    )
}

export default ListNetwork