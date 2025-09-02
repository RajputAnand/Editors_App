import { FC, useState } from "react";
import Avatar from "../../Components/Avatar/Avatar.tsx";
import Typography from "../../Components/Typography/Typography.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { convertTimestampToAgo } from "../../Utils/convertTimestampToAgo.ts";
import { PathConstants } from "../../Router/PathConstants.ts";
import { usePost } from "../../Hooks/usePost.tsx";
import { Endpoints } from "../../Api/Endpoints.ts";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { checkNotificationTypeExists } from "../../Utils/notificationTypes.ts";
interface INotification {
  id: string;
  image?: string;
  name: string;
  action: string;
  status?: number;
  postText: string;
  title: string;
  description: string;
  created_at: string;
  userNav?: boolean;
  table_id: string;
  refetch: any;
  is_read: number;
  created_user_id: string;
  type: string;
  post?: string | { id: number };
  type_int: number;
  created_user: {
    id: string;
    profile_image: string;
    user_name: string;
    name: string;
  };
  live_invites: {
    id:number
    live_id: number;
    agora_channel_id: string
  };
  network_group?: { id: number };
  onNotificationSuccess?: () => void;
  reFetchNotificationData: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, any>>;
}

const Notification: FC<INotification> = (props) => {
  const { notifications } = usePost();
  const {
    name,
    title,
    created_at,
    created_user,
    onNotificationSuccess,
    id,
    table_id,
    is_read,
    type_int,
    created_user_id,
    description,
    type,
    refetch,
    post,
    status,
    network_group,
    live_invites
  } = props;
  const { mutate: notificationMutate, data } = notifications({
    mutationKey: [
      Endpoints.Notifications.replaceWithObject({ id: id }),
      "POST",
    ],
  });

  // Function to extract first two words
  const extractFirstTwoWords = (text: any) => {
    const words = text?.split(/[:#\s]+/); // Split text into an array of words
    if (words?.length >= 2) {
      return `${words[0]} ${words[1]}`; // Combine the first two words
    }
    return text; // Return the whole text if less than two words
  };
  const navigate = useNavigate();
  const handleUserClick = (user_id: string) => () => {
    if (typeof document !== 'undefined') {
      if (is_read === 0) {
        const handleNotificationOnSuccess = () => {
          if (onNotificationSuccess) onNotificationSuccess();
          refetch().then((r: any) => r);
          // here navigation
          if (type_int === 1 || type_int === 3 || type_int === 7) {
            // create,like post
            document.getElementById("notification_menu_close")?.click();
            return navigate(
              PathConstants.Post.replaceWithObject({ id: table_id }),
              { state: { status: 0, post: "" } }
            );
          } else if (type_int === 2) {
            // post reply
            document.getElementById("notification_menu_close")?.click();
            return navigate(
              PathConstants.Post.replaceWithObject({ id: table_id }),
              { state: { status: 1, post: post } }
            );
          } else if (type_int === 4 || type_int === 5) {
            // create or remove admire
            document.getElementById("notification_menu_close")?.click();
            return navigate(
              PathConstants.UserView.replaceWithObject({
                username: created_user?.user_name,
              }),
              { state: { status: 0, post: "" } }
            );
          } else if (type_int === 6) {
            // started live
            document.getElementById("notification_menu_close")?.click();
            return navigate(PathConstants.Live);
          } else if (type_int === 9 || type_int === 10) {
            // removed or deactivated post
            document.getElementById("notification_menu_close")?.click();
            return navigate(
              PathConstants.Post.replaceWithObject({ id: table_id }),
              { state: { status: 1, post: post } }
            );
          } else if (type_int === 11 || type_int === 12) {
            // doc verified approved /rejected
            document.getElementById("notification_menu_close")?.click();
            return navigate(PathConstants.IDverification);
          } else if (type_int === 15) {
            // Network Invite redirect
            document.getElementById("notification_menu_close")?.click();
            return navigate(
              PathConstants.NetworkInviteView.replaceWithObject({
                type: "pending",
              })
            );
          } else if (type_int === 22 || type_int === 23) {
            // Network Post redirect
            let postId;
            if (typeof post === "object" && post !== null && "id" in post) {
              postId = post.id;
            }
            const url = `/network?groupId=${network_group?.id}&postId=${postId}`;
            document.getElementById("notification_menu_close")?.click();
            return navigate(url);
          } else if (checkNotificationTypeExists(type_int)) {
            // network common redirect
            document.getElementById("notification_menu_close")?.click();
            return navigate(
              PathConstants.NetworkView.replaceWithObject({
                id: network_group?.id.toString() || "",
              })
            );
          }
          else if (type_int === 31) {
            document.getElementById("notification_menu_close")?.click();
            return navigate(PathConstants.LiveNow.replaceWithObject({
              id: live_invites.live_id.toString(),
              channel_id: live_invites.agora_channel_id
            }), {
              state: {
                liveInvite: true,
                invitedUserName:created_user?.name,
                invitedUserProfileImage:created_user?.profile_image,
                inviteId:live_invites.id
              }
            })
          }
        };
        notificationMutate(
          { is_read: 1 },
          {
            onSuccess: handleNotificationOnSuccess,
          }
        );
      } else {
        if (type_int === 1 || type_int === 3 || type_int === 7) {
          // create,like post
          document.getElementById("notification_menu_close")?.click();
          return navigate(
            PathConstants.Post.replaceWithObject({ id: table_id }),
            { state: { status: 0, post: "" } }
          );
        } else if (type_int === 2) {
          // post reply
          document.getElementById("notification_menu_close")?.click();
          return navigate(
            PathConstants.Post.replaceWithObject({ id: table_id }),
            { state: { status: 1, post: post } }
          );
        } else if (type_int === 4 || type_int === 5) {
          // create or remove admire
          document.getElementById("notification_menu_close")?.click();
          return navigate(
            PathConstants.UserView.replaceWithObject({
              username: created_user?.user_name,
            }),
            { state: { status: 0, post: "" } }
          );
        } else if (type_int === 6) {
          // started live
          document.getElementById("notification_menu_close")?.click();
          return navigate(PathConstants.Live);
        } else if (type_int === 9 || type_int === 10) {
          // removed or deactivated post
          document.getElementById("notification_menu_close")?.click();
          return navigate(
            PathConstants.Post.replaceWithObject({ id: table_id }),
            { state: { status: 1, post: post } }
          );
        } else if (type_int === 11 || type_int === 12) {
          // doc verified approved /rejected
          document.getElementById("notification_menu_close")?.click();
          return navigate(PathConstants.IDverification);
        } else if (type_int === 15) {
          // network invite redirect
          document.getElementById("notification_menu_close")?.click();
          return navigate(
            PathConstants.NetworkInviteView.replaceWithObject({ type: "pending" })
          );
        } else if (
          type_int === 22 ||
          type_int === 23 ||
          type_int === 21 ||
          type_int === 27 ||
          type_int === 28
        ) {
          // Network Post redirect
          let postId;
          if (typeof post === "object" && post !== null && "id" in post) {
            postId = post.id;
          }
          const url = `/network?groupId=${network_group?.id}&postId=${postId}`;
          document.getElementById("notification_menu_close")?.click();
          return navigate(url);
        } else if (checkNotificationTypeExists(type_int)) {
          // network common redirect
          document.getElementById("notification_menu_close")?.click();
          return navigate(
            PathConstants.NetworkView.replaceWithObject({
              id: network_group?.id.toString() || "",
            })
          );
        }
        else if (type_int === 31) {
          document.getElementById("notification_menu_close")?.click();
          return navigate(PathConstants.LiveNow.replaceWithObject({
            id: live_invites.live_id.toString(),
            channel_id: live_invites.agora_channel_id
          }), {
            state: {
              liveInvite: true,
              invitedUserName:created_user?.name,
              invitedUserProfileImage:created_user?.profile_image,
              inviteId:live_invites.id
            }
          })
        }
      }
    }
  };

  return (
    <div
      key={id}
      // className={`${created_user?.is_read === 0 && "isActiveMenu flex items-center px-4 tablet:px-0"} flex items-center px-4 tablet:px-0 `}
      className="flex items-center px-4 tablet:px-0 !cursor-pointer pl-2"
      onClick={handleUserClick(created_user?.id as any)}
    // onClick={(e)=>handleUserClick(e)}
    >
      <div className="col-span-1">
        {" "}
        <Avatar
          image={created_user?.profile_image}
          className="max-w-[2.6rem]"
        />
      </div>
      {/* <Avatar image={created_user?.profile_image} className="max-w-[2.6rem]"/> */}
      <div className="pl-3">
        <div className="flex gap-2">
          {/* <Typography variant="title" size="medium" className="text-surface-10 font-bold">
            
          </Typography> */}
          <Typography
            variant="title"
            size="medium"
            className="text-surface-10 !font-normal"
          >
            <span className="text-surface-10 font-bold mr-1">
              {created_user?.name}
            </span>
            {title}
            {/* <span className="mx-1">~</span>{convertTimestampToAgo(created_at)}</span> */}
            {/* <span className="flex items-center"><span className="mx-1">~</span>{convertTimestampToAgo(created_at)}</span> */}
          </Typography>
        </div>

        <Typography
          variant="body"
          size="large"
          className="text-surface-10 max-w-[19.5rem]"
        // className="text-black htmlContents break-words whitespace-pre-line"
        >
          <div className="flex items-center">
            {extractFirstTwoWords(description)} ...~
            {/* {(created_at)} */}
            {convertTimestampToAgo(created_at)}
            {/* <div className="line-clamp-1">{description}</div> */}
          </div>
        </Typography>
      </div>
    </div>
  );
};
export default Notification;

// const popup1=document.getElementById('scrollbarzindex')
// const screenWidth1=window.innerWidth;
// if(screenWidth1 < 768)
//   {
//     popup1?.style.zIndex='-1';
//   }
//  document.getElementById('notification_menu_close')?.addEventListener('click',function()
// {
//   if(screenWidth < 768)
//     {
//       popup1?.style.zIndex='';
//     }
// })

// const popup=document.getElementById('scrollbarzindex')
//     const screenWidth=window.innerWidth;
//     if(screenWidth < 768)
//       {
//         popup.style.zIndex='-1';
//       }
//      document.getElementById('profile_menu_close')?.addEventListener('click',function()
//     {
//       if(screenWidth < 768)
//         {
//           popup.style.zIndex='';
//         }
//     })
//  username: sean@zod.edu.pl
// password: ABCabc#123
