import React, {
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { MaterialSymbol } from "react-material-symbols";
import Loading from "../Common/Loading.tsx";
import Typography from "../Typography/Typography.tsx";
import Avatar from "../Avatar/Avatar.tsx";
import { convertTimestampToAgo } from "../../Utils/convertTimestampToAgo.ts";
import PostInteraction from "../PostInteraction/PostInteraction.tsx";
import { useGetQuery } from "../../Api/QueryHooks/useGetQuery.tsx";
import { Endpoints } from "../../Api/Endpoints.ts";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../Router/PathConstants.ts";
import Button from "../Buttons/Button.tsx";
import useUser from "../../Hooks/useUser.tsx";
import UpdateVideoModal from "../Modal/UpdateVideoModal.tsx";
import { LOGO } from "../../Constants/Common.ts";
import { useSelector } from "react-redux";
export interface IUpdatesPostVideoCard {
  index: number;
  videoRef: MutableRefObject<HTMLVideoElement[]>;
  src: string;
  user: {
    user_name: string;
    name: string;
    profile_image?: string;
    id: string;
    isFollowing: boolean;
    is_admin_verified?:number
  };
  text: string;
  title: string;
  image: Array<string>;
  video?: Array<string>;
  like_count: number;
  location: string;
  reshare_count: string;
  choice?: string;
  comment_count: string;
  created_at: string;
  is_liked: any;
  id: string;
  hidePostInteraction?: boolean;
  videoClassName?: string;
  [x: string]: any;
}

const UpdatesPostVideoCard: FC<IUpdatesPostVideoCard> = (props) => {
  const {
    index,
    videoRef,
    src,
    title,
    user,
    location,
    created_at,
    id,
    text,
    hidePostInteraction,
    videoClassName,
  } = props;
  const selector = useSelector((state: any) => state.AuthData)
  
  const {
    data: postDetailData,
    isLoading: IsLoadingPostDetails,
    refetch: PostDetailReFetch,
  } = useGetQuery({
    queryKey: [Endpoints.Postview.replaceWithObject({ id: id }), "GET"],
    enabled: !hidePostInteraction,
  });
  const {
    isLoading: isProfileloading,
    data,
    refetch: reFetchMe,
  } = useGetQuery({
    queryKey: [
      Endpoints.UserView.replaceWithObject({ username: user.user_name }),
      "GET",
    ],
    staleTime: Infinity,
    // refetchInterval: 5000,
  });

  const seekBarRef = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState<boolean>(false);
  const [isAdmiring, setAdmiring] = useState<boolean>(user?.isFollowing);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const navigate = useNavigate();
  const { follow, unFollow } = useUser();
  const { mutate: unFollowMutate, isPending: unFollowIsPending } = unFollow();
  const { mutate: followMutate, isPending: followIsPending } = follow();
  const handleOnClickVideo = () => {
    if (videoRef.current[index]?.paused) {
      videoRef.current[index]?.play().then((r) => r);
    } else {
      videoRef.current[index]?.pause();
    }
  };
  const handleOpenModal = () => {
    setOpenVideo((_) => !_);
  };
  const handleTimeUpdate = () => {
    const video = videoRef.current[index];
    const seekBar = seekBarRef.current;
    if (video && seekBar) {
      const percentage = (video?.currentTime / video?.duration) * 100;
      seekBar.style.width = `${percentage}%`;
    }
  };

  const handleOnLoad = () => setLoading(false);

  const handleUserClick = (username: string) => () =>
    navigate(PathConstants.UserView.replaceWithObject({ username: username }));

  const handleSeekBarClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = videoRef.current[index];
    const seekBar = seekBarRef.current;
    if (video && seekBar) {
      const rect = seekBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const newTime = (percentage / 100) * video.duration;
      if (!isNaN(newTime) && !isFinite(newTime)) {
        video.currentTime = newTime;
      }
    }
  };

  const handleMuteUnmute = () => {
    const video = videoRef.current[index];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  useEffect(() => {
    reFetchMe().then((_) => _);
    const video = videoRef.current[index];
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadeddata", handleOnLoad, false);
    }
    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const handleOnPlay = () => {
    setPlay(true);
    videoRef.current.map((value) => {
      if (value.id != `updatesVideoPlayer-${index}`) {
        return value.pause();
      }
    });
  };
  // Create video
  const renderAddvideopost = () => {
    return (
      <div className="flex items-center justify-end mb-2 !cursor-pointer"
      // onClick={handleOpenModal}
      >
          <Button
        variant="outline"
        className="!p-0 !pl-4 !pr-6 !py-[0.5rem] flex laptop:!ml-[5%] "
        onClick={handleOpenModal}
      >
        <MaterialSymbol
           icon={"play_circle"}
          className="!text-[1.5rem] cursor-pointer text-primary"
          fill
          as={"div"}
        />
        <Typography variant="title" size="medium">
        Create video
        </Typography>
      </Button>
        {/* <Button
          variant="outline"
          className="!p-0 !pl-4 !pr-6 !py-[0.5rem] flex laptop:!ml-[5%] !cursor-pointer"
          onClick={()=>handleOpenModal()}
        >
          <MaterialSymbol
            icon={"play_circle"}
            className="!text-[1.5rem] !cursor-pointer text-primary"
            fill
            as={"div"}
          />
          <Typography
            variant="title"
            size="medium"
            className="!cursor-pointer ml-2"
          >
            Create video
          </Typography>
        </Button> */}
        {/* <Button
        variant="outline"
        className="!p-0 !pl-4 !pr-6 !py-[0.5rem] !hidden laptop:!flex laptop:!ml-[5%] cursor-pointer"
        onClick={handleOpenModal}
      >
        <MaterialSymbol
          icon={"play_circle"}
          className="!text-[1.5rem] cursor-pointer text-primary !hidden b500:!inline-block"
          fill
          as={"div"}
        />
        <Typography variant="title" size="medium" className="cursor-pointer">
          Create video
        </Typography>
      </Button> */}
        {/* <MaterialSymbol
       onClick={handleOpenModal}
        icon={"play_circle"}
        className="!text-[2rem] cursor-pointer text-primary ml-4 !hidden b500:!inline-block laptop:!hidden"
        fill
        as={"div"}
      /> */}
      </div>
    );
  };
  const renderVideo = () => {
    return (
      <React.Fragment>
        {renderAddvideopost()}
        {hidePostInteraction ? (
          <></>
        ) : (
          isLoading && (
            <Loading className="absolute inset-0 flex items-center justify-center bg-black" />
          )
        )}
        {/* <div className="relative"> */}
        <video
          preload="preload"
          autoPlay
          onPlay={handleOnPlay}
          onPause={() => setPlay(false)}
          ref={(el: any) => (videoRef.current[index] = el)}
          loop
          id={`updatesVideoPlayer-${index}`}
          onClick={handleOnClickVideo}
          className={`bg-black h-full z-[-1] ${videoClassName} scrollbarzindex `}
        >
          <source src={src} />
        </video>
       
      </React.Fragment>
    );
  };

  const renderPostInteraction = () => {
    if (hidePostInteraction) return <></>;
    if (IsLoadingPostDetails)
      return <div className="w-[1.5rem] laptop:w-[2.8rem]" />;
    return (
      <PostInteraction
        role={data?.data?.role}
        {...props}
        {...postDetailData?.data}
        PostDetailReFetch={PostDetailReFetch}
      />
    );
  };
  // admire action toggle

  const triggerAction = () => {
    const handleOnSuccess = (action: boolean) => {
      setAdmiring(action);
      reFetchMe().then((_) => _);
    };
    if (data?.data?.is_following === 1) {
      return unFollowMutate(
        { admired_user_id: user.id },
        { onSuccess: () => handleOnSuccess(!data?.data?.is_following) }
      );
    } else {
      return followMutate(
        { admired_user_id: user.id },
        { onSuccess: () => handleOnSuccess(!data?.data?.is_following) }
      );
    }
  };

  const renderAdmireButton = () => {
    if (isProfileloading) return <React.Fragment />;
    if (data?.data?.is_me) return <React.Fragment />;
    if (data?.data?.role == 5) return <React.Fragment />;
    return (
      <Button
        id="updateadmire"
        isLoading={isProfileloading || unFollowIsPending || followIsPending}
        // className="w-2/4 max-w-[8rem] mt-4"
        className=" buttonPrimary titleMedium
         text-white text-center 
        "
        //  px-[1.5rem] py-[0.625rem]  min-w-[9.38rem] !leading-none !font-medium
        onClick={triggerAction}
      >
        {data?.data?.is_following ? "Admiring" : "Admire"}
      </Button>
    );
  };
  return (
    <div className="h-full flex items-end justify-center">
      <div className="h-full relative w-full tablet:rounded-2xl overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 m-4 z-10">
          <div className="flex flex-row items-end">
            <div className="flex-1 z-20">
              <div className="flex mb-4">
                <div
                  className="mr-2 relative opennotification"
                  onClick={handleUserClick(user?.user_name)}
                >
                  <Avatar
                    image={user?.profile_image}
                    classNameAvatarContainer="!w-[3rem] !h-[3rem]"
                    className="!text-[1.9rem]"
                  />
                       {user?.is_admin_verified=== 1 && <>
<MaterialSymbol className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0 responsiveverified`} icon={"verified"} fill/>
</>  }
                </div>
                <div
                  onClick={handleUserClick(user?.user_name)}
                  className="cursor-pointer text-left"
                >
                  <Typography
                    variant="title"
                    size="medium"
                    className="text-white"
                  >
                    {user?.name}
                  </Typography>
                  <div className="flex items-center">
                    <Typography
                      className="!text-secondary-50 flex items-center flex-wrap"
                      variant="body"
                      size="large"
                    >
                      <span className="flex items-center flex-wrap">
                        {" "}
                        {user?.user_name
                          ? `@${user?.user_name}`
                          : `@${user?.name}`}{" "}
                        <span className="flex items-center flex-wrap">
                          {location ? (
                            <span className="flex items-center">
                              <MaterialSymbol
                                icon={"location_on"}
                                className="text-surface-20 !text-[1.2rem] text-center"
                              />
                              {location}
                              {""}~{convertTimestampToAgo(created_at)}
                            </span>
                          ) : (
                            <span className="flex items-center flex-wrap">
                              <span className="mx-1">~</span>{" "}
                              {convertTimestampToAgo(created_at)}
                            </span>
                          )}
                        </span>
                      </span>
                      {/* <span className="flex items-center">
                        {location && (
                          <MaterialSymbol
                            icon={"location_on"}
                            className="text-surface-20 !text-[1.2rem] text-center"
                          />
                        )}{" "}
                        {location ? (
                          <> {location} <span className="mx-1">~</span>
                          </>
                        ) : (
                          <span className="mx-1">~</span>
                        )}{" "}
                        {convertTimestampToAgo(created_at)}
                      </span> */}
                    </Typography>
                  </div>
                </div>
                <div className="ml-auto">{renderAdmireButton()}</div>
              </div>
              <Typography variant="title" size="medium" className="text-white text-left">
                {title}
              </Typography>
              <Typography variant="body" size="small" className="text-gray-300 text-left">
                {text?.truncateWithEllipsis(190)}
              </Typography>
            </div>
            <div className="laptop:hidden">{renderPostInteraction()}</div>
          </div>

          <div className="flex flex-row items-center mt-2">
       
            <MaterialSymbol
              icon={play ? "pause" : "play_arrow"}
              fill
              className="text-white pr-4 !text-[1.5rem]"
              as="button"
              onClick={handleOnClickVideo}
            />
            <div
              className="seek-bar-container bg-white h-1 rounded-2xl overflow-hidden flex-1"
              onClick={handleSeekBarClick}
            >
              <div
                ref={seekBarRef}
                className="seek-bar h-1 rounded-2xl bg-primary"
              ></div>
            </div>
            <div className="absolute left-[50%] bottom-[30px] text-center w-[4rem] h-[4rem]" id="responsiveLogomobile">
          <img src={LOGO} alt="logo" className={`w-[2rem] h-[2rem]`} />
        </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 z-10 m-4">
          <MaterialSymbol
            icon={isMuted ? "volume_off" : "volume_up"}
            as={"button"}
            onClick={handleMuteUnmute}
            className="!text-[1.5rem] text-white z-10"
          />
        </div>
        {/* Logo icon */}
      
        {renderVideo()}
      </div>
      <div className="hidden laptop:block px-3">{renderPostInteraction()}</div>
      {openVideo && (
        <UpdateVideoModal
          // usePublic={usePublic}
          // post_id={id}
          open={openVideo}
          // onReportSuccess={onPinpostSuccess}
          handle={handleOpenModal}
        />
      )}
    </div>
  );
};

export default UpdatesPostVideoCard;
