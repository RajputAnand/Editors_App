import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";
import { MaterialSymbol } from "react-material-symbols";
import Button from "../../Buttons/Button";
import TextField from "../../Inputs/TextField";
import TextAreaField from "../../Inputs/TextAreaField";
import { useForm } from "react-hook-form";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery";
import toast from "react-hot-toast";
import { Endpoints } from "../../../Api/Endpoints";
import { queryClient } from "../../../Api/Client";

interface IAddNetworkPostModal {
  open: boolean;
  handle: () => void;
  onClose?: () => void;
  post_id?: string;
  title?: string;
  text?: string;
  location: string;
}

export const EditNetworkPostModal: FC<IAddNetworkPostModal> = (props) => {
  const { handle, open, onClose, post_id, location, text, title } = props;
  const { control, handleSubmit, setError } = useForm({
    defaultValues: {
      title: title,
      text: text,
      location: location,
    },
    reValidateMode: "onChange",
  });
  const handleOnClose = () => {
    handle();
    if (onClose) onClose();
  };

  const handlePostOnSuccess = (data: any) => {
    toast.success(data?.message);
    handleOnClose();
    queryClient.invalidateQueries({
      queryKey: [Endpoints.NetworkFeedPosts],
    });
  };

  const { mutate, isPending } = useMutationQuery(
    {
      mutationKey: [
        Endpoints.UpdateNetworkPost.replaceWithObject({ id: post_id || "" }),
        "POST",
      ],
      onSuccess: handlePostOnSuccess,
    },
    true,
    setError
  );

  const onSubmit = (data: any) => {
    //  mutate(data);
    // const { hashtags, links } = extractHashtagsAndLinks(data.text);
    // const dataIds = JSON.stringify(selectedUserIds);

    mutate({
      location: data?.location,
      text: data?.text,
      title: data?.title,
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-[1.25rem]">
        <MaterialSymbol
          icon={"close"}
          fill
          className="!text-[2rem] text-[#80839F] cursor-pointer"
          as={"div"}
          onClick={handleOnClose}
        />
      </div>
    );
  };

  const renderListing = () => {
    return (
      <div className="w-full min-w-[2.75rem] rounded-lg  bg-white p-[0.06rem] sm:p-[0.06rem]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <h2 className="text-[#0E0E0E] font-bold text-lg">Update Post</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mt-4 mb-4 ">
            <TextField
              classNameContainer="mb-4"
              classNameOutline="border-none"
              className="bg-[#77768029] placeholder:!text-surface-20"
              control={control}
              placeHolder="Add title"
              name={"title"}
            />
            <TextField
              classNameContainer="mb-4"
              classNameOutline="border-none"
              className="bg-[#77768029] placeholder:!text-surface-20"
              control={control}
              placeHolder="Add location"
              name={"location"}
            />
            <TextAreaField
              classNameContainer="mb-4"
              classNameOutline="border-none"
              className="bg-[#77768029] placeholder:!text-surface-20 h-[10rem]"
              control={control}
              placeHolder="Add your message here ..."
              name={"text"}
            />

            <div className="flex justify-end gap-2 w-full">
              <Button
                variant="outline"
                className="!leading-none !font-medium w-full text-primary bg-white"
                onClick={handleOnClose}
              >
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                variant="primary"
                className="!leading-none !font-medium w-full"
                type="submit"
              >
                POST
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  };

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
                {renderHeader()}
                {renderListing()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
