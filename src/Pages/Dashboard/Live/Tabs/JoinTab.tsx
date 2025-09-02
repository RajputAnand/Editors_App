import { FC } from "react";
import { IWithRouter } from "../../../../Hoc/WithRouter.tsx";
import Card from "../../../../Components/Cards/Card.tsx";
import JoinCard from "../../../../Components/Cards/JoinCard.tsx";
import { useGetQuery } from "../../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../../Components/Common/Loading.tsx";
import Typography from "../../../../Components/Typography/Typography.tsx";

const JoinTab: FC<IWithRouter> = (props) => {

    const { endpoints } = props;
    const { isLoading, data } = useGetQuery({ queryKey: [endpoints.ListLive, "GET"], refetchInterval: 5000 });

    const renderListing = () => {
        if (isLoading) return (
            <div className="flex items-center justify-center">
                <Loading className="px-2" iconClassName="w-[2rem] h-[2rem]" />
                <Typography variant="body" size="large">Loading</Typography>
            </div>
        );
        return data?.map((item: any, index: number) => {
            return (
                <JoinCard {...item} key={index} />
            )
        });
    };

    return (
        <Card className="border-none flex flex-col gap-[2.5rem]">
            {renderListing()}
        </Card>
    )
}

export default JoinTab