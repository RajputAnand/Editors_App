import {FC, useRef} from "react";
import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import DashboardWithSideBar from "../../../Templates/Dashboard/DashboardWithSideBar.tsx";
import UpdatesPostVideoCard from "../../../Components/Cards/UpdatesPostVideoCard.tsx";
import {useGetQuery} from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";

const UpdateViewPage:FC<IWithRouter> = (props) => {

    const { params, endpoints } = props
    const { id } = params
    const videoRef = useRef<Array<HTMLVideoElement>>([]);
    const {isLoading, data} = useGetQuery({ queryKey: [endpoints.Postview.replaceWithObject({ id: id })] })

    const renderListing = () => {
        
        if (isLoading) return <Loading className="w-full h-full flex items-center justify-center"/>
        return (
            <UpdatesPostVideoCard videoRef={videoRef} {...data?.data} src={data?.data?.video[0]} index={data?.data?.id}/>
        )
    }

    return (
        <DashboardWithSideBar {...props} sideBar={"find_people"}>
            
            <div className="flex-1 flex items-center justify-center grow bg-white tablet:rounded-t-[0.75rem] mx-auto">
                {renderListing()}
            </div>
        </DashboardWithSideBar>
)
}

export default UpdateViewPage