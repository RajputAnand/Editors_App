import {FC} from "react";
import Typography from "../Typography/Typography.tsx";
import {convertTimestampToAgo} from "../../Utils/convertTimestampToAgo.ts";
import {useNavigate} from "react-router-dom";
import {PathConstants} from "../../Router/PathConstants.ts";

interface IJoinCard {
    title: string,
    username: string,
    isLive: number,
    image: string,
    channel_id: string,
    viewers: number,
    created_at: string,
    id: string
}

const JoinCard:FC<IJoinCard> = (props) => {

    const {image, title, username, isLive, created_at, channel_id, id} = props
    const isActiveLive = Boolean(Number(isLive));
    const text = isActiveLive ? `Started ${convertTimestampToAgo(created_at)}` : "Stopped"
    const navigate = useNavigate()

    const handleOpenLive = () => {
        if (isLive) return navigate(PathConstants.LiveJoin.replaceWithObject({ channelId: channel_id, id: id }))
        return ;
    }

    return (
        <div style={{ boxShadow: "1.5px 1.5px 4px 0px rgba(0, 0, 0, 0.10)" }} className="rounded-[0.75rem] flex overflow-hidden cursor-pointer" onClick={handleOpenLive}>
            <img src={image} className="w-[7.1rem] h-[5.5rem] rounded-[0.75rem]" alt={"live image"}/>
            <div className="p-2">
                <Typography className="text-surface-10" variant="body" size="large">{title}</Typography>
                <Typography className="text-surface-10" variant="body" size="large">{username}</Typography>
                <Typography className="text-black" variant="body" size="large">{text}</Typography>
            </div>
        </div>
    )
}

export default JoinCard