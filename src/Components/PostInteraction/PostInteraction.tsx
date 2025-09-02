import { FC, useState } from "react";
import { IUpdatesPostVideoCard } from "../Cards/UpdatesPostVideoCard.tsx";
import Loading from "../Common/Loading.tsx";
import { MaterialSymbol } from "react-material-symbols";
import Typography from "../Typography/Typography.tsx";
import { usePost } from "../../Hooks/usePost.tsx";
import PostCommentModal from "../Modal/PostCommentModal.tsx";
import toast from "react-hot-toast";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { copyToClipboard } from "../../Utils/copyToClipboard.ts";
import ReSharePostModal from "../Modal/ReSharePostModal.tsx";
import { RE_SHARE_LINK } from "../../Constants/Common.ts";
import PostReportModal from "../Modal/PostReportModal.tsx";
import ViewIcon from "../../Assets/Icons/ViewIcon.tsx";

interface IVideoPostInteraction extends IUpdatesPostVideoCard {
  PostDetailReFetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, any>>;
  onReportSuccess?: () => void;
  is_my_post?: number;
  role?: number;
  view_count?: number;
}

const VideoPostInteraction: FC<IVideoPostInteraction> = (props) => {
  const {
    id,
    like_count,
    is_liked,
    comment_count,
    PostDetailReFetch,
    onReportSuccess,
    is_my_post,
    role,
    view_count,
  } = props;
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(Boolean(Number(is_liked)));
  const [LikeCount, setLikeCount] = useState<number>(Number(like_count));
  const [openReshareModal, setOpenReShareModal] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);
  const handleOpenCommentModal = () => {
    setOpenComment((_) => !_);
    return PostDetailReFetch().then((r) => r);
  };
  const handleOpenReShareModal = () => setOpenReShareModal((_) => !_);
  const doLike = () => {
    if (isLiked) {
      mutate(
        { post_id: id, like: 1 },
        {
          onSuccess: () => {
            setIsLiked(false);
            setLikeCount((_) => _ - 1);
          },
        }
      );
    } else {
      mutate(
        { post_id: id, like: 1 },
        {
          onSuccess: () => {
            setIsLiked(true);
            setLikeCount((_) => _ + 1);
          },
        }
      );
    }
    return PostDetailReFetch().then((r) => r);
  };
  const handleOpenReportModal = () => {
    setOpenReport((_) => !_);
    return PostDetailReFetch().then((r) => r);
  };
  const copyPostLink = (link: string) => {
    copyToClipboard(link);
    toast.success("Copied");
    handleOpenReShareModal();
  };

  const { like } = usePost();
  const { mutate, isPending } = like();

  const renderLike = () => {
    return (
      <button
        className="cursor-pointer flex flex-col items-center"
        onClick={doLike}
        disabled={isPending}
      >
        {isPending ? (
          <Loading iconClassName="w-[1.5rem] h-[1.5rem] laptop:w-[2.8rem] laptop:h-[2.8rem] laptop:bg-[#1B1B1F29] laptop:p-2 rounded-full" />
        ) : (
          <MaterialSymbol
            icon="favorite_border"
            className={`!text-[1.4rem] text-white ${
              isLiked ? "!text-primary" : ""
            } laptop:bg-[#1B1B1F29] laptop:!text-[1.8rem] laptop:p-2 rounded-full`}
            fill={Boolean(isLiked)}
          />
        )}
        <Typography
          variant="body"
          size="large"
          className="text-white drop-shadow-[1px_0px_2px_rgba(27,27,31,0.50)] laptop:text-surface-1"
        >
          {LikeCount}
        </Typography>
      </button>
    );
  };
  const renderView = () => {
    return (
      <div className="cursor-pointer flex flex-col items-center">
        <div className="flex gap-[0.52rem] items-center justify-center laptop:bg-[#1B1B1F29] laptop:p-2 rounded-full">
          <div className="w-[1.5rem] h-[1.5rem] rounded-full flex items-center justify-center ">
            <img
              className="w-[1.5rem] h-[1.5rem] laptop:!w-[3rem] bg-primary"
              src="Assets/Images/view.png"
              alt="updates"
              style={{ border: "2px solid #1B1B1F29", borderRadius: "100%" }}
            />
            {/* <ViewIcon
              className="w-[1.5rem] h-[1.5rem] laptop:!w-[1rem] bg-primary"
              isFill
            /> */}
          </div>
        </div>

        <Typography
          variant="body"
          size="large"
          className="text-white drop-shadow-[1px_0px_2px_rgba(27,27,31,0.50)] laptop:text-surface-1"
          component="div"
        >
          {view_count}
        </Typography>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-6 mb-6">
      {renderLike()}
      {renderView()}
      <div
        className="cursor-pointer flex flex-col items-center"
        onClick={handleOpenCommentModal}
      >
        <MaterialSymbol
          icon="chat_bubble"
          fill
          className={`!text-[1.4rem] !text-primary laptop:bg-[#1B1B1F29] laptop:!text-[1.8rem] laptop:p-2 rounded-full`}
        />
        <Typography
          variant="body"
          size="large"
          className="text-white drop-shadow-[1px_0px_2px_rgba(27,27,31,0.50)] laptop:text-surface-1"
          component="div"
        >
          {comment_count}
        </Typography>
      </div>
      <div className="cursor-pointer" onClick={handleOpenReShareModal}>
        <div className="flex gap-[0.52rem] items-center justify-center laptop:bg-[#1B1B1F29] laptop:p-2 rounded-full">
          <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-primary flex items-center justify-center ">
            <img
              src="Assets/Images/share.png"
              className="w-[1.6rem]  laptop:!w-[1.4rem]"
              alt="share"
            />
          </div>
        </div>
      </div>
      {/* <div className="cursor-pointer" onClick={handleOpenReShareModal}>
        <div className="flex gap-[0.52rem] items-center justify-center laptop:bg-[#1B1B1F29] laptop:p-2 rounded-full">
          <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-primary flex items-center justify-center ">
            <img
              src="public\Assets\Images\share.png"
              className="w-[0.875rem] laptop:!w-[0.87rem]"
              alt="share"
            />
          </div>
        </div>
      </div> */}
      {is_my_post === 1 || role === 5 ? (
        <></>
      ) : (
        <div
          className="cursor-pointer flex flex-col items-center"
          onClick={handleOpenReportModal}
        >
          <MaterialSymbol
            icon="flag"
            className={`!text-[1.4rem] text-white laptop:bg-[#1B1B1F29] laptop:!text-[1.8rem] laptop:p-2 rounded-full`}
          />
        </div>
      )}
      {openComment && (
        <PostCommentModal
          post_id={id}
          open={openComment}
          handle={handleOpenCommentModal}
        />
      )}
      {openReshareModal && (
        <ReSharePostModal
          link={RE_SHARE_LINK.replaceWithObject({ id: id, type: "update" })}
          openReshareModal={openReshareModal}
          handleOpenReShareModal={handleOpenReShareModal}
          copyPostLink={copyPostLink}
        />
      )}
      {openReport && (
        <PostReportModal
          post_id={id}
          open={openReport}
          onReportSuccess={onReportSuccess}
          handle={handleOpenReportModal}
        />
      )}
    </div>
  );
};

export default VideoPostInteraction;
