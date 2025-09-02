import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import {
  LocalVideoTrack,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
} from "agora-rtc-react";
import { MaterialSymbol } from "react-material-symbols";
import Typography from "../../../Components/Typography/Typography.tsx";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import { Endpoints } from "../../../Api/Endpoints.ts";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import { AgoraProvider } from "../../../Templates/Agora/Agora.tsx";
import Config, { configType } from "./config.ts";
import Button from "../../../Components/Buttons/Button.tsx";
import { genRtcToken } from "../../../Utils/genRtcToken.ts";
import { AxiosResponse } from "axios";
import PromptModal from "../../../Components/Modal/PromptModal.tsx";
import Webcam from "react-webcam";
import { useLocation, useNavigate } from "react-router-dom";
import ReSharePostModal from "../../../Components/Modal/ReSharePostModal.tsx";
import { LIVE_SHARE_LINK } from "../../../Constants/Common.ts";
import { copyToClipboard } from "../../../Utils/copyToClipboard.ts";
import toast from "react-hot-toast";
import CommentsAndInviteTabs from "../../../Components/Layouts/LiveComments/CommentsAndInviteTabs.tsx";
import LiveAcceptModal from "../../../Components/Modal/LiveAcceptModal.tsx";
import LiveCountModal from "../../../Components/Modal/LiveCountModal.tsx";
import { useUserData } from "../../../Hooks/useUserDetails.tsx";

interface ILive extends IWithRouter {
  channelId: string;
  reset: () => void;
  fromReset: () => void;
  id: string;
}

interface IStartLive extends ILive {
  config: configType;
  isHost: boolean;
}

