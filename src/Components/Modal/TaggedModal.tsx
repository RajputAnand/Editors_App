import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Typography from "../Typography/Typography.tsx";
import {
  QueryObserverResult,
  RefetchOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import Avatar from "../Avatar/Avatar.tsx";
import { PathConstants } from "../../Router/PathConstants.ts";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../Hooks/usePost.tsx";
import { Endpoints } from "../../Api/Endpoints.ts";
import { MaterialSymbol } from "react-material-symbols";

interface IPostReportModal {
  open: boolean;
  handle: () => void;
  post_id: string;
  onClose?: () => void;
  usePublic?: boolean;
  onReportSuccess?: () => void;
  show_pinned_post_only?: number;
  onDeleteSuccess?: () => void;
  reFetchProfileData: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, any>>;
  taggedusers?: any;
}

const TaggedModal: FC<IPostReportModal> = (props) => {
  const {
    open,
    handle,
    post_id,
    onClose,
    usePublic,
    onReportSuccess,
    show_pinned_post_only,
    onDeleteSuccess,
    reFetchProfileData,
    taggedusers,
  } = props;
  const { deletePostTag } = usePost();
  const { mutate: deleteMutate, isSuccess } = deletePostTag({
    mutationKey: [
      Endpoints.DeletePostTag.replaceWithObject({ id: post_id }),
      "DELETE",
    ],
  });
  const handleOnClose = () => {
    handle();
    if (onClose) onClose();
  };
  const navigate = useNavigate();
  const handleClickUserProfile = (user_name: string) => () => {
    if (usePublic) return;
    return navigate(
      PathConstants.UserView.replaceWithObject({ username: user_name })
    );
  };
  const handleDeleteButton = () => {
    // const handleDeleteOnSuccess = () => {
    //     if (onDeleteSuccess) onDeleteSuccess()
    //      window.location.reload()
    //     // reFetchProfileData().then(() => null)
    //      return reFetchProfileData().then(r => r)
    // }
    // deleteMutate({
    //   "post_id": 1,
    //   "receiver_user_id": 1
    // }, {
    //     onSuccess: handleDeleteOnSuccess });
  };
  const renderListing = () => {
    const taggedname =
      taggedusers?.slice(1).map((item: any,index:any) => ( 
      // taggedusers?.map((item: any, index: any) => (
        <div
          key={index}
          className="flex items-center px-4 tablet:px-0 !cursor-pointer pl-2 mb-2"
          onClick={handleClickUserProfile(item?.user_name)}
        >
          <div className="col-span-1">
            {" "}
            <Avatar image={item?.profile_image} className="max-w-[2.6rem]" />
          </div>
          <div className="pl-3 flex gap-2">
            <Typography
                variant="title"
                size="medium"
                className="text-surface-10 !font-normal"
              >
                <span className="text-surface-10 font-bold mr-1">
                  {item?.name}
                </span>
              </Typography>
             
              {/* <button
                className="flex items-center gap-4"
                onClick={handleDeleteButton}
              >
                <MaterialSymbol
                  icon={"delete_outline"}
                  className="!text-[1.8rem] text-surface-20"
                />
              </button> */}
              </div>
          
           
          </div>
      

        //   <Typography className="flex 1text-center py-2  text-secondary-50 !font-normal truncate bodyMedium mb-2">
        //    {item?.name}
        //   </Typography>
      ));

    return taggedname;
  };
  const renderDelete = () => {
    return (
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleOnClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    );
  };
  if (isSuccess) return <></>;
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleOnClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center tablet:items-center tablet:justify-end tablet:pr-[2.88rem] laptop:justify-center laptop:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="transform overflow-hidden rounded-2xl p-4 text-left align-middle bg-white shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] transition-all w-full tablet:tablet:w-[66%] laptop:w-[43%] tablet:px-[1.88rem] laptop:px-[2rem]">
                {/* {renderHeader()} */}
                {renderListing()}
                {renderDelete()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaggedModal;
