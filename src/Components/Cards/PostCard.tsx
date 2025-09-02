import React, { FC, useState } from "react";
import Avatar from "../Avatar/Avatar.tsx";
import Typography from "../Typography/Typography.tsx";
import { MaterialSymbol } from "react-material-symbols";
import { convertTimestampToAgo } from "../../Utils/convertTimestampToAgo.ts";
import { usePost } from "../../Hooks/usePost.tsx";
import Loading from "../Common/Loading.tsx";
import PostCommentModal from "../Modal/PostCommentModal.tsx";
import toast from "react-hot-toast";
import { PathConstants } from "../../Router/PathConstants.ts";
import PhotoViewer from "../PhotoViewer/PhotoViewer.tsx";
import MetaCard, { IMetaCard } from "./MetaCard.tsx";
import { copyToClipboard } from "../../Utils/copyToClipboard.ts";
import { useGetQuery } from "../../Api/QueryHooks/useGetQuery.tsx";
import { Endpoints } from "../../Api/Endpoints.ts";
import { useNavigate } from "react-router-dom";
import { Popover } from "@headlessui/react";
import ReSharePostModal from "../Modal/ReSharePostModal.tsx";
import { RE_SHARE_LINK } from "../../Constants/Common.ts";
import ReadMore from "../ReadMore/ReadMore.tsx";
import PostReportModal from "../Modal/PostReportModal.tsx";
import PinpostModal from "../Modal/PinpostModal.tsx";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import TaggedModal from "../Modal/TaggedModal.tsx";
import TagRemove from "../Modal/TagRemove.tsx";
import DeleteConfirm from "../Modal/DeleteConfirm.tsx";
import PinpostIcon from "../../Assets/Icons/PinpostIcon.tsx";
import ViewIcon from "../../Assets/Icons/ViewIcon.tsx";
interface IPostCard {
  user: {
    user_name: string;
    name: string;
    profile_image?: string;
    id: string;
    role: number;
    is_admin_verified?: number;
  };
  text: string;
  title: string;
  image: Array<string>;
  video?: Array<string>;
  like_count: number;
  is_my_post: number;
  location: string;
  reshare_count: string;
  choice: string;
  comment_count: string;
  created_at: string;
  is_liked: any;
  id: string;
  meta_links?: Array<IMetaCard>;
  isMe?: boolean;
  hidePostInteraction?: boolean;
  usePublic?: boolean;
  onDeleteSuccess?: () => void;
  onReportSuccess?: () => void;
  onPinpostSuccess?: () => void;
  onTagpostSuccess?: () => void;
  show_pinned_post_only?: number;
  reFetchHomepageData?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, any>>;
  tagged_users_count?: any;
  tagged_users?: any;
  is_tagged_me?: any;
  profileDataOnly?: any;
  post_type?: string;
  network_group?: {
    id?: string;
    name?: string;
  };
}

