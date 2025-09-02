import { FC, Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Buttons/Button.tsx";
import { LiveCreatedUser } from "../../Types/LiveCreatedUser.ts";
import Avatar from "../Avatar/Avatar.tsx";

interface IPromptModal extends PropsWithChildren {
    isOpen: boolean,
    onRejectClicked: () => void,
    onAcceptClicked?: () => void,
    invitedUser: LiveCreatedUser
    acceptPending: boolean;
    rejectPending: boolean;
}

const LiveAcceptModal: FC<IPromptModal> = (props) => {

    const { isOpen, onRejectClicked, onAcceptClicked, invitedUser, acceptPending, rejectPending } = props

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={()=>{}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className={`fixed inset-0 bg-white/50`} />
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
                            <Dialog.Panel className="max-w-[31.625rem] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-8 border border-outline-light" style={{ boxShadow: "2px 4px 7px 0px rgba(62, 97, 220, 0.07)" }}>
                                <div className="w-full flex flex-col items-center justify-center gap-5 pb-7">
                                    <Avatar
                                        // classNameImage="opennotification"
                                        image={invitedUser.profile_image}
                                        className="!text-[3rem]"
                                        classNameAvatarContainer={`h-[4.5rem] w-[4.5rem] ${invitedUser.profile_image ? "" : "!bg-surface-light"}`}
                                    />
                                    {invitedUser.name} has invited you to join them in a live.
                                </div>
                                <div className="w-full grid grid-cols-2 items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="!px-4 py-[0.6rem] flex items-center justify-center !leading-none !border-outline !min-w-[7rem]"
                                        onClick={onRejectClicked}
                                        isLoading={rejectPending}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="!px-4 py-[0.6rem] flex items-center !bg-blue-500 justify-center !leading-none !border-outline !min-w-[7rem]"
                                        onClick={onAcceptClicked}
                                        isLoading={acceptPending}
                                    >
                                        Accept
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default LiveAcceptModal