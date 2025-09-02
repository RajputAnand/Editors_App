import React, { FC, useEffect, useMemo, useState } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import Card from "../../../Components/Cards/Card.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import AgoraRTC, {
    RemoteUser, useClientEvent,
    useJoin,
    useRemoteUsers,
    useRTCClient
} from "agora-rtc-react";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import { useMutation } from "@tanstack/react-query";
import { Endpoints } from "../../../Api/Endpoints.ts";
import Loading from "../../../Components/Common/Loading.tsx";
import { genRtcToken } from "../../../Utils/genRtcToken.ts";
import { MaterialSymbol } from "react-material-symbols";
import Typography from "../../../Components/Typography/Typography.tsx";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import toast from "react-hot-toast";
import CommentsAndInviteTabs from "../../../Components/Layouts/LiveComments/CommentsAndInviteTabs.tsx";

interface IJoinLive extends IWithRouter {
    mutateJoin: any;
    profileDetails: any;
    rtcToken: any;
}


const JoinLive: FC<IJoinLive> = (props) => {

    const { profileDetails, params, rtcToken, mutateJoin, navigate, paths } = props
    const { channelId, id } = params
    const agoraEngine = useRTCClient();
    const [mute, setMute] = useState<boolean>(true)
    const { isLoading: watchIsLoading, data: watchCountData } = useGetQuery({ queryKey: [Endpoints.StreamWatchCount.replaceWithObject({ id: id }), "GET"], refetchInterval: 5000, })
    AgoraRTC.onAutoplayFailed = () => setMute(true)

    useEffect(() => {
        if (watchCountData) {
            if (watchCountData?.live?.isLive == 0) {
                toast.error(`${watchCountData?.live?.username} has ended the broadcast.`)
                navigate(paths.Live)
            }
        }
    }, [watchCountData]);

    useJoin({ appid: import.meta.env.VITE_AGORA_APP_ID, channel: channelId, uid: profileDetails?.id, token: rtcToken?.token })
    const RemoteUsers = useRemoteUsers();

    useClientEvent(agoraEngine, "user-joined", (user) => {
        console.log("The user", user.uid, " has joined the channel");
    });

    useClientEvent(agoraEngine, "user-left", (user) => {
        console.log("The user", user.uid, " has left the channel");
    });

    useClientEvent(agoraEngine, "user-published", (user, mediaType) => {
        agoraEngine.subscribe(user, mediaType).then(() => null)
        if (mediaType === 'video') {
            user?.videoTrack?.pipe({})
        }
        if (mediaType === 'audio') {
            if (user?.audioTrack?.isPlaying) {
                user.audioTrack.stop()
                setMute(true)
            } else {
                user?.audioTrack?.play()
                setMute(false)
            }
        }
    });



    const handleMute = () => {
        RemoteUsers.map((value) => {
            if (!mute) {
                value.audioTrack?.stop()
            } else {
                value.audioTrack?.play()
            }

        })
        setMute(_ => !_)
    }

    const renderLive = useMemo(() => {
        return (
            <div className="relative w-[90%] h-[15rem] tablet:h-[18rem] laptop:h-[30rem] rounded-[1.5rem] overflow-hidden mt-[4rem]">
                {RemoteUsers.length == 0 && (
                    <div className="w-full h-full flex items-center justify-center backdrop-blur-sm bg-gray-500/20 gap-1">
                        <Typography variant="body" size="large">Offline</Typography>
                    </div>
                )}
                {
                    RemoteUsers.map((value, index) => {
                        if (!value.hasVideo) return (
                            <div className="w-full h-full flex items-center justify-center backdrop-blur-sm bg-gray-500/20 gap-1" key={index}>
                                <Typography variant="body" size="large">Camera is off</Typography>
                                <RemoteUser className="hidden" id="video" user={value} key={index} />
                            </div>
                        )
                        return <RemoteUser id="video" user={value} key={index} />
                    })
                }
            </div>
        )
    }, [RemoteUsers])

    const renderSpeaker = () => {
        return (
            <div
                className={`w-[3rem] h-[3rem] rounded-full bg-[#1D9BF0] ${!mute ? "" : "!bg-red-1"} flex items-center justify-center cursor-pointer`}
                onClick={handleMute}>
                <MaterialSymbol icon={!mute ? "volume_up" : "volume_off"} fill className="!text-[2rem] text-white" />
            </div>
        )
    }

    const handleEndStream = async () => {
        agoraEngine.removeAllListeners()
        agoraEngine.leave().then()
        RemoteUsers.map((value) => {
            return value.audioTrack?.stop()
        })
        mutateJoin({ live_id: id, join: false })
        return navigate(paths.Live)
    }

    const renderEndCall = () => {
        return (
            <div className="w-[4.625rem] h-[4.625rem] rounded-full bg-red-1 flex items-center justify-center cursor-pointer" onClick={handleEndStream}>
                <MaterialSymbol icon={"call_end"} fill className="!text-[3rem] text-white" />
            </div>
        )
    }

    const renderLiveCount = () => {
        return (
            <div className="absolute w-[2.6rem] h-[1.5rem] min-[800px]:w-[4.6rem] min-[800px]:h-[2.25rem] bg-primary rounded-[2.5rem] right-0 bottom-0 flex items-center px-2 gap-1 mb-7 mr-4">
                <MaterialSymbol icon={"visibility"} className="!text-[1.4] tablet:!text-[1.8rem] text-white" fill />
                <Typography variant="body" size="small" className="text-white">{watchIsLoading ? "" : watchCountData?.viewCount}</Typography>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="relative flex items-center justify-center flex-col">
                {renderLive}
                <div className=" flex items-center justify-center py-[4%] gap-[1rem]">
                    {renderSpeaker()}
                    {renderEndCall()}
                </div>
                {renderLiveCount()}
                <Typography variant="body" size="large">Stream Status: {RemoteUsers?.length == 0 ? (<span className="text-red-1 font-bold">Offline</span>) : (<span className="text-green-900 font-bold">Online</span>)}</Typography>
            </div>
            <CommentsAndInviteTabs liveId={id} config={{ channelName: channelId, uid: profileDetails?.id, appId: "", rtcToken: "" }} audience />
        </React.Fragment>
    )
}

const JoinLivePage: FC<IWithRouter> = (props) => {
    const { params, endpoints } = props
    const { id, channelId } = params
    const { mutate } = useMutationQuery({ mutationKey: [endpoints.JoinStream, "POST"], onError: () => null })
    const { mutate: getRtcTokenMutate, isPending, data: rtcToken } = useMutation({ mutationKey: ["GenRtcToken"], mutationFn: genRtcToken })
    const { data: profileDetails, isPending: isLoading, mutate: getProfileData } = useMutationQuery({
        mutationKey: [Endpoints.Me, "GET"], onSuccess: (data: any) => {
            getRtcTokenMutate({ uid: data?.data?.id, channelName: channelId, role: 2 })
        }
    });

    useEffect(() => {
        getProfileData({})
        mutate({ live_id: id, join: true })
    }, [mutate, getProfileData]);

    if (isLoading || isPending) return <Loading className="w-full h-[25rem] flex items-center justify-center" />
    return (
        <DashboardInnerPageTemplate navBarProps={{ title: "" }} hideNavBar={true}>
            <Card className="my-[4%]">
                <JoinLive rtcToken={rtcToken?.data} mutateJoin={mutate} profileDetails={profileDetails?.data} {...props} />
            </Card>
        </DashboardInnerPageTemplate>
    )
}

export default JoinLivePage