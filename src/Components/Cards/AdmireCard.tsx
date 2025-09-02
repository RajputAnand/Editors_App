import {FC, useState} from "react";
import Typography from "../Typography/Typography.tsx";
import {MaterialSymbol} from "react-material-symbols";
import Button from "../Buttons/Button.tsx";
import useUser from "../../Hooks/useUser.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {PathConstants} from "../../Router/PathConstants.ts";
import {useQueryClient} from "@tanstack/react-query";
import {Endpoints} from "../../Api/Endpoints.ts";

interface IAdmireCard {
    image?: string,
    name: string,
    username?: string,
    userId: number,
    userNav?: boolean
}

const AdmireCard: FC<IAdmireCard> = (props) => {

    const { username, image , name, userId, userNav} = props
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();
    const isMe = location.pathname == PathConstants.Profile;
    const handleUserClick = (username: string) => () => {
        if (userNav) return navigate(PathConstants.UserView.replaceWithObject({ username:username }))
        return;
    }

    const [isFollowed, setFollowed] = useState<boolean>(false)

    const { follow, unFollow } = useUser();

    const { mutate: unFollowMutate, isPending: unFollowIsPending } = unFollow({  })
    const { mutate: followMutate, isPending: followIsPending } = follow()


    const triggerAction = () => {

        const handleOnSuccess = (action: boolean) => {
            setFollowed(action)
            if (isMe) {
                return queryClient.invalidateQueries({ queryKey: [Endpoints.Me] })
            }
        }

        if (isFollowed) {
            return unFollowMutate({ admired_user_id: userId }, { onSuccess: () => handleOnSuccess(false) })
        } else {
            return followMutate({ admired_user_id: userId }, { onSuccess: () => handleOnSuccess(true) })
        }
    }

    const renderImage = () => {
        if (!Boolean(image)) return (
            <div>
                <div className="w-[3rem] h-[3rem] bg-[#0000001F] flex items-center justify-center cursor-pointer rounded-full">
                    <MaterialSymbol className="text-white text-center !text-[1.625rem]" icon={"person_2"} fill/>
                </div>
            </div>
        )
        return (
            <div className="w-[3rem] h-[3rem] cursor-pointer">
                <img loading="lazy" className="profilenotification w-full h-full  rounded-full shadow-[0px_1px_3px_1px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.30)]" alt="user profile" src={image}/>
            </div>
        )
    }

    return (
        <div className="min-w-[7rem] mx-[10%] tablet:mx-0 min-h-[13.625rem] border border-outline-light rounded-xl p-4 flex flex-col items-center justify-center bg-[#FCF8FD]">
            <div className="flex flex-row w-full items-center justify-center" onClick={handleUserClick(username as any)}>
                <div className="pr-2">
                    {renderImage()}
                </div>
                <div className="max-w-[60%]">
                    <Typography variant="title" size="medium" className="text-surface-20 !font-medium truncate">{name}</Typography>
                    { username && <Typography variant="body" size="medium" className="text-secondary-50 !font-normal truncate">@{username}</Typography>}
                </div>
            </div>
            <div className="mt-[2rem]">
                <Button onClick={triggerAction} isLoading={unFollowIsPending || followIsPending} 
                variant="primary" className="!leading-none !font-medium min-w-[9.38rem]">{isFollowed ? "Admired" : "Admire"}</Button>
            </div>
        </div>
    )
}

export default AdmireCard
