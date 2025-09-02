import { FC, Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MaterialSymbol } from "react-material-symbols";
import Button from "../Buttons/Button.tsx";
import Typography from "../Typography/Typography.tsx";
import { useNetworkPost } from "../../Hooks/useNetworkPost.tsx";
import { Endpoints } from "../../Api/Endpoints.ts";
import toast from "react-hot-toast";
import { queryClient } from "../../Api/Client.tsx";
import { useNetworkDetais } from "../../Hooks/useNetwork.tsx";

interface IPromptModal extends PropsWithChildren {
  isOpen: boolean;
  closeModal: () => void;
  onClickYes?: () => void;
  hideButtons?: boolean;
  bgClassName?: string;
  networkName?: string;
  is_from?: boolean;
  networkGroupId?: any;
  networkInviteCode?: string;
  onRefetch?: () => void;
}

const NetworkNavigationModal: FC<IPromptModal> = (props) => {
  const {
    isOpen,
    closeModal,
    children,
    onClickYes,
    hideButtons = false,
    bgClassName,
    networkName,
    is_from,
    networkInviteCode,
    onRefetch,
  } = props;

  const { joinNetwork } = useNetworkPost();
  const { mutate, isPending: isJoiningNetworkPending } = joinNetwork({
    mutationKey: [
      Endpoints.NetworkMemberJoin.replaceWithObject({
        invitation_code: networkInviteCode || "",
      }),
      "PUT",
    ],
  });

  const handleJoin = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          toast.success(`You have joined the ${networkName} `);
          onRefetch && onRefetch();
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
          closeModal();
          window.location.reload();
        },
        onError: (data) => {
          toast.success(data?.message);
        },
      }
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 bg-white/50 ${bgClassName}`} />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-[31.625rem] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-4 border border-outline-light"
                style={{ boxShadow: "2px 4px 7px 0px rgba(62, 97, 220, 0.07)" }}
              >
                <div className="w-full flex items-center justify-end">
                  <MaterialSymbol
                    as="div"
                    className="!text-[1.8rem] text-outline-600 outline-none"
                    onClick={closeModal}
                    icon={"close"}
                    fill
                  />
                </div>
                {children}
                {!hideButtons && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="primary"
                      isLoading={isJoiningNetworkPending}
                      className="!px-4 py-[0.6rem] flex items-center !bg-primary-50 justify-center !leading-none !border-outline !min-w-[7rem]"
                      onClick={is_from ? handleJoin : onClickYes}
                    >
                      {is_from ? "Join network" : "View Network"}
                    </Button>
                    <Button
                      variant="outline"
                      className="!px-4 py-[0.6rem] flex items-center justify-center !leading-none !border-outline !min-w-[7rem]"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NetworkNavigationModal;
