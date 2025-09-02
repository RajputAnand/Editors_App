import React, { FC } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import PostCard from "../../../Components/Cards/PostCard.tsx";
import PostSeo from "../../../Components/Helmet/PostSeo.tsx";

const PostViewPage: FC<IWithRouter> = (props) => {

    const { endpoints, params } = props
    const { id } = params

    const { data, isPending } = useGetQuery({ queryKey: [endpoints.PublicPostView?.replaceWithObject({ id: id }), "GET"] })

    if (isPending) return <Loading className="w-full h-[90vh] flex items-center justify-center" />

    return (
        <React.Fragment>
            <PostSeo data={data} />
            <div className="responsiveContainer">
                <PostCard {...data?.data} usePublic />
            </div>
        </React.Fragment>
    )
}

export default PostViewPage