const StartLive: FC<IStartLive> = (props) => {
  const { config, params, reset, fromReset, navigate, paths, isHost } = props;
  const { id } = params;
  const agoraEngine = useRTCClient();
  const [, setMuteVideo] = useState(false);
  const [, setMuteAudio] = useState(false);
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [remoteUsers, setRemoteUsers] = useState<
    { uid: string | number; videoTrack: any; audioPlaying?: boolean }[]
  >([]);
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [watchModal, setWatchModal] = useState<boolean>(false);
  const { mutate } = useMutationQuery({
    mutationKey: [Endpoints.EndLive, "POST"],
  });
  const { mutate: joinStremMutate } = useMutationQuery({
    mutationKey: [Endpoints.JoinStream, "POST"],
    onError: () => null,
  });
  const {
    isLoading: watchIsLoading,
    data: watchCountData,
    refetch,
  } = useGetQuery({
    queryKey: [Endpoints.StreamWatchCount.replaceWithObject({ id: id }), "GET"],
    refetchInterval: 5000,
  });
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  agoraEngine.setClientRole("host").then(() => null);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  const { isConnected } = useJoin({
    appid: import.meta.env.VITE_AGORA_APP_ID,
    channel: config.channelName,
    token: config.rtcToken,
    uid: config.uid,
  });

  useEffect(() => {
    if (isConnected) {
      joinStremMutate({ live_id: id, join: true });
      agoraEngine.on("user-published", async (user, mediaType) => {
        await agoraEngine.subscribe(user, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prev) => [
            ...prev,
            { uid: user.uid, videoTrack: user.videoTrack, audioPlaying: true },
          ]);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      agoraEngine.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
        if (mediaType === "audio") {
          user.audioTrack?.stop();
        }
      });

      agoraEngine.on("user-left", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        user.audioTrack?.stop();
      });
    }
  }, [isConnected, joinStremMutate, id, agoraEngine]);

  useEffect(() => {
    return () => {
      agoraEngine.removeAllListeners();
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
    };
  }, []);

  const handleEndCall = async () => {
    agoraEngine.removeAllListeners();
    localCameraTrack?.close();
    localMicrophoneTrack?.close();
    agoraEngine.leave().then();
    fromReset();
    reset();
    mutate({});
    return navigate(paths.Live);
  };

  const handleEndModal = () => setCloseModal((_) => !_);
  const handleWatchModal = () => setWatchModal((_) => !_);
  const handleMuteVideo = () => {
    return localCameraTrack?.setEnabled(!localCameraTrack?.enabled).then(() => {
      setMuteVideo(!localCameraTrack?.enabled);
    });
  };

  const handleMuteAudio = () => {
    return localMicrophoneTrack
      ?.setEnabled(!localMicrophoneTrack?.enabled)
      .then(() => {
        setMuteAudio(!localMicrophoneTrack?.enabled);
      });
  };

  // const removeUser = (userId: string) => {
  //     // In a real app, you'd implement the logic to remove the user from the channel
  //     setRemoteUsers(prev => prev.filter(u => u.uid !== userId))
  // }

  const renderCamera = () => {
    if (isLoadingCam)
      return (
        <div
          className={`w-[2rem] h-[2rem] min-[800px]:w-[3rem] min-[800px]:h-[3rem]  rounded-full bg-[#1D9BF0] flex items-center justify-center cursor-pointer`}
        >
          <Loading iconClassName="w-[1.5rem] h-[1.5rem]" />
        </div>
      );
    return (
      <div
        className={`w-[2rem] h-[2rem] min-[800px]:w-[3rem] min-[800px]:h-[3rem] rounded-full bg-[#1D9BF0] ${
          localCameraTrack?.enabled ? "" : "!bg-red-1"
        } flex items-center justify-center cursor-pointer`}
        onClick={handleMuteVideo}
      >
        <MaterialSymbol
          icon={localCameraTrack?.enabled ? "camera_enhance" : "videocam_off"}
          fill
          className="!text-[1.2rem] min-[800px]:!text-[2rem] text-white"
        />
      </div>
    );
  };

  const renderVideoPlayer = () => {
    if (isLoadingCam)
      return <div className="w-full h-full">Loading camera</div>;

    const allUsers = [
      { uid: config.uid, videoTrack: localCameraTrack },
      ...remoteUsers,
    ];
    const gridCols =
      allUsers.length <= 3
        ? allUsers.length
        : Math.ceil(Math.sqrt(allUsers.length));
    return (
      // <div className={`relative w-full h-full ${participantCount > 1 ? 'grid grid-cols-2 gap-4' : ''}`}>
      //     <LocalVideoTrack
      //         className="w-full h-full"
      //         track={localCameraTrack} play={true}
      //     />
      //     {participantCount > 1 && (
      //         <div className="relative w-full h-full">
      //             {remoteUsers.map(user => (
      //                 <div key={user.uid} className="relative w-full h-full">
      //                     <LocalVideoTrack track={user.videoTrack} play={true} />
      //                 </div>
      //             ))}
      //         </div>
      //     )}
      // </div>
      <div className={`grid grid-cols-${gridCols} gap-2 w-full h-full`}>
        {allUsers.map((user, index) => (
          <div key={user.uid} className="relative w-full h-full">
            <LocalVideoTrack
              className="w-full h-full object-cover"
              track={user.videoTrack}
              play={true}
            />
            {/* <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {user.uid === config.uid ? 'You' : `User ${index + 1}`}
                    </div> */}
          </div>
        ))}
      </div>
    );
  };

  const renderMic = () => {
    if (isLoadingMic)
      return (
        <div
          className={`w-[2rem] h-[2rem] min-[800px]:w-[3rem] min-[800px]:h-[3rem]  rounded-full bg-[#1D9BF0] flex items-center justify-center cursor-pointer`}
        >
          <Loading iconClassName="w-[1.5rem] h-[1.5rem]" />
        </div>
      );
    return (
      <div
        className={`w-[2rem] h-[2rem] min-[800px]:w-[3rem] min-[800px]:h-[3rem]  rounded-full bg-[#1D9BF0] ${
          localMicrophoneTrack?.enabled ? "" : "!bg-red-1"
        } flex items-center justify-center cursor-pointer`}
        onClick={handleMuteAudio}
      >
        <MaterialSymbol
          icon={localMicrophoneTrack?.enabled ? "mic" : "mic_off"}
          fill
          className="!text-[1.2rem] min-[800px]:!text-[2rem] text-white"
        />
      </div>
    );
  };

  const renderEndCall = () => {
    return (
      <div
        className="w-[3.6rem] h-[3.6rem] min-[800px]:w-[4.625rem] min-[800px]:h-[4.625rem] rounded-full bg-red-1 flex items-center justify-center cursor-pointer"
        onClick={handleEndModal}
      >
        <MaterialSymbol
          icon={"call_end"}
          fill
          className="!text-[2rem] min-[800px]:!text-[3rem] text-white"
        />
      </div>
    );
  };

  const renderLiveCount = () => {
    return (
      <div
        onClick={handleWatchModal}
        className="absolute w-[2.6rem] h-[1.5rem] min-[800px]:w-[4.6rem] min-[800px]:h-[2.25rem] bg-primary rounded-[2.5rem] right-0 bottom-0 flex items-center px-2 gap-1 mb-7 mr-4 cursor-pointer"
      >
        <MaterialSymbol
          icon={"visibility"}
          className="!text-[1.4] min-[800px]:!text-[1.8rem] text-white"
          fill
        />
        <Typography variant="body" size="small" className="text-white">
          {watchIsLoading ? "" : watchCountData?.viewCount}
        </Typography>
      </div>
    );
  };

  const handleOpenReShareModal = () => setShareModal((_) => !_);

  const copyPostLink = (text: string) => {
    copyToClipboard(text);
    toast.success("Copied");
    handleOpenReShareModal();
  };

  const renderShareButton = () => {
    return (
      <div
        className="cursor-pointer absolute bg-primary rounded-[2.5rem] left-0 bottom-0 flex items-center p-2 gap-1 mb-7 ml-4"
        onClick={handleOpenReShareModal}
      >
        <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-primary flex items-center justify-center">
          <img
            src="/Assets/Images/share.png"
            className="w-[2.6rem] h-[1.5rem] min-[800px]:w-[1.5rem] min-[800px]:h-[1.5rem]"
            alt="share"
          />
        </div>
      </div>
    );
  };

  return (
    <AgoraProvider
      localCameraTrack={localCameraTrack}
      localMicrophoneTrack={localMicrophoneTrack}
    >
      <React.Fragment>
        <div className="relative flex items-center justify-center flex-col">
          <div className="relative w-[90%] h-[25rem] tablet:h-[22rem] laptop:h-[30rem] rounded-[1.5rem] overflow-hidden mt-[4rem]">
            {renderVideoPlayer()}
          </div>
          {isHost && renderShareButton()}
          <div className="flex items-center justify-center py-[4%] gap-[1rem]">
            {renderMic()}
            {renderEndCall()}
            {renderCamera()}
          </div>
          {renderLiveCount()}
        </div>
        <CommentsAndInviteTabs
          liveId={id}
          config={config}
          audience={false}
          isHost={isHost}
        />
        <PromptModal
          isOpen={closeModal}
          closeModal={handleEndModal}
          onClickYes={handleEndCall}
        >
          <div className="pb-6 flex items-center justify-center">
            <Typography variant="body" size="large" className="text-black">
              Are you certain you want to terminate this live session?
            </Typography>
          </div>
        </PromptModal>
        {shareModal && (
          <ReSharePostModal
            link={LIVE_SHARE_LINK.replaceWithObject({
              id: id,
              channelId: config.channelName,
            })}
            openReshareModal={shareModal}
            handleOpenReShareModal={handleOpenReShareModal}
            copyPostLink={copyPostLink}
          />
        )}
        <LiveCountModal
          reFetchProfileData={refetch}
          data={watchCountData?.view_users}
          open={watchModal}
          onClose={handleWatchModal}
        />
      </React.Fragment>
    </AgoraProvider>
  );
};

