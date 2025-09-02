import React, {FC} from "react";
import Avatar from "../Avatar/Avatar.tsx";
import Typography from "../Typography/Typography.tsx";
import {useNavigate} from "react-router-dom";
import {PathConstants} from "../../Router/PathConstants.ts";

interface IRecentPostCard {
    className?: string,
    profileDetails: { profile_image?: string, name: string },
    title: string,
    text: string,
    image?: Array<string>,
    id?: string
}

const RecentPostCard:FC<IRecentPostCard> = (props) => {

    const { className, profileDetails, title, text, image, id } = props
    const navigate = useNavigate();
    const handleOnClick = () => {
        // if (id) return navigate(PathConstants.Post.replaceWithObject({ id: id }))
            if (id)  navigate(PathConstants.Post.replaceWithObject({ id:id}), {state: {status:0, post:"" } });
        
        return ;
    }


    const renderProfileDetails = () => {

        return (
            <div className="flex items-center mb-2">
                <Avatar classNameAvatarContainer={`w-[3rem] h-[3rem]`} className="!text-[1.7rem]" image={profileDetails?.profile_image}/>
                <Typography variant="title" size="medium" className="text-surface-10 pl-2">{profileDetails?.name}</Typography>
            </div>
        )
    }

    const renderPostDetails = () => {
        return (
            <React.Fragment>
                {
                    image?.[0] && (<img className="w-full rounded-[0.52338rem]" alt="post image" src={image?.[0]}/>)
                }
                <Typography variant="title" size="large" className="!text-[1.25rem] !font-medium my-2 break-words">{title}</Typography>
                <Typography variant="body" size="large" className="break-words" component={"p"}>{text != null && text.truncateWithEllipsis(200)}</Typography>
            </React.Fragment>
        )
    }

    return (
        <div className={`w-full rounded-[0.75rem] border border-outline-light p-4 bg-white cursor-pointer ${className}`} onClick={handleOnClick}>
            {renderProfileDetails()}
            {renderPostDetails()}
        </div>
    )
}

export default RecentPostCard