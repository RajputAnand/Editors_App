import { FC, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { MaterialSymbol } from "react-material-symbols";
import Typography from "../Typography/Typography";
import Button from "../Buttons/Button";
import { useMutationQuery } from "../../Api/QueryHooks/useMutationQuery";
import { Endpoints } from "../../Api/Endpoints";
import { configType } from "../../Pages/Dashboard/Live/config";

interface IInviteCard {
    profile_image: string,
    user_name: string,
    name: string,
    id: number,
    currentUserid: number
    is_admin_verified: number;
    liveId:string;
    config:configType
}

const InviteCard: FC<IInviteCard> = (props) => {

    const { id, profile_image, user_name, name, currentUserid, is_admin_verified, liveId, config } = props;    

    const [invited, setInvited] = useState<boolean>(false);

    const handleOnSuccess = () => {
        setInvited(true);
    }

    const { mutate, isPending } = useMutationQuery({
        mutationKey: [Endpoints.LiveInvite, "POST"],
        onSuccess: handleOnSuccess
    });

    const triggerAction = () => {
        mutate({
            live_id: liveId,
            agora_channel_id: config?.channelName,
            invited_user_id: id
        })
    };

    const renderFollowButton = () => {
        if (id === currentUserid) return <></>
        return (
            <div>
                <Button isLoading={isPending} disabled={invited} className={`${invited ? "!bg-gray-300" : ""}`} onClick={triggerAction}>{invited ? "Invited" : "Invite"}</Button>
            </div>
        )
    };

    return (
        <div className="p-4 bg-white rounded flex flex-row gap-2 items-center cursor-pointer">
            <div className="flex flex-row flex-1 gap-2">
                <div className="relative">
                    <Avatar classNameAvatarContainer="w-[4rem] h-[4rem]" image={profile_image} />
                    {is_admin_verified === 1 &&
                        <MaterialSymbol className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0`} icon={"verified"} fill />
                    }
                </div>
                <div className="flex-1">
                    <Typography variant="body" className="!font-medium">{name} {id === currentUserid && <span className="text-primary">(Me)</span>}</Typography>
                    <Typography variant="body" className="text-secondary-50">@{user_name}</Typography>
                </div>
            </div>
            {renderFollowButton()}
        </div>
    )
}

export default InviteCard