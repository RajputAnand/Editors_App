import React, { FC, Fragment, useState } from "react";
import Avatar from "../Avatar/Avatar.tsx";
import Typography from "../Typography/Typography.tsx";
import { MaterialSymbol } from "react-material-symbols";
import Button from "../Buttons/Button.tsx";
import useUser from "../../Hooks/useUser.tsx";
import { TScreens } from "../../Pages/Dashboard/Me/MePage.tsx";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../Router/PathConstants.ts";

interface IProfileCard {
  banner_image?: string;
  profile_image: string;
  name: string;
  user_name: string;
  bio: string;
  admired_count: string;
  admirer_count: string;
  like_count: string;
  post_count: string;
  network_admirer_count: string;
  isMe?: boolean;
  [x: string]: any;
  handleScreen: (action: TScreens) => void;
  screen: TScreens;
  isRefetching: boolean;
  is_admin_verified?: number;
  reFetchProfileData: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, any>>;
}

const ProfileCard: FC<IProfileCard> = (props) => {
  const {
    banner_image,
    isRefetching,
    profile_image,
    name,
    user_name,
    bio,
    admirer_count,
    like_count,
    post_count,
    network_admirer_count,
    isMe,
    admired_count,
    is_admin_verified,
    followers,
    id,
    currentUserId,
    handleScreen,
    screen,
    reFetchProfileData,
    role,
    website,
    school,
    hobby,
    location,
    address,
    phone,
    email,
  } = props;
  const navigate = useNavigate();
  // const isFollowed = (JSON.parse(followers) as Array<any>).includes(
  //   currentUserId
  // );
  const isFollowed = Array.isArray(followers)
    ? followers.includes(currentUserId)
    : (JSON.parse(followers || "[]") as Array<any>).includes(currentUserId);
  const [isAdmiring, setAdmiring] = useState<boolean>(isFollowed);
  const { follow, unFollow } = useUser();

  const { mutate: unFollowMutate, isPending: unFollowIsPending } = unFollow();
  const { mutate: followMutate, isPending: followIsPending } = follow();

  // useEffect(()=>{

  //   },[])
  const triggerAction = () => {
    const handleOnSuccess = (action: boolean) => {
      setAdmiring(action);
      reFetchProfileData().then((_) => _);
    };

    if (isAdmiring) {
      return unFollowMutate(
        { admired_user_id: id },
        { onSuccess: () => handleOnSuccess(!isAdmiring) }
      );
    } else {
      return followMutate(
        { admired_user_id: id },
        { onSuccess: () => handleOnSuccess(!isAdmiring) }
      );
    }
  };

  const triggerScreenSwitch = (action: TScreens) => () => handleScreen(action);

  const renderBannerImage = () => {
    const CClassName = "w-full h-[10rem] tablet:h-[7rem]";
    if (banner_image)
      return (
        <img
          src={banner_image}
          className={`${CClassName} object-cover`}
          alt="banner image"
        />
      );
    return <div className={`${CClassName} bg-surface-light`} />;
  };

  const onViewMessageClicked = () => {
    navigate(PathConstants.MessageView.replaceWithObject({ id: id }));
  };

  const renderProfileImage = () => {
    return (
      <div className="mt-[-3.5rem] flex items-center justify-center">
        <div className="relative">
          <Avatar
            // classNameImage="opennotification"
            image={profile_image}
            className="!text-[3rem]"
            classNameAvatarContainer={`h-[4.5rem] w-[4.5rem] ${
              profile_image ? "" : "!bg-surface-light"
            }`}
          />
          {is_admin_verified === 1 && (
            <>
              <MaterialSymbol
                className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0`}
                icon={"verified"}
                fill
              />
            </>
          )}
        </div>
      </div>
    );
  };

  const renderProfileDetails = () => {
    return (
      <div className="relative w-full flex flex-col items-center !z-0">
        {/* Profile details */}
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <Typography variant="title" size="small" className="text-black">
              {name}
            </Typography>
            <Typography variant="body" size="small" className="text-[#8B90A5]">
              @{user_name}
            </Typography>
          </div>

          {/* Message icon on the right */}
          {currentUserId !== id && (
            <div
              className="absolute ml-[110px] flex flex-row flex-wrap items-center cursor-pointer"
              onClick={onViewMessageClicked}
            >
              {/* <MaterialSymbol
                icon={"mail"}
                fill
                className={`!text-[1.5rem] text-primary my-1 w-[2rem] h-[2rem] text-center !flex items-center justify-center`}
                as={"div"}
              />
              <Typography
                variant="body"
                size="small"
                className="text-[0.625rem] text-[#46464A]"
              >
                Message
              </Typography> */}
              <img
                className="!text-[1.5rem] w-[3.4rem] h-[1.7rem]"
                src="Assets/Images/chat.png"
                alt="Chat"
              />
            </div>
          )}
        </div>
        <Typography
          variant="body"
          size="small"
          className="text-black text-center mx-8 mt-1"
        >
          {bio}
        </Typography>
      </div>
    );
  };

  const renderProfileCounts = () => {
    return (
      <React.Fragment>
        <div className={`grid grid-cols-5 gap-8 mt-2`}>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={triggerScreenSwitch("Admirers")}
          >
            <MaterialSymbol
              icon={"groups"}
              fill
              className={`!text-[1.5rem] text-primary my-1 w-[3rem] h-[3rem] text-center !flex items-center justify-center ${
                screen == "Admirers" ? "bg-primary/20 rounded-full" : ""
              }`}
              as={"div"}
            />
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-[#46464A]"
            >
              Admirers
            </Typography>
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-black"
            >
              {isRefetching ? "" : admired_count}
            </Typography>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={triggerScreenSwitch("Admiring")}
          >
            <MaterialSymbol
              icon={"directions_walk"}
              fill
              className={`!text-[1.5rem] text-primary my-1 w-[3rem] h-[3rem] text-center !flex items-center justify-center ${
                screen == "Admiring" ? "bg-primary/20 rounded-full" : ""
              }`}
              as={"div"}
            />
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-[#46464A]"
            >
              Admiring
            </Typography>
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-black"
            >
              {isRefetching ? "" : admirer_count}
            </Typography>
          </div>
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={triggerScreenSwitch("Network")}
          >
            <img
              src="Assets/Images/network-icon.png"
              // icon={"hub"}
              // fill
              className={`!text-[1.5rem] text-primary p-[9px] my-1 w-[3rem] h-[3rem] text-center !flex items-center justify-center ${
                screen == "Network" ? "bg-primary/20 rounded-full" : ""
              }`}
              // as={"div"}
            />
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-center text-[#46464A]"
            >
              Networks
            </Typography>
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-black"
            >
              {isRefetching ? "" : network_admirer_count}
            </Typography>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <MaterialSymbol
              icon={"favorite"}
              fill
              className={`!text-[1.5rem] text-red-1 my-1 w-[3rem] h-[3rem] text-center !flex items-center justify-center`}
              as={"div"}
            />
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-[#46464A]"
            >
              Likes
            </Typography>
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-black"
            >
              {like_count}
            </Typography>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={triggerScreenSwitch("Posts")}
          >
            <MaterialSymbol
              icon={"chat_bubble"}
              fill
              className={`!text-[1.5rem] text-primary my-1 w-[3rem] h-[3rem] text-center !flex items-center justify-center ${
                screen == "Posts" ? "bg-primary/20 rounded-full" : ""
              }`}
              as={"div"}
            />
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-[#46464A]"
            >
              Posts
            </Typography>
            <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-black"
            >
              {isRefetching ? "" : post_count}
            </Typography>
          </div>
          {/* {currentUserId !== id &&
            (<div
              className="flex flex-col items-center cursor-pointer"
              onClick={onViewMessageClicked}
            >
              <MaterialSymbol
                icon={"mail"}
                fill
                className={`!text-[1.5rem] text-primary my-1 w-[3rem] h-[3rem] text-center !flex items-center justify-center ${screen == "Message" ? "bg-primary/20 rounded-full" : ""
                  }`}
                as={"div"}
              />
              <Typography
                variant="body"
                size="small"
                className="text-[0.625rem] text-[#46464A]"
              >
                Message
              </Typography>
              <Typography
              variant="body"
              size="small"
              className="text-[0.625rem] text-black"
            >
              {isRefetching ? "" : post_count}
            </Typography>
            </div>)} */}
        </div>
      </React.Fragment>
    );
  };

  const renderAboutSection = () => {
    if (!hobby && !school && !location && !address && !website)
      return <Fragment />;
    return (
      <Fragment>
        <div className="w-[50%] laptop:w-[35%] flex flex-col justify-start my-3 gap-1">
          <Typography variant="title" size="small" className="text-black pb-1">
            About
          </Typography>
          {address && (
            <div className="flex flex-row items-center gap-2">
              <MaterialSymbol icon={"home"} className="!text-[1.3rem]" />
              <Typography
                variant="body"
                size="small"
                className="!text-[0.8rem] text-black"
              >
                {address}
              </Typography>
            </div>
          )}
          {location && (
            <div className="flex flex-row items-center gap-2">
              <MaterialSymbol icon={"location_on"} className="!text-[1.3rem]" />
              <Typography
                variant="body"
                size="small"
                className="!text-[0.8rem] text-black"
              >
                {location}
              </Typography>
            </div>
          )}
          {/* {phone &&
            <div className="flex flex-row items-center gap-2">
              <MaterialSymbol
                icon={"phone"}
                className="!text-[1.3rem]"
              />
              <Typography
                variant="body"
                size="small"
                className="!text-[0.8rem] text-black"
              >
                +{phone}
              </Typography>
            </div>}
          {email &&
            <div className="flex flex-row items-center gap-2">
              <MaterialSymbol
                icon={"mail"}
                className="!text-[1.3rem]"
              />
              <Typography
                variant="body"
                size="small"
                className="!text-[0.8rem] text-black"
              >
                {email}
              </Typography>
            </div>} */}
          {hobby && (
            <div className="flex flex-row items-center gap-2">
              <MaterialSymbol icon={"extension"} className="!text-[1.3rem]" />
              <Typography
                variant="body"
                size="small"
                className="!text-[0.8rem] text-black"
              >
                {hobby}
              </Typography>
            </div>
          )}
          {school && (
            <div className="flex flex-row items-center gap-2">
              <MaterialSymbol icon={"school"} className="!text-[1.3rem]" />
              <Typography
                variant="body"
                size="small"
                className="!text-[0.8rem] text-black"
              >
                {school}
              </Typography>
            </div>
          )}
          {website && (
            <div className="flex flex-row items-center gap-2">
              <MaterialSymbol icon={"language"} className="!text-[1.3rem]" />
              <Typography
                variant="body"
                size="small"
                className="!text-[0.8rem] text-black"
              >
                {website}
              </Typography>
            </div>
          )}
        </div>
      </Fragment>
    );
  };

  const renderAdmireButton = () => {
    if (isMe) return <React.Fragment />;
    if (role == 5) return <React.Fragment />;
    return (
      <Button
        isLoading={unFollowIsPending || followIsPending}
        className="w-2/4 max-w-[14rem] mt-4"
        onClick={triggerAction}
      >
        {isAdmiring ? "Admiring" : "Admire"}
      </Button>
    );
  };

  return (
    <div className="tablet:rounded-[0.75rem] bg-white overflow-hidden">
      {renderBannerImage()}
      {renderProfileImage()}
      <div className="flex flex-col items-center justify-center pb-[1.5rem]">
        {renderProfileDetails()}
        {renderProfileCounts()}
        {renderAboutSection()}
        {renderAdmireButton()}
      </div>
    </div>
  );
};

export default ProfileCard;