const PostCard: FC<IPostCard> = (props) => {
  const {
    text,
    user,
    created_at,
    title,
    location,
    image,
    is_liked,
    id,
    video,
    choice,
    meta_links,
    hidePostInteraction,
    usePublic,
    onDeleteSuccess,
    onReportSuccess,
    onPinpostSuccess,
    show_pinned_post_only,
    onTagpostSuccess,
    tagged_users_count,
    tagged_users,
    is_tagged_me,
    profileDataOnly,
    post_type,
    network_group,
  } = props;
  const selector = useSelector((state: any) => state.AuthData);
  const post_endpoint = usePublic
    ? Endpoints.PublicPostView?.replaceWithObject({ id: id })
    : Endpoints.Postview.replaceWithObject({ id: id });
  const {
    data: postDetailData,
    isLoading: IsLoadingPostDetails,
    refetch: PostDetailReFetch,
  } = useGetQuery({ queryKey: [post_endpoint, "GET"] });

  const [isLiked, setIsLiked] = useState<boolean>(Boolean(Number(is_liked)));

  const [] = useState<boolean>(false);
  const [openTaggedpost, setOpenTaggedpost] = useState<boolean>(false);
  const [openConfirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);
  // const [unPin,setUnPin]=useState<boolean>(false)
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [openPinpost, setOpenPinpost] = useState<boolean>(false);
  const [openTagremovepost, setOpenTagRemovepost] = useState<boolean>(false);
  const [openReshareModal, setOpenReShareModal] = useState<boolean>(false);

  // const [openReportModal,setOpenReportModal] = useState<boolen>(false)
  const [openPreviewModal, setPreviewModal] = useState<number | undefined>(
    undefined
  );
  const { like, deletePost } = usePost();
  const { mutate, isPending } = like();
  const { mutate: deleteMutate, isSuccess } = deletePost({
    mutationKey: [Endpoints.DeletePost.replaceWithObject({ id: id }), "DELETE"],
  });
  // const { mutate: reportMutate} = reportPost({ mutationKey: [Endpoints.ReportPost.replaceWithObject({ id: id }), "POST"] })
  const navigate = useNavigate();
  const doLike = () => {
    if (usePublic) {
      toast.error("login required");
      return navigate(PathConstants.SingIn);
    }

    const handleSetLike = (value: boolean) => {
      setIsLiked(value);
      return PostDetailReFetch().then((r) => r);
    };

    if (isLiked) {
      return mutate(
        { post_id: id, like: 1 },
        {
          onSuccess: () => handleSetLike(false),
        }
      );
    } else {
      return mutate(
        { post_id: id, like: 1 },
        {
          onSuccess: () => handleSetLike(true),
        }
      );
    }
  };

  const copyPostLink = (text: string) => {
    copyToClipboard(text);
    toast.success("Copied");
    handleOpenReShareModal();
  };

  const handleOpenCommentModal = () => {
    setOpenComment((_) => !_);
    return PostDetailReFetch().then((r) => r);
  };
  const handleOpenReportModal = () => {
    if (usePublic) {
      toast.error("login required");
      return navigate(PathConstants.SingIn);
    }

    setOpenReport((_) => !_);
    return PostDetailReFetch().then((r) => r);
  };
  const handleOpenPinpostModal = () => {
    setOpenPinpost((_) => !_);
    return PostDetailReFetch().then((r) => r);
  };
  const handleOpenConfirmDeleteModal = () => {
    setConfirmDelete((_) => !_);
    return PostDetailReFetch().then((r) => r);
  };
  const tagid = tagged_users.map((item: any) => {
    if (item.id === selector.isLoginUserId) {
      return item.id;
    }
  });
  const handleTagRemoveButton = () => {
    setOpenTagRemovepost((_) => !_);
    return PostDetailReFetch().then((r) => r);
  };
  const handleOpenTaggedModal = () => {
    setOpenTaggedpost((_) => !_);
    // return PostDetailReFetch().then(r => r)
  };

  const handleOpenReShareModal = () => {
    if (usePublic) {
      toast.error("login required");
      return navigate(PathConstants.SingIn);
    }
    setOpenReShareModal((_) => !_);
  };
  const handlePreviewImage = (index?: number) =>
    setPreviewModal(index ?? undefined);

  const handleClickUserProfile = (user_name: string) => () => {
    if (usePublic) return;
    return navigate(
      PathConstants.UserView.replaceWithObject({ username: user_name })
    );
  };

  const handleDeleteButton = () => {
    const handleDeleteOnSuccess = () => {
      if (onDeleteSuccess) onDeleteSuccess();
    };

    deleteMutate({}, { onSuccess: handleDeleteOnSuccess });
  };

  const tagged_users_render = () => {
    const name_tagged = (
      <div className="flex items-center">
        <Typography
          variant="title"
          size="medium"
          className="flex items-center flex-wrap"
        >
          <span
            className="cursor-pointer"
            onClick={handleClickUserProfile(user?.user_name)}
          >
            {user?.name}
          </span>
          <span className="flex items-center ml-1 !text-secondary-50 flex-wrap">
            is with
          </span>
          <span
            className="flex items-center ml-1 cursor-pointer"
            onClick={handleClickUserProfile(tagged_users[0]?.user_name)}
          >
            {tagged_users[0]?.name}
          </span>

          {tagged_users_count - 1 != 0 && (
            <>
              <span className="!text-secondary-50 flex items-center flex-wrap ml-1">
                and
              </span>
              <span className="flex items-center ml-1">
                {tagged_users_count > 0 && tagged_users_count - 1}
              </span>
              <span
                className="!text-secondary-50 flex items-center flex-wrap ml-1 !cursor-pointer  hover:bg-gray-400"
                onClick={handleOpenTaggedModal}
              >
                others.
              </span>
            </>
          )}

          {post_type === "network user post" && (
            <span
              className="flex items-center ml-1 cursor-pointer !text-secondary-50 flex-wrap"
              onClick={() =>
                navigate(
                  PathConstants.NetworkView.replaceWithObject({
                    id: network_group?.id || "",
                  })
                )
              }
            >
              |
              <span className="ml-1 text-primary-100">
                {network_group?.name}
              </span>
            </span>
          )}
        </Typography>
      </div>
    );
    return name_tagged;
  };

  const renderDelete = () => {
    if (selector.isLoginUserId === user.id)
      return (
        <div>
          <Popover className="relative">
            <Popover.Button>
              <MaterialSymbol
                icon={"more_vert"}
                className="!text-[1.5rem] cursor-pointer"
              />
            </Popover.Button>
            <Popover.Panel className="absolute w-[10rem] bg-white top-0 right-0 shadow px-4 py-2">
              <button
                className="flex items-center gap-4"
                onClick={handleOpenConfirmDeleteModal}
                //  onClick={handleDeleteButton}
              >
                <MaterialSymbol
                  icon={"delete_outline"}
                  className="!text-[1.8rem] text-surface-20"
                />
                <Typography variant="body" size="medium" className="text-black">
                  Delete
                </Typography>
              </button>
              <button
                className="flex items-center gap-4 justify-center ml-[-3px]"
                onClick={handleOpenPinpostModal}
              >
                <PinpostIcon />
                <Typography variant="body" size="medium" className="text-black">
                  {" "}
                  {` ${show_pinned_post_only == 1 ? "Unpin post" : "Pin post"}`}
                </Typography>
              </button>
              {is_tagged_me === 1 && (
                <button
                  className="flex items-center gap-4 justify-center "
                  onClick={handleTagRemoveButton}
                >
                  <MaterialSymbol
                    icon={"sell"}
                    className="!text-[1.5rem] text-surface-20 ml-[5px]"
                  />
                  <Typography
                    variant="body"
                    size="medium"
                    className="text-black"
                  >
                    Remove tag
                  </Typography>
                </button>
              )}
            </Popover.Panel>
          </Popover>
        </div>
      );
    // is_tagged_me
    if (is_tagged_me === 1)
      return (
        <div>
          <Popover className="relative">
            <Popover.Button>
              <MaterialSymbol
                icon={"more_vert"}
                className="!text-[1.5rem] cursor-pointer"
              />
            </Popover.Button>
            <Popover.Panel className="absolute w-[10rem] bg-white top-0 right-0 shadow px-4 py-2">
              <button
                className="flex items-center gap-4 justify-center "
                onClick={handleTagRemoveButton}
              >
                <MaterialSymbol
                  icon={"sell"}
                  className="!text-[1.5rem] text-surface-20 ml-[5px]"
                />
                <Typography variant="body" size="medium" className="text-black">
                  Remove tag
                </Typography>
              </button>
            </Popover.Panel>
          </Popover>
        </div>
      );
  };

  const renderProfileDetails = () => {
    return (
      <>
        {show_pinned_post_only === 1 && (
          <div className="flex align-top text-left mr-2">
            <PinpostIcon />
            <Typography variant="body" size="medium" className="text-black">
              Pinned post
            </Typography>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex cursor-pointer">
            <div
              className="mr-2 cursor-pointer"
              onClick={handleClickUserProfile(user.user_name)}
            >
              <div className="relative videocontainernotification !z-10">
                <Avatar
                  image={user?.profile_image}
                  classNameAvatarContainer="!w-[3rem] !h-[3rem] !z-10"
                  className="!text-[1.9rem] !z-10"
                />
                {user?.is_admin_verified === 1 && (
                  <>
                    <MaterialSymbol
                      className={`text-primary text-center !text-[1.4rem] !z-10 absolute bottom-[-6px] right-0`}
                      icon={"verified"}
                      fill
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              {tagged_users_count > 0 ? (
                tagged_users_render()
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={handleClickUserProfile(user.user_name)}
                >
                  <Typography variant="title" size="medium">
                    {user?.name}
                  </Typography>
                </span>
              )}
              <div className="flex items-center">
                <Typography
                  className="!text-secondary-50 flex items-center flex-wrap"
                  variant="body"
                  size="large"
                >
                  <span className="flex items-center flex-wrap">
                    <span
                      className="cursor-pointer flex items-center flex-wrap"
                      onClick={handleClickUserProfile(user.user_name)}
                    >
                      {user?.user_name
                        ? `@${user?.user_name}`
                        : `@${user?.name}`}
                      <span className="flex items-center flex-wrap">
                        {location && (
                          <>
                            <MaterialSymbol
                              icon={"location_on"}
                              className="text-surface-20 !text-[1.2rem] text-center"
                            />{" "}
                            {location}
                          </>
                        )}{" "}
                      </span>
                      <span className="ml-1 flex items-center flex-wrap">
                        {" "}
                        ~ {convertTimestampToAgo(created_at)}.
                        {tagged_users_count > 0 && (
                          <MaterialSymbol
                            icon={"group"}
                            className="text-surface-20 !text-[1.2rem] text-center ml-1"
                          />
                        )}
                      </span>
                    </span>
                  </span>
                </Typography>
              </div>
              {/* flex wrap new added
                        {/* <div className="flex items-center flex-wrap">
                            <Typography className="!text-secondary-50 flex items-center flex-wrap" variant="body" size="large"><span className="cursor-pointer"
                             onClick={handleClickUserProfile(user.user_name)}>{user?.user_name ? `@${user?.user_name}` : `@${user?.name}`}</span> 
                            <span className="flex items-center">{location && <MaterialSymbol icon={"location_on"} 
                            className="text-surface-20 !text-[1.2rem] text-center"/>} {location ? (<>{location} <span className="mx-1">~</span></>): 
                            (<span className="mx-1">~</span>)} {convertTimestampToAgo(created_at)}.</span>
                            <span className="!text-secondary-50 flex items-center flex-wrap ml-1">
                                                            {tagged_users_count > 0 && <MaterialSymbol icon={"group"} 
                            className="text-surface-20 !text-[1.2rem] text-center"/>} 
                            </span>

                            </Typography>
                        </div> */}
            </div>
          </div>
          {renderDelete()}
        </div>
      </>
    );
  };
  // const handleVideoView = () =>{
  //     setViewCount(prevCount=> prevCount + 1);

  // }
  const renderPostImage = () => {
    if (choice == "video" || choice == "Video") {
      return (
        <div className="py-2 laptop:px-[7%] flex items-center justify-center scrollbarzindex ">
          <video
            controls
            className="rounded-[0.75rem] overflow-hidden popovervideo"

            // onPlay={handleVideoView}
          >
            <source className="rounded-[0.75rem]" src={video?.[0]} />
          </video>
        </div>
      );
    }
    return (
      <div
        className={`py-2 ${
          image?.length > 1
            ? "grid grid-cols-2 gap-1 c"
            : " flex items-center justify-center laptop:px-[7%]"
        }`}
      >
        {image?.map((item: string, key: number) => {
          return (
            <img
              onClick={() => handlePreviewImage(key)}
              className={`w-full h-[17rem]  object-cover rounded-[0.75rem] ${
                image?.length > 1
                  ? "border border-surface-10 !h-[10rem] tablet:!h-[15rem] laptop:!h-[18rem]"
                  : "laptop:h-[24rem]"
              }`}
              key={key}
              loading="lazy"
              src={item}
              alt="post image"
            />
          );
        })}
      </div>
    );
  };

  const renderSinglePost = () => {
    console.log("Clicked");
  };
  const renderPostContent = () => {
    return (
      <React.Fragment>
        <Typography
          variant="title"
          size="large"
          className="!font-medium pb-2 break-all"
        >
          {title}
        </Typography>
        <ReadMore count={150} text={text ?? ""} />
        <div className="my-2">
          {meta_links?.map((item, key) => {
            return <MetaCard {...item} key={key} />;
          })}
        </div>
      </React.Fragment>
    );
  };

  const renderLike = (like: string) => {
    return (
      <button className="cursor-pointer" onClick={doLike} disabled={isPending}>
        <div className="flex gap-[0.52rem] items-center justify-center">
          {isPending ? (
            <Loading iconClassName="w-[1.4rem] h-[1.4rem]" />
          ) : (
            <MaterialSymbol
              icon="favorite_border"
              className={`!text-[1.4rem] ${isLiked ? "text-primary" : ""}`}
              fill={Boolean(isLiked)}
            />
          )}
          {/* !text-red-1 */}
          <Typography variant="body" size="large" className="text-surface-20">
            {like}
          </Typography>
        </div>
        <Typography
          variant="body"
          size="large"
          className="text-center text-surface-20"
        >
          Likes
        </Typography>
      </button>
    );
  };
  const renderView = (view: string) => {
    return (
      <button className="cursor-pointer">
        <div className="flex gap-[0.52rem] items-center justify-center">
          <ViewIcon className="w-[1.2rem] h-[1.2rem]" />
          <Typography variant="body" size="large" className="text-surface-20">
            {view}
          </Typography>
        </div>
        <Typography
          variant="body"
          size="large"
          className="text-center text-surface-20"
        >
          Views
        </Typography>
      </button>
    );
  };

  const renderPostInteraction = () => {
    if (hidePostInteraction) return <></>;
    if (IsLoadingPostDetails) return <></>;
    return (
      <div className="flex pt-2 justify-between">
        {renderLike(postDetailData?.data?.like_count)}
        {renderView(postDetailData?.data?.view_count)}
        {/* views:{viewCount} */}
        <div className="cursor-pointer" onClick={handleOpenCommentModal}>
          <div className="flex gap-[0.52rem] items-center justify-center">
            <MaterialSymbol
              icon="chat_bubble_outline"
              className="!text-[1.4rem] text-surface-20"
            />
            <Typography variant="body" size="large" className="text-surface-20">
              {postDetailData?.data?.comment_count}
            </Typography>
          </div>
          <Typography
            variant="body"
            size="large"
            className="text-center text-surface-20"
          >
            Remarks
          </Typography>
        </div>
        <div className="cursor-pointer" onClick={handleOpenReShareModal}>
          <div className="flex gap-[0.52rem] items-center justify-center">
            <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-primary flex items-center justify-center">
              <img
                src="Assets/Images/share.png"
                className="w-[0.875rem]"
                alt="share"
              />
            </div>
            <Typography
              variant="body"
              size="large"
              className="text-surface-20"
            ></Typography>
          </div>
          <Typography
            variant="body"
            size="large"
            className="text-center text-surface-20"
          >
            Share
          </Typography>
        </div>

        {postDetailData?.data?.is_my_post === 1 || user?.role === 5 ? (
          <></>
        ) : (
          <div
            className="cursor-pointer"
            //    onClick={handleReportButton}
            onClick={handleOpenReportModal}
          >
            <div className="flex gap-[0.52rem] items-center justify-center">
              <MaterialSymbol
                icon="flag"
                className="!text-[1.4rem] text-surface-20"
              />
            </div>
            <Typography
              variant="body"
              size="large"
              className="text-center text-surface-20"
            >
              Report
            </Typography>
          </div>
        )}
      </div>
    );
  };

  if (isSuccess) return <></>;
  return (
    <React.Fragment>
      <div className="p-4 bg-white b500:rounded-t-[0.75rem] border-b border-outline-light">
        {renderProfileDetails()}
        {renderPostImage()}
        {renderPostContent()}
        {renderPostInteraction()}
        {openComment && (
          <PostCommentModal
            usePublic={usePublic}
            post_id={id}
            open={openComment}
            handle={handleOpenCommentModal}
          />
        )}

        {openReport && (
          <PostReportModal
            usePublic={usePublic}
            post_id={id}
            open={openReport}
            onReportSuccess={onReportSuccess}
            handle={handleOpenReportModal}
          />
        )}
        {typeof openPreviewModal == "number" && (
          <PhotoViewer
            index={openPreviewModal}
            images={image}
            handlePreviewImage={handlePreviewImage}
          />
        )}
        {openReshareModal && (
          <ReSharePostModal
            link={RE_SHARE_LINK.replaceWithObject({ id: id, type: "post" })}
            openReshareModal={openReshareModal}
            handleOpenReShareModal={handleOpenReShareModal}
            copyPostLink={copyPostLink}
          />
        )}
        {openPinpost && (
          <PinpostModal
            usePublic={usePublic}
            post_id={id}
            open={openPinpost}
            onReportSuccess={onPinpostSuccess}
            handle={handleOpenPinpostModal}
            show_pinned_post_only={show_pinned_post_only}
            reFetchProfileData={PostDetailReFetch}
          />
        )}
        {openTaggedpost && (
          <TaggedModal
            taggedusers={tagged_users}
            usePublic={usePublic}
            post_id={id}
            open={openTaggedpost}
            onReportSuccess={onTagpostSuccess}
            handle={handleOpenTaggedModal}
            show_pinned_post_only={show_pinned_post_only}
            reFetchProfileData={PostDetailReFetch}
          />
        )}
        {openTagremovepost && (
          <TagRemove
            usePublic={usePublic}
            post_id={id}
            tagid={tagid}
            open={openTagremovepost}
            onReportSuccess={onTagpostSuccess}
            handle={handleTagRemoveButton}
            userId={selector.isLoginUserId}
            reFetchProfileData={PostDetailReFetch}
            profileDataOnly={profileDataOnly}
          />
        )}
      </div>
      <DeleteConfirm
        isOpen={openConfirmDelete}
        closeModal={handleOpenConfirmDeleteModal}
        onClickYes={handleDeleteButton}
        buttonName="Yes"
      >
        <div className="pb-6 flex items-center justify-center">
          <Typography variant="body" size="large" className="text-black">
            Are you sure you want to delete?
          </Typography>
        </div>
      </DeleteConfirm>
    </React.Fragment>
  );
};

export default PostCard;
