import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { ConvertTimeStringToChatHistory } from "../../Utils/ConvertTimeStringToChatHistory";

interface IActivity {
  className?: string
  id?: number
  activenow?: string
  name?: string
  profile_image?: string
  last_active_at: string
  unread_count?: number
  last_receiver_user_id?: number
  agora_chat_status?: string
  is_name_searching?: number
}

const RecentUserList: FC<IActivity> = (props) => {
  const { className, id, name, profile_image, last_active_at, unread_count, last_receiver_user_id, agora_chat_status, is_name_searching } = props

  if (agora_chat_status === 'active' || is_name_searching)
    return (
      <>
        <div className={`${className} flex items-center gap-[0.50rem] text-sm`}>
          <Avatar
            image={profile_image}
            classNameAvatarContainer="!w-[3rem] !h-[3rem]"
            className="!text-[1.9rem]"
            isShowAgoraUnreadMsgCount={id !== last_receiver_user_id ? true : false}
            unreadCount={unread_count}
          />
          <div className="flex flex-col flex-wrap">
            <h2 className="!text-black-900_01 font-bold text-base">{name}</h2>
            <p className="!font-normal !text-blue_gray_300 text-xs !text-secondary-50">
              <div>{ConvertTimeStringToChatHistory(last_active_at)}</div>
            </p>
          </div>
        </div>
      </>
    );
};

export default RecentUserList;
