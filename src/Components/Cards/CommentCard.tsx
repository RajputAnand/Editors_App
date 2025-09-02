import React, { FC, Fragment, useState } from "react";
import Avatar from "../Avatar/Avatar.tsx";
import Typography from "../Typography/Typography.tsx";
import { MaterialSymbol } from "react-material-symbols";
import { usePost } from "../../Hooks/usePost.tsx";
import Loading from "../Common/Loading.tsx";
import { convertTimestampToAgo } from "../../Utils/convertTimestampToAgo.ts";
import PostCommentModal from "../Modal/PostCommentModal.tsx";
import PostCommentReportModal from "../Modal/PostCommentReportModal.tsx";
import { useSelector } from "react-redux";
import { useNetworkPost } from "../../Hooks/useNetworkPost.tsx";
import PostNetworkCommentModal from "../Modal/Network/PostNetworkCommentModal.tsx";

interface ICommentCard {
  user: {
    user_name: string;
    name: string;
    profile_image?: string;
    id?: number;
  };
  text: string;
  title: string;
  image: Array<string>;
  like_count: number;
  location: string;
  reshare_count: string;
  comment_count: string;
  created_at: string;
  is_liked: any;
  is_disliked:any;
  is_report: any;
  id: string;
  refetch: any;
  usePublic?: boolean;
  onReportSuccess?: () => void;
  type?: "networkCommentCard" | "PostCommentCard";
  networkGroupId?: number;
}

