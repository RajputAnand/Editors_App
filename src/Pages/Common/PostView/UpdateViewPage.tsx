import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import React, {FC, useRef} from "react";
import {useGetQuery} from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import PostSeo from "../../../Components/Helmet/PostSeo.tsx";
import UpdatesPostVideoCard from "../../../Components/Cards/UpdatesPostVideoCard.tsx";

const UpdateViewPage:FC<IWithRouter> = (props) => {
    const { endpoints, params } = props
    const { id } = params

    const { data, isPending } = useGetQuery({ queryKey: [endpoints.PublicPostView?.replaceWithObject({ id: id }), "GET"] })
    const videoRef = useRef<Array<HTMLVideoElement>>([]);
    if (isPending) return <Loading className="w-full h-[90vh] flex items-center justify-center"/>

    return (
        <React.Fragment>
            <PostSeo data={data}/>
            <div className="responsiveContainer h-[90vh]">
                <UpdatesPostVideoCard videoClassName="w-full" videoRef={videoRef} {...data?.data} src={data?.data?.video[0]} index={data?.data?.id} hidePostInteraction/>
            </div>
        </React.Fragment>
    )
}

export default UpdateViewPage