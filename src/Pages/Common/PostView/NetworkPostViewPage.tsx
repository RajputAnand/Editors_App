import { FC, Fragment } from 'react'
import { IWithRouter } from '../../../Hoc/WithRouter'
import { useGetQuery } from '../../../Api/QueryHooks/useGetQuery';
import Loading from '../../../Components/Common/Loading';
import PostSeo from '../../../Components/Helmet/PostSeo';
import FeedCard from '../../../Components/Cards/FeedCard';

const NetworkPostViewPage: FC<IWithRouter> = (props) => {
    const { endpoints, params } = props;
    const { id } = params;

    const { data, isPending } = useGetQuery({ queryKey: [endpoints.PublicNetworkPostView?.replaceWithObject({ id: id }), "GET"] })

    if (isPending) return <Loading className="w-full h-[90vh] flex items-center justify-center" />

    return (
        <Fragment>
            <PostSeo data={data} />
            <div className="responsiveContainer">
                <FeedCard {...data?.data} usePublic />
            </div>
        </Fragment>
    )
}

export default NetworkPostViewPage;