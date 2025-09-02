import {FC} from "react";
import {Helmet} from "react-helmet-async";
import {TITLE} from "../../Constants/Common.ts";

interface IPostSeo {
    data: any
}

const PostSeo:FC<IPostSeo> = (props) => {

    const {data} = props

    return (
        <Helmet>
            <title>{TITLE} | {data?.data?.title} - {data?.data?.user?.name}</title>
            <meta name="title" content={`${TITLE} | ${data?.data?.title} - ${data?.data?.user?.name}}`}/>
            <meta name="description" content={data?.data?.text}/>

            <meta property="og:type" content="website"/>
            <meta property="og:url" content={window.location.href}/>
            <meta property="og:title" content={`${TITLE} | ${data?.data?.title} - ${data?.data?.user?.name}}`}/>
            <meta property="og:description" content={data?.data?.text}/>
            {data?.data?.image?.length != 0 && <meta property="og:image" content={data?.data?.image[0]}/>}

            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url" content={window.location.href}/>
            <meta property="twitter:title" content={`${TITLE} | ${data?.data?.title} - ${data?.data?.user?.name}}`}/>
            <meta property="twitter:description" content={data?.data?.text}/>
            {data?.data?.image?.length != 0 && <meta property="twitter:image" content={data?.data?.image[0]}/>}
        </Helmet>
    )
}

export default PostSeo