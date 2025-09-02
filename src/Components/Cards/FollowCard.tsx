import { FC, useState } from "react";
import Avatar from "../Avatar/Avatar.tsx";
import Typography from "../Typography/Typography.tsx";
import Button from "../Buttons/Button.tsx";
import useUser from "../../Hooks/useUser.tsx";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../Router/PathConstants.ts";
import { MaterialSymbol } from "react-material-symbols";

interface IFollowCard {
    profile_image: string,
    is_admiring: boolean,
    user_name: string,
    name: string,
    id: number,
    isFollow?: boolean,
    reFetchProfileData: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, any>>;
    currentUserid?: number;
    showButton?: boolean;
    is_admin_verified?: number;
}

const FollowCard: FC<IFollowCard> = (props) => {

    const { id, is_admiring, profile_image, user_name, name, reFetchProfileData, currentUserid, showButton = true, is_admin_verified } = props

    const { follow, unFollow } = useUser();

    const Navigation = useNavigate()

    const { mutate: unFollowMutate, isPending: unFollowIsPending } = unFollow()
    const { mutate: followMutate, isPending: followIsPending } = follow()
    const [isAdmiring, setAdmiring] = useState<boolean>(is_admiring)

    const handleUserClick = () => {
        return Navigation(PathConstants.UserView.replaceWithObject({ username: user_name }))
    }

    const triggerAction = () => {
        const handleOnSuccess = () => {
            setAdmiring(_ => !_)
            reFetchProfileData().then((e) => e)
        }

        if (isAdmiring) {
            return unFollowMutate({ admired_user_id: id }, { onSuccess: handleOnSuccess })
        } else {
            return followMutate({ admired_user_id: id }, { onSuccess: handleOnSuccess })
        }
    }

    const renderFollowButton = () => {
        if (id === currentUserid) return <></>
        return (
            <div>
                <Button isLoading={isLoading} className="" onClick={triggerAction}>{isAdmiring ? "Admiring" : "Admire"}</Button>
            </div>
        )
    }

    const isLoading = unFollowIsPending || followIsPending

    return (
        <div className="p-4 bg-white rounded flex flex-row gap-2 items-center cursor-pointer">
            <div className="flex flex-row flex-1 gap-2" onClick={handleUserClick}>
                <div className="relative">
                    <Avatar classNameAvatarContainer="w-[4rem] h-[4rem]" image={profile_image} />
                    {is_admin_verified === 1 && (
                        <MaterialSymbol className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0`} icon={"verified"} fill />
                    )}
                </div>
                <div className="flex-1">
                    <Typography variant="body" className="!font-medium">{name} {id === currentUserid && <span className="text-primary">(Me)</span>}</Typography>
                    <Typography variant="body" className="text-secondary-50">@{user_name}</Typography>
                </div>
            </div>
            {showButton && (
                renderFollowButton()
            )}
        </div>
    )
}

export default FollowCard