const CommentCard: FC<ICommentCard> = (props) => {
  const selector = useSelector((state: any) => state.AuthData);
  const {
    is_liked,
    is_disliked,
    like_count,
    id,
    user,
    created_at,
    comment_count,
    text,
    refetch,
    usePublic,
    onReportSuccess,
    is_report,
    type,
    networkGroupId,
  } = props;
  const [isLiked, setIsLiked] = useState<boolean>(Boolean(Number(is_liked)));
  const [isUnLiked, setIsUnLiked] = useState<boolean>(Boolean(Number(is_disliked)));
  const [isReport, setIsReport] = useState<boolean>(Boolean(Number(is_report)));
  const [, setLikeCount] = useState<number>(Number(like_count));
  const [openComment, setOpenComment] = useState<boolean>(false);
  const handleOpenCommentModal = () => setOpenComment((_) => !_);
  const [openReport, setOpenReport] = useState<boolean>(false);

  const { like, unLike } = type === "networkCommentCard" ? useNetworkPost() : usePost();
  const { mutate, isPending } = like();
  const { mutate: unLikeMutate, isPending: unLikeIsPending } = unLike();

  const doLike = () => {
    if (isLiked) {
      return mutate(
        { post_id: id, like: 1 },
        {
          onSuccess: () => {
            setIsLiked(false);
            setLikeCount((_) => _ - 1);
          },
        }
      );
    } else {
      setIsUnLiked(false)
      return mutate(
        { post_id: id, like: 1 },
        {
          onSuccess: () => {
            setIsLiked(true);
            setLikeCount((_) => _ + 1);
          },
        }
      );
    }
    refetch().then((r: any) => r);
  };
  const doUnLike = () => {
    if (isUnLiked) {
      return unLikeMutate({ post_id: id, like: 2 },
        {
          onSuccess: () => {
            setIsUnLiked(false);
          }
        }
      );
    }
    else {
      setIsLiked(false)
      return unLikeMutate({ post_id: id, like: 2 },
        {
          onSuccess: () => {
            setIsUnLiked(true);
          }

        }
      )
    }
}
const handleOpenReportModal = () => {
  setOpenReport((_) => !_);
  // return PostDetailReFetch().then(r => r)
};
const renderLikeButton = () => {
  if (isPending) return <Loading iconClassName="w-[1.25rem] h-[1.25rem]" />;
  return (
    <MaterialSymbol
      onClick={doLike}
      fill={isLiked}
      icon={"thumb_up_off_alt"}
      as="div"
      className={`cursor-pointer !text-[1.25rem] ${isLiked ? "!text-primary" : ""
        } text-surface-20`}
    />
  );
};
const renderUnLikeButton = () => {
  if (unLikeIsPending) return <Loading iconClassName="w-[1.25rem] h-[1.25rem]" />;
  return (
    <MaterialSymbol
      onClick={doUnLike}
      fill={isUnLiked}
      icon={"thumb_down_off_alt"}
      as="div"
      className={`cursor-pointer !text-[1.25rem] ${isUnLiked ? "!text-primary" : ""
        } text-surface-20`}
    />
  );
};
const renderReportButton = () => {
  // if (isPending) return <Loading iconClassName="w-[1.25rem] h-[1.25rem]"/>
  if (selector.isLoginUserId === user.id) return <></>;
  return (
    <MaterialSymbol
      onClick={handleOpenReportModal}
      fill={isReport}
      icon="flag"
      as="div"
      className={`cursor-pointer !text-[1.25rem] ${isReport ? "!text-primary" : ""
        } text-surface-20`}
    />
  );
};
const renderCommentReplies = () => {
  if (comment_count == "0") return <></>;
  return (
    <div className="mt-2">
      <Typography
        variant="body"
        size="small"
        className="text-primary-40 cursor-pointer"
        nodeProps={{ onClick: handleOpenCommentModal }}
        component="div"
      >
        {comment_count} replies
      </Typography>
    </div>
  );
};

const renderCommentInteraction = () => {
  if (usePublic) return <></>;
  return (
    <Fragment>
      <div className="flex gap-[2rem]">
        {renderLikeButton()}
{renderUnLikeButton()}
        {/*<MaterialSymbol icon={"thumb_down_off_alt"} as="div" className="cursor-pointer !text-[1.25rem] !text-surface-20"/>*/}
        <MaterialSymbol
          icon={"add_comment"}
          as="div"
          className="cursor-pointer !text-[1.25rem] !text-surface-20 scale-x-[-1]"
          onClick={handleOpenCommentModal}
        />
        {renderReportButton()}
      </div>
      {renderCommentReplies()}
    </Fragment>
  );
};

return (
  <React.Fragment>
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="relative">
          <Avatar
            image={user?.profile_image}
            classNameAvatarContainer="w-[1.5rem] h-[1.5rem] "
          />
          <MaterialSymbol
            className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0`}
            icon={"verified"}
            fill
          />
        </div>
        <div className="flex items-center flex-wrap">
          <Typography
            variant="title"
            size="medium"
            className="ml-[0.5rem] text-surface-10"
          >
            {user.name}
          </Typography>
          <Typography
            variant="body"
            size="large"
            className="text-secondary-50 ml-[0.25rem]"
          >
            @{user.user_name}
          </Typography>
          <Typography
            variant="body"
            size="medium"
            className="text-secondary-50 ml-[0.25rem]"
          >
            {convertTimestampToAgo(created_at)}
          </Typography>
        </div>
      </div>
      <div className="ml-[2.5rem]">
        <Typography variant="body" size="large" className="text-black">
          {text}
        </Typography>
        {renderCommentInteraction()}
      </div>
    </div>
    {openComment &&
      (type === "networkCommentCard" ? (
        <PostNetworkCommentModal
          post_id={id}
          open={openComment}
          handle={handleOpenCommentModal}
          networkGroupId={networkGroupId}
        />
      ) : (
        <PostCommentModal
          post_id={id}
          open={openComment}
          handle={handleOpenCommentModal}
        />
      ))}
    {openReport && (
      <PostCommentReportModal
        post_id={id}
        open={openReport}
        onReportSuccess={onReportSuccess}
        handle={handleOpenReportModal}
        networkGroupId={networkGroupId}
      />
    )}
  </React.Fragment>
);
};

export default CommentCard;