const Live: FC<ILive> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHost = location?.state?.isHost;
  const isInvited = location?.state?.liveInvite;
  const invitedId = location?.state?.inviteId;
  const inviteCreatedUser = {
    name: location?.state?.invitedUserName,
    profile_image: location?.state?.invitedUserProfileImage,
  };
  const { channelId } = props;
  const [join, setJoin] = useState<boolean>(false);
  const [liveAcceptModal, setLiceAcceptModal] = useState<boolean>(
    isInvited || false
  );
  const { data: profileDetails, isPending: isLoading } = useGetQuery({
    queryKey: [Endpoints.Me, "GET"],
    staleTime: Infinity,
  });
  const handleInviteModal = () => setLiceAcceptModal((_) => !_);
  const handleOnRejectSuccess = () => {
    handleInviteModal();
    navigate(-1);
  };
  const handleOnAcceptSuccess = () => {
    handleInviteModal();
    handleJoinLive();
  };
  const { mutate: acceptMutate, isPending: acceptPending } = useMutationQuery({
    mutationKey: [
      Endpoints.LiveAccept.replaceWithObject({
        id: invitedId?.toString() || "",
      }),
      "PATCH",
    ],
    onSuccess: handleOnAcceptSuccess,
  });
  const { mutate: rejectMutate, isPending: rejectPending } = useMutationQuery({
    mutationKey: [
      Endpoints.LiveReject.replaceWithObject({
        id: invitedId?.toString() || "",
      }),
      "PATCH",
    ],
    onSuccess: handleOnRejectSuccess,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      // Clean up the camera stream when the component unmounts
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []); // Run once on component mount

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Your custom logic here
      const confirmationMessage = "Are you sure you want to leave?";
      event.returnValue = confirmationMessage; // Standard for most browsers

      return confirmationMessage; // For some older browsers
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleJoinLive = () => {
    genRtcToken({
      uid: profileDetails?.data?.id,
      channelName: channelId,
      role: 1,
    }).then((res: AxiosResponse<any>) => {
      setJoin((_) => !_);
      Config.rtcToken = res?.data?.token;
      Config.channelName = channelId;
      Config.uid = profileDetails?.data?.id;
    });
  };

  const renderCamera = () => {
    return (
      <div className="relative w-[90%] h-[25rem] tablet:h-[18rem] laptop:h-[25rem] rounded-[1.5rem] overflow-hidden mt-[4rem]">
        <Webcam className="absolute object-cover h-[25rem] w-full" />
      </div>
    );
  };
  const renderStartButton = () => {
    if (isLoading)
      return (
        <Loading className="w-full h-[20rem] flex items-center justify-center" />
      );
    if (join) return <StartLive config={Config} {...props} isHost={isHost} />;
    return (
      <div className="flex items-center flex-col gap-4">
        {renderCamera()}
        <Button className="w-[80%]" onClick={handleJoinLive}>
          Start
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      {liveAcceptModal && (
        <>
          <div>
            <LiveAcceptModal
              isOpen={liveAcceptModal}
              onRejectClicked={() => rejectMutate({})}
              onAcceptClicked={() => acceptMutate({})}
              invitedUser={inviteCreatedUser}
              acceptPending={acceptPending}
              rejectPending={rejectPending}
            />
          </div>
        </>
      )}
      {renderStartButton()}
    </React.Fragment>
  );
};
export default Live;
