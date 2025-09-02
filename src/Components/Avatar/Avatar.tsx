import { FC } from "react";
import { MaterialSymbol } from "react-material-symbols";
import Loading from "../Common/Loading.tsx";

interface IAvatar {
  className?: string;
  classNameAvatarContainer?: string;
  image?: string | null;
  classNameImage?: string;
  isLoading?: boolean;
  iconType?: any;
  onlineStatus?: string
  isShowAgoraUnreadMsgCount?: boolean
  unreadCount?: any
}

const Avatar: FC<IAvatar> = (props) => {
  const {
    className,
    image,
    classNameImage,
    classNameAvatarContainer,
    isLoading,
    iconType,
    onlineStatus,
    isShowAgoraUnreadMsgCount,
    unreadCount
  } = props;

  if (isLoading)
    return (
      <div
        className={`w-[2rem] h-[2rem] bg-[#0000001F] flex items-center justify-center cursor-pointer rounded-full ${classNameAvatarContainer}`}
      >
        <Loading
          className="w-full h-full flex items-center justify-center"
          iconClassName="!w-[1rem] !h-[1rem]"
        />
      </div>
    );

  if (typeof image == "string")
    return (
      <div
        className={`relative w-[2rem] h-[2rem] cursor-pointer  ${classNameAvatarContainer}`}
      >
        {isShowAgoraUnreadMsgCount && (unreadCount > 0) && (
          <div className="absolute top-[-2px] right-[-5px] w-6 h-6 bg-orange-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{unreadCount}</span>
          </div>
        )}
        <img
          loading="lazy"
          className={`w-full h-full  rounded-full ${classNameImage} `}
          alt="user profile"
          src={image}
        />
        {onlineStatus === 'active' ? (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        ) : onlineStatus === 'away' ? (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
        ) : null}
      </div>
    );

  return (
    <div>
      <div
        className={`relative w-[2rem] h-[2rem] bg-[#0000001F] flex items-center justify-center cursor-pointer rounded-full ${classNameAvatarContainer}`}
      >
        {isShowAgoraUnreadMsgCount && (unreadCount > 0) && (
          <div className="absolute top-[-2px] right-[-5px] w-6 h-6 bg-orange-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{unreadCount}</span>
          </div>
        )}
        <MaterialSymbol
          className={`text-white text-center !text-[1.4rem] ${className}`}
          icon={iconType || "person_2"}
          fill
        />
        {onlineStatus === 'active' ? (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        ) : onlineStatus === 'away' ? (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
        ) : null}
      </div>
    </div>
  );
};

export default Avatar